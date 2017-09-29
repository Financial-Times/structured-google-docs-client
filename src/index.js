import cheerio from 'cheerio';
import getRawGoogleDoc from './get-raw-google-doc';
import sanitizeDoc from './sanitize-doc';
import transformDoc from './transform-doc';

export default async (googleDocId, options) => {
  const rawGoogleDoc = await getRawGoogleDoc(googleDocId);
  const $ = cheerio.load(rawGoogleDoc);

  const sanitizedDoc = await sanitizeDoc($('body').html());
  return transformDoc(sanitizedDoc, options);
};
