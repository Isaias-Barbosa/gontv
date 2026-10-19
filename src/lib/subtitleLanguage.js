const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function isBrazilianPortuguese({ language, name } = {}) {
  const code = normalize(language);
  const label = normalize(name);
  // An explicit different locale wins over a contradictory display name.
  if (/^(?:pt|por) (?!br(?: |$))[a-z]{2}(?: |$)/.test(code)) return false;
  if (/\b(?:portugal|european|europeu|europeia)\b/.test(label) || /\b(?:pt|por) pt\b/.test(label)) return false;
  const combined = `${code} ${label}`;
  return /\b(?:pt|por) br\b|\b(?:ptbr|porbr)\b|\bbrazilian\b|\bbrasileir[oa]\b/.test(combined)
    || (/\b(?:portuguese|portugues|pt|por)\b/.test(combined) && /\b(?:brazil|brasil|br)\b/.test(combined));
}
