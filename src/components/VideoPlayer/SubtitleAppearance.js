import React, { useEffect, useId, useState } from 'react';
const storageKey = 'gontv.subtitle-appearance.v1';
export const defaultAppearance = { size: 'normal', color: 'white', background: 'none', shadow: 'none' };
const choices = {
  size: { small: ['Pequena', '0.9em'], normal: ['Normal', '1.15em'], large: ['Grande', '1.45em'], extra: ['Muito grande', '1.8em'] },
  color: { white: ['Branco', '#ffffff'], yellow: ['Amarelo', '#ffe45c'], green: ['Verde', '#a3ffb0'] },
  background: { none: ['Sem fundo', 'transparent'], soft: ['Preto translúcido', 'rgba(0,0,0,0.55)'], black: ['Preto sólido', '#000000'] },
  shadow: { none: ['Sem sombra', 'none'], soft: ['Sombra suave', '1px 1px 2px #000000'], outline: ['Contorno', '-1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000'] },
};
const labels = { size: 'Tamanho da legenda', color: 'Cor da legenda', background: 'Fundo da legenda', shadow: 'Sombreamento da legenda' };
function readAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Object.fromEntries(Object.keys(defaultAppearance).map(key => [key, Object.hasOwn(choices[key], saved?.[key]) ? saved[key] : defaultAppearance[key]]));
  } catch { return { ...defaultAppearance }; }
}
export default function SubtitleAppearance({ targetId }) {
  const [appearance, setAppearance] = useState(readAppearance);
  const id = useId();
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(appearance)); } catch { /* Preferences still apply when storage is unavailable. */ }
  }, [appearance]);
  const style = { color: choices.color[appearance.color][1], backgroundColor: choices.background[appearance.background][1], fontSize: choices.size[appearance.size][1], textShadow: choices.shadow[appearance.shadow][1] };
  // Use validated literal values: native video cues do not consistently inherit custom properties.
  const cueStyle = `#${targetId} video::cue { color: ${style.color}; background-color: ${style.backgroundColor}; font-size: ${style.fontSize}; text-shadow: ${style.textShadow}; }`;
  return <>
    <style data-subtitle-appearance>{cueStyle}</style>
    <details className="gon-subtitle-appearance">
      <summary>Configurações da legenda</summary>
      <div className="gon-subtitle-appearance-grid">
        {Object.keys(choices).map(key => <label key={key} htmlFor={`${id}-${key}`}>{labels[key]}<select id={`${id}-${key}`} value={appearance[key]} onChange={event => setAppearance(previous => ({ ...previous, [key]: event.target.value }))}>{Object.entries(choices[key]).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}</select></label>)}
      </div>
      <div className="gon-subtitle-preview" aria-label="Prévia da legenda"><span style={style}>Assim sua legenda vai aparecer.</span></div>
      <div className="gon-subtitle-appearance-footer"><small>Aplicado na hora e salvo neste navegador para os próximos episódios.</small><button type="button" onClick={() => setAppearance({ ...defaultAppearance })}>Restaurar padrão</button></div>
    </details>
  </>;
}
