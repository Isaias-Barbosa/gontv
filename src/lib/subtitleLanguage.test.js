import { isBrazilianPortuguese } from './subtitleLanguage';

test.each(['pt-BR', 'pt_br', 'por-BR', 'PTBR', 'Portuguese Brazil', 'Brazilian'])('aceita idioma %s', language => {
  expect(isBrazilianPortuguese({ language })).toBe(true);
});
test.each(['Brazilian', 'Brazilian Portuguese', 'Portuguese Brazil', 'Portuguese (Brazil)', 'Português do Brasil', 'Português Brasileiro', 'PT-BR Full', 'Portuguese / BR', 'Português-Brasil [Forced]'])('aceita nome %s', name => {
  expect(isBrazilianPortuguese({ language: 'por', name })).toBe(true);
});
test.each([{ language: 'por' }, { language: 'pt' }, { name: 'Portuguese' }, { name: 'English' }, { name: 'Brazil' }, { language: 'pt-PT', name: 'Brazilian' }, { language: 'pt-BR', name: 'Português Portugal' }, { name: 'European Portuguese' }, {}])('rejeita faixa ambígua ou de outro idioma: %j', track => {
  expect(isBrazilianPortuguese(track)).toBe(false);
});
