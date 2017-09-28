import cheerio from 'cheerio';
import stringReplaceAsync from 'string-replace-async';

export default async function parseDoc(doc, options) {
  const $ = cheerio.load(doc);

  if (options && options.transform) {
    // process annotations
    const annotationRegex = /\[{3}(.+?)\]{3}\s*\[{2}(.+?)(\|(.+?))?\]{2}/g;
    const newBodyHTML = await stringReplaceAsync($('body').html(), annotationRegex, async (match, contentReference, annotation, x, label) => options.transform(contentReference, annotation, label));
    $('body').html(newBodyHTML);
  }

  return $.html();
}
