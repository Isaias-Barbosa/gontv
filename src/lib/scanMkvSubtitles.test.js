import { scanMkvSubtitles } from './scanMkvSubtitles';

const originalFetch = global.fetch;
beforeEach(() => { jest.useFakeTimers(); global.fetch = jest.fn(); });
afterEach(() => { global.fetch = originalFetch; jest.useRealTimers(); });
const timeout = () => ({ status: 504, ok: false, body: { cancel: jest.fn().mockResolvedValue() } });
const options = signal => ({ signal, onTrack: jest.fn(), onCue: jest.fn(), onProgress: jest.fn(), onRetry: jest.fn() });
const advanceRetry = async () => {
  for (let i = 0; i < 10; i += 1) await Promise.resolve();
  jest.runOnlyPendingTimers();
  for (let i = 0; i < 10; i += 1) await Promise.resolve();
};

test('recovers from a gateway timeout before parsing, without duplicate cues', async () => {
  const failed = timeout();
  const reader = { read: jest.fn().mockResolvedValue({ done: true }), cancel: jest.fn().mockResolvedValue(), releaseLock: jest.fn() };
  global.fetch.mockResolvedValueOnce(failed).mockResolvedValueOnce({ ok: true, status: 200, headers: { get: () => '0' }, body: { getReader: () => reader } });
  const parser = { tracks: new Map(), cueCount: 0, finish: jest.fn() };
  const Parser = jest.fn(() => parser);
  const callbacks = options(new AbortController().signal);
  const result = scanMkvSubtitles('https://example.com/a.mkv', callbacks, Parser);
  await advanceRetry();
  await expect(result).resolves.toMatchObject({ cues: 0 });
  expect(failed.body.cancel).toHaveBeenCalledTimes(1);
  expect(Parser).toHaveBeenCalledTimes(1);
  expect(callbacks.onRetry).toHaveBeenCalledWith({ attempt: 2, attempts: 3, status: 504 });
});

test('stops after three gateway failures without reporting an expired link', async () => {
  global.fetch.mockImplementation(async () => timeout());
  const result = scanMkvSubtitles('https://example.com/a.mkv', options(new AbortController().signal), jest.fn());
  const assertion = expect(result).rejects.toThrow('após 3 tentativas (HTTP 504)');
  await advanceRetry();
  await advanceRetry();
  await assertion;
  expect(global.fetch).toHaveBeenCalledTimes(3);
});

test('cancelling during backoff prevents another request', async () => {
  const controller = new AbortController();
  global.fetch.mockResolvedValue(timeout());
  const callbacks = options(controller.signal);
  callbacks.onRetry.mockImplementation(() => controller.abort());
  await expect(scanMkvSubtitles('https://example.com/a.mkv', callbacks, jest.fn())).rejects.toMatchObject({ name: 'AbortError' });
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
