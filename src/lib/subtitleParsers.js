// Utility to parse SRT and WebVTT subtitle files into cue objects { start, end, text }

export function parseTime(timeStr) {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().replace(',', '.');
  const parts = cleaned.split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return minutes * 60 + seconds;
  }
  return parseFloat(cleaned) || 0;
}

export function formatTime(seconds) {
  const s = Math.max(0, Number(seconds) || 0);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 1000);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

export function parseSrtOrVtt(content) {
  if (!content || typeof content !== 'string') return [];

  // Normalize line breaks
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Regex to match timestamp lines: e.g. 00:01:23,456 --> 00:01:26,789
  const timestampRegex = /((?:\d{1,2}:)?\d{2}:\d{2}[,.]\d{2,3})\s*-->\s*((?:\d{1,2}:)?\d{2}:\d{2}[,.]\d{2,3})/;

  const lines = normalized.split('\n');
  const cues = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Check if line contains timestamp
    const match = line.match(timestampRegex);
    if (match) {
      const start = parseTime(match[1]);
      const end = parseTime(match[2]);
      i++;

      const textLines = [];
      while (i < lines.length && lines[i].trim() !== '') {
        // Strip basic HTML/ASS formatting tags
        const cleanLine = lines[i]
          .replace(/<[^>]*>/g, '')
          .replace(/\{[^}]*\}/g, '')
          .trim();
        if (cleanLine) textLines.push(cleanLine);
        i++;
      }

      if (textLines.length > 0 && end > start) {
        cues.push({
          start,
          end,
          text: textLines.join('\n'),
        });
      }
    } else {
      i++;
    }
  }

  return cues;
}

export function cuesToVtt(cues) {
  if (!Array.isArray(cues) || cues.length === 0) return 'WEBVTT\n\n';
  let out = 'WEBVTT\n\n';
  cues.forEach((cue, index) => {
    out += `${index + 1}\n`;
    out += `${formatTime(cue.start)} --> ${formatTime(cue.end)}\n`;
    out += `${cue.text}\n\n`;
  });
  return out;
}

