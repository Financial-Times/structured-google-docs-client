import cheerio from 'cheerio';
import getRawGoogleDoc from './get-raw-google-doc';
import sanitizeDoc from './sanitize-doc';
import transformDoc from './transform-doc';
import middlewareDoc from './process-middleware';

export default async (googleDocId, options, middleware = []) => {
  const rawGoogleDoc = await getRawGoogleDoc(googleDocId);
  const $ = cheerio.load(rawGoogleDoc);

  const sanitizedDoc = await sanitizeDoc($('body').html());
  const transformedDoc = transformDoc(sanitizedDoc, options);

  return middlewareDoc(middleware, transformedDoc);
};
