/**
 * @file
 * Adds support for middleware
 */

import isFunc from 'lodash.isfunction';

export default async (middleware = [], text = '') => {
  if (!Array.isArray(middleware) && isFunc(middleware)) {
    return middleware(text);
  } else if (!Array.isArray(middleware) && !isFunc(middleware)) {
    throw new Error('Invalid middleware');
  }

  return middleware.reverse()
    .reduce(async (col, mw, idx) => {
      if (!isFunc(mw)) throw new Error(`Invalid middleware at position ${idx}`);
      return mw(await col);
    }, Promise.resolve(text));
};
