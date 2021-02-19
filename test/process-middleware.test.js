/**
 * @file
 * Test suite for process-middleware.js
 */

import processMiddleware from '../src/process-middleware';

// Makes everything uppercase
const testMiddleware1 = text => text.toUpperCase();

// Makes every even letter æ
const testMiddleware2 = text => [...text].map((l, idx) => (idx % 2 ? 'æ' : l)).join('');

// Wraps the string in backticks
const testMiddleware3 = text => `\`\`\`${text}\`\`\``;

// Returns it as a promise
const testMiddleware4 = text => Promise.resolve(text);

const testString =
  'The Financial Times is one of the world’s leading news organisations, recognised internationally for its authority, integrity and accuracy. It is part of Nikkei Inc., which provides a broad range of information, news and services for the global business community.';

test('composes array of middlewares', async () => {
  const result = await processMiddleware(
    [testMiddleware4, testMiddleware3, testMiddleware2, testMiddleware1],
    testString,
  );

  expect(result)
    .toBe('```TæEæFæNæNæIæLæTæMæSæIæ æNæ æFæTæEæWæRæDæSæLæAæIæGæNæWæ æRæAæIæAæIæNæ,æRæCæGæIæEæ æNæEæNæTæOæAæLæ æOæ æTæ æUæHæRæTæ,æIæTæGæIæYæAæDæAæCæRæCæ.æIæ æSæPæRæ æFæNæKæEæ æNæ.æ æHæCæ æRæVæDæSæAæBæOæDæRæNæEæOæ æNæOæMæTæOæ,æNæWæ æNæ æEæVæCæSæFæRæTæEæGæOæAæ æUæIæEæSæCæMæUæIæYæ```')
});

test('processes individual middleware', async () => {
  const result = await processMiddleware(testMiddleware3, 'TESTING');
  expect(result).toBe('```TESTING```');
});

test('throws on invalid middleware', async () => {
  await expect(processMiddleware(null))
    .rejects.toThrowError('Invalid middleware');

  await expect(processMiddleware('asdadadasda'))
    .rejects.toThrowError('Invalid middleware');

  await expect(processMiddleware({}))
    .rejects.toThrowError('Invalid middleware');

  await expect(processMiddleware(Promise.resolve(new Date())))
    .rejects.toThrowError('Invalid middleware');

  await expect(processMiddleware([testMiddleware3, 'asdadasas']))
    .rejects.toThrowError('Invalid middleware at position 0');
});
