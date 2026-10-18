import { TextDecoder } from 'util';
global.TextDecoder = TextDecoder;
const { MkvSubtitles, subtitleText } = require('./mkvSubtitles');
const bytes = (...values) => Buffer.concat(values.map(value => Buffer.from(value)));
function size(value) {
  for (let width = 1; width < 5; width++) if (value < 2 ** (7 * width) - 1) {
    const out = Buffer.alloc(width); let number = value;
    for (let i = width - 1; i >= 0; i--) { out[i] = number & 255; number = Math.floor(number / 256); }
    out[0] |= 1 << (8 - width); return out;
  }
  throw new Error('Test size too large');
}
const el = (id, payload) => bytes(Buffer.from(id, 'hex'), size(payload.length), payload);
const uint = value => { const b = Buffer.alloc(4); b.writeUInt32BE(value); return b; };
const text = value => Buffer.from(value, 'utf8');
function track(codec = 'S_TEXT/UTF8') { return el('ae', bytes(el('d7', [1]), el('83', [17]), el('86', text(codec)), el('22b59c', text('por')), el('536e', text('Português')))); }
function block(content, relative = 500, number = 1) { const b = Buffer.alloc(4); b[0] = 0x80 | number; b.writeInt16BE(relative, 1); return bytes(b, text(content)); }
function fixture(codec = 'S_TEXT/UTF8', content = 'Olá, mundo!', { unknown = false } = {}) {
  const group = el('a0', bytes(el('a1', block(content)), el('9b', uint(2500))));
  const cluster = el('1f43b675', bytes(el('e7', uint(1000)), el('a3', block('VIDEO IGNORED', 0, 2)), group));
  const segment = bytes(el('1549a966', el('2ad7b1', uint(1000000))), el('1654ae6b', track(codec)), cluster);
  return bytes(el('1a45dfa3', []), unknown ? bytes(Buffer.from('18538067ff', 'hex'), segment) : el('18538067', segment));
}
function parse(data, chunkSize = 1) {
  const tracks = [], cues = [];
  const parser = new MkvSubtitles(t => tracks.push(t), (t, cue) => cues.push({ track: t.number, ...cue }));
  for (let i = 0; i < data.length; i += chunkSize) parser.push(data.subarray(i, i + chunkSize));
  parser.finish(); return { tracks, cues, parser };
}
test('MKV em chunks de um byte preserva idioma, início e duração e ignora vídeo', () => {
  const result = parse(fixture());
  expect(result.tracks[0]).toMatchObject({ language: 'por', name: 'Português', supported: true });
  expect(result.cues).toEqual([{ track: 1, start: 1.5, end: 4, text: 'Olá, mundo!', estimated: false }]);
  expect(result.parser.buffer.length).toBe(0);
});
test('ASS/SSA retira cabeçalhos, estilos e desenhos sem perder vírgulas no diálogo', () => {
  const value = '0,0,Default,,0,0,0,,{\\i1}Olá, mundo!{\\i0}\\NSegunda linha';
  expect(parse(fixture('S_TEXT/ASS', value), 13).cues[0].text).toBe('Olá, mundo!\nSegunda linha');
  expect(subtitleText('0,0,Default,,0,0,0,,{\\p1}m 0 0 l 50 50{\\p0}Texto', 'S_TEXT/SSA')).toBe('Texto');
});
test('WebVTT de Matroska preserva as primeiras linhas do texto', () => {
  expect(parse(fixture('S_TEXT/WEBVTT', 'Primeira\nSegunda\nTerceira'), 11).cues[0].text).toBe('Primeira\nSegunda\nTerceira');
});
test('WebVTT legado de WebM descarta apenas identificador e configurações', () => {
  expect(parse(fixture('D_WEBVTT/SUBTITLES', 'id\nalign:middle\nLegenda'), 5).cues[0].text).toBe('Legenda');
});
test('legendas em imagem são listadas como não suportadas', () => {
  const result = parse(fixture('S_HDMV/PGS'));
  expect(result.tracks[0].supported).toBe(false); expect(result.cues).toHaveLength(0);
});
test('segmentos com tamanho desconhecido são aceitos', () => {
  expect(parse(fixture('S_TEXT/UTF8', 'Legenda', { unknown: true }), 7).cues[0].text).toBe('Legenda');
});
test('arquivo inválido ou truncado gera erro em vez de legenda falsa', () => {
  expect(() => parse(Buffer.from('<html>erro</html>'))).toThrow();
  expect(() => parse(fixture().subarray(0, -2))).toThrow(/fim/);
});
