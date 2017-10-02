import cheerio from 'cheerio';
import stringReplaceAsync from 'string-replace-async';

export default async function parseDoc(doc, options) {
  const $ = cheerio.load(doc);

  // render markup (anything surrounded by ``` markup here ```) as HTML
  const markupRegex = /`{3}(.+?)`{3}/g;
  const withMarkupHTML = await stringReplaceAsync($('body').html(), markupRegex, async (match, markup) => markup
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '\'')
    .replace(/&#x201C;/g, '\'')
    .replace(/&#x201D;/g, '\''));
  $('body').html(withMarkupHTML);

  // process annotations
  if (options && options.transform) {
    const annotationRegex = /\[{3}(.+?)\]{3}\s*\[{2}(.+?)(\|(.+?))?\]{2}/g;
    const transformedHTML = await stringReplaceAsync($('body').html(), annotationRegex, async (match, contentReference, annotation, x, label) => options.transform(contentReference, annotation, label));
    $('body').html(transformedHTML);
  }

  return $.html();
}
