export function sourceInfo(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return { valid: false };
    const mkv = /\.mkv$/i.test(url.pathname);
    const discord = ['cdn.discordapp.com', 'media.discordapp.com', 'media.discordapp.net'].includes(url.hostname) && url.pathname.startsWith('/attachments/');
    return { valid: true, mkv, discord, direct: mkv || /\.(mp4|webm|m4v|mov|ogv|ogg)$/i.test(url.pathname), torrent: /\.torrent$/i.test(url.pathname), url: url.href };
  } catch { return { valid: false }; }
}
export function alternateDiscordUrl(value) {
  const info = sourceInfo(value);
  if (!info.discord) return null;
  const url = new URL(value);
  url.hostname = url.hostname === 'cdn.discordapp.com' ? 'media.discordapp.net' : 'cdn.discordapp.com';
  return url.href;
}
export function subtitleSourceUrl(value) {
  try {
    const url = new URL(value);
    if (['cdn.discordapp.com', 'media.discordapp.com'].includes(url.hostname) && url.pathname.startsWith('/attachments/')) {
      url.hostname = 'media.discordapp.net';
      return url.href;
    }
  } catch {}
  return value;
}
