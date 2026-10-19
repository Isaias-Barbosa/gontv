// Incremental Matroska subtitle reader. Audio/video payloads are discarded, never retained.
// Container mappings: https://www.matroska.org/technical/subtitles.html
import { isBrazilianPortuguese } from './subtitleLanguage';
const utf8 = new TextDecoder();
function vint(bytes, offset, id = false) {
  if (offset >= bytes.length) return null;
  const first = bytes[offset];
  let size = 1,
    mask = 128;
  while (size <= 8 && !(first & mask)) {
    size++;
    mask >>= 1;
  }
  if (size > 8 || (id && size > 4)) throw Error('Cabeçalho MKV inválido.');
  if (offset + size > bytes.length) return null;
  let value = id ? first : first & mask - 1,
    unknown = !id && value === mask - 1;
  for (let i = 1; i < size; i++) {
    value = value * 256 + bytes[offset + i];
    unknown = unknown && bytes[offset + i] === 255;
  }
  if (!unknown && !Number.isSafeInteger(value)) throw Error('Tamanho MKV fora do limite seguro.');
  return {
    size,
    value: unknown ? Infinity : value
  };
}
function uint(b) {
  let n = 0;
  for (const v of b) n = n * 256 + v;
  return n;
}
function elements(b, visit) {
  let p = 0;
  while (p < b.length) {
    const id = vint(b, p, true);
    if (!id) throw Error('Metadados incompletos.');
    const len = vint(b, p + id.size);
    if (!len) throw Error('Metadados incompletos.');
    const start = p + id.size + len.size,
      end = start + len.value;
    if (!Number.isFinite(end) || end > b.length) throw Error('Metadados MKV inválidos.');
    visit(id.value, b.subarray(start, end));
    p = end;
  }
}
export function subtitleText(text, codec) {
  if (codec === 'S_TEXT/ASS' || codec === 'S_TEXT/SSA') {
    let start = 0;
    for (let i = 0; i < 8; i++) {
      start = text.indexOf(',', start);
      if (start < 0) return '';
      start++;
    }
    text = text.slice(start);
    // Drop ASS drawing spans and override tags; retain readable dialogue.
    text = text.replace(/\{\\p[1-9][^}]*\}.*?(?=\{\\p0\}|$)/gs, '').replace(/\{[^}]*\}/g, '').replace(/\\[Nn]/g, '\n').replace(/\\h/g, ' ');
  }
  return text.replace(/\r/g, '').replace(/<[^>]*>/g, '').trim();
}
export class MkvSubtitles {
  constructor(onTrack, onCue) {
    this.onTrack = onTrack;
    this.onCue = onCue;
    this.buffer = new Uint8Array();
    this.position = 0;
    this.skip = 0;
    this.stack = [];
    this.tracks = new Map();
    this.scale = 1000000;
    this.cluster = 0;
    this.valid = false;
    this.cueCount = 0;
  }
  tracksData(bytes) {
    elements(bytes, (id, entry) => {
      if (id !== 0xae) return;
      const t = {
        number: 0,
        type: 0,
        codec: '',
        language: 'und',
        name: '',
        duration: 0,
        unsupported: false
      };
      elements(entry, (key, b) => {
        switch (key) {
          case 0xd7:
            t.number = uint(b);
            break;
          case 0x83:
            t.type = uint(b);
            break;
          case 0x86:
            t.codec = utf8.decode(b);
            break;
          case 0x22b59c:
            if (t.language === 'und') t.language = utf8.decode(b);
            break;
          case 0x22b59d:
            t.language = utf8.decode(b);
            break;
          case 0x536e:
            t.name = utf8.decode(b);
            break;
          case 0x23e383:
            t.duration = uint(b) / 1e9;
            break;
          case 0x6d80:
            t.unsupported = true;
            break;
          default:
            break;
        }
      });
      if (t.type === 17 && isBrazilianPortuguese(t)) {
        if (this.tracks.size >= 64) throw Error('O arquivo excede o limite de faixas de legenda.');
        t.supported = !t.unsupported && ['S_TEXT/UTF8', 'S_TEXT/ASS', 'S_TEXT/SSA', 'S_TEXT/WEBVTT', 'D_WEBVTT/SUBTITLES', 'D_WEBVTT/CAPTIONS'].includes(t.codec);
        this.tracks.set(t.number, t);
        this.onTrack(t);
      }
    });
  }
  block(bytes, duration) {
    const track = vint(bytes, 0);
    if (!track || bytes.length < track.size + 3) return;
    const t = this.tracks.get(track.value);
    if (!t?.supported) return;
    let rel = bytes[track.size] * 256 + bytes[track.size + 1];
    if (rel >= 32768) rel -= 65536;
    const flags = bytes[track.size + 2];
    if (flags & 6) return;
    let text = utf8.decode(bytes.subarray(track.size + 3));
    if (t.codec.startsWith('D_WEBVTT/')) {
      const lines = text.split('\n');
      text = lines.slice(2).join('\n');
    }
    text = subtitleText(text, t.codec);
    const start = (this.cluster + rel) * this.scale / 1e9;
    const length = duration === undefined ? t.duration : duration * this.scale / 1e9;
    if (text.length > 65536) throw Error('Uma fala excede o limite de tamanho.');
    if (text && start >= 0) {
      if (++this.cueCount > 200000) throw Error('O arquivo excede o limite de falas.');
      this.onCue(t, {
        start,
        end: start + (length > 0 ? length : 3),
        text,
        estimated: !length
      });
    }
  }
  close() {
    while (this.stack.length && this.position >= this.stack.at(-1).end) {
      const frame = this.stack.pop();
      if (frame.id === 0xa0 && frame.block) this.block(frame.block, frame.duration);
    }
  }
  push(chunk) {
    let b = new Uint8Array(this.buffer.length + chunk.length);
    b.set(this.buffer);
    b.set(chunk, this.buffer.length);
    let p = 0;
    while (p < b.length) {
      this.close();
      if (this.skip) {
        const n = Math.min(this.skip, b.length - p);
        p += n;
        this.position += n;
        this.skip -= n;
        continue;
      }
      const id = vint(b, p, true);
      if (!id) break;
      const len = vint(b, p + id.size);
      if (!len) break;
      const header = id.size + len.size,
        payload = p + header,
        end = this.position + header + len.value;
      if (!this.valid) {
        if (id.value !== 0x1a45dfa3) throw Error('Este link não retornou um arquivo MKV/WebM válido.');
        this.valid = true;
      }
      // Unknown-sized clusters end at the next cluster or segment-level element.
      if ([0x1f43b675, 0x1c53bb6b, 0x1254c367, 0x114d9b74, 0x1549a966, 0x1654ae6b, 0x1941a469, 0x1043a770].includes(id.value) && this.stack.at(-1)?.id === 0x1f43b675 && this.stack.at(-1).end === Infinity) this.stack.pop();
      if ([0x18538067, 0x1f43b675, 0xa0].includes(id.value)) {
        if (id.value === 0x1f43b675) this.cluster = 0;
        if (this.stack.length >= 64) throw Error('Estrutura MKV profunda demais.');
        this.stack.push({
          id: id.value,
          end
        });
        p = payload;
        this.position += header;
        continue;
      }
      if (!Number.isFinite(len.value)) throw Error('Elemento MKV com tamanho desconhecido não suportado.');
      if (id.value === 0xa1 || id.value === 0xa3) {
        const track = vint(b, payload);
        if (!track) break;
        if (!this.tracks.get(track.value)?.supported) {
          p = payload;
          this.position += header;
          this.skip = len.value;
          continue;
        }
      }
      const needed = [0x1654ae6b, 0x1549a966, 0xe7, 0xa3, 0xa1, 0x9b].includes(id.value);
      if (needed) {
        if (len.value > 32 * 1024 * 1024) throw Error('Bloco MKV grande demais para esta leitura.');
        if (payload + len.value > b.length) break;
        const data = b.subarray(payload, payload + len.value),
          group = this.stack.at(-1);
        if (id.value === 0x1654ae6b) this.tracksData(data);
        if (id.value === 0x1549a966) elements(data, (key, value) => {
          if (key === 0x2ad7b1) this.scale = uint(value);
        });
        if (id.value === 0xe7) this.cluster = uint(data);
        if (id.value === 0xa3) this.block(data);
        if (id.value === 0xa1 && group?.id === 0xa0) {
          const n = vint(data, 0);
          if (n && this.tracks.get(n.value)?.supported) group.block = data.slice();
        }
        if (id.value === 0x9b && group?.id === 0xa0) group.duration = uint(data);
        p = payload + len.value;
        this.position += header + len.value;
      } else {
        p = payload;
        this.position += header;
        this.skip = len.value;
      }
    }
    this.close();
    this.buffer = b.slice(p);
  }
  finish() {
    this.close();
    if (!this.valid || this.buffer.length || this.skip || this.stack.some(f => Number.isFinite(f.end) && f.end > this.position)) throw Error('A leitura terminou antes do fim do arquivo MKV.');
  }
}
