import { readPublicSnapshot, storePublicSnapshot } from './publicCatalog';
beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());
test('cache público expira após cinco minutos', () => {
  const clock = jest.spyOn(Date, 'now').mockReturnValue(1000);
  storePublicSnapshot({ animes: [{ id: 1, visibility: 'published' }], storage: 'postgres' });
  expect(readPublicSnapshot().animes).toHaveLength(1);
  clock.mockReturnValue(1000 + 5 * 60 * 1000 + 1);
  expect(readPublicSnapshot()).toBeNull();
});
test('armazenamento indisponível não impede carregar o site', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('blocked'); });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('full'); });
  expect(readPublicSnapshot()).toBeNull();
  expect(() => storePublicSnapshot({ animes: [] })).not.toThrow();
});
