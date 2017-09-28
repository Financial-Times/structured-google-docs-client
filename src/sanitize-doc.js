import cheerio from 'cheerio';

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

export default async function sanitizeDoc(resp) {
  let body = resp.replace(/<br>/g, '</p><p>').replace(/<p><\/p>/g, '');

  body = body.replace(/<span>&#xA0;<\/span>/g, ' '); // replace nbsp between tags with space
  body = body.replace(/^>&#xA0;/g, ''); // get rid of &nbsp; unless after link

  const $ = cheerio.load(body);
  $('meta').remove();
  $('style').remove();
  $('sup').remove();

  let exclude = false;
  $('body p').each((i, node) => {
    if (/^######/.test($(node).text()) || exclude) {
      $(node).remove();
      exclude = true;
    }

    if ($(node).text().trim() === '') {
      $(node).remove();
    }

    $(node).removeAttr('style');
  });

  // replace underlines, bolds and italics
  $('body').find('span').each((i, node) => {
    if ($(node).attr('style') === 'font-weight:700') {
      const bolded = $(`<b>${$(node).text()} </b>`);
      $(node).replaceWith(bolded);
    }

    if ($(node).attr('style') === 'text-decoration:underline') {
      const underlined = $(`<u>${$(node).text()} </u>`);
      $(node).replaceWith(underlined);
    }

    if ($(node).attr('style') === 'font-style:italic') {
      const italicised = $(`<i>${$(node).text()} </i>`);
      $(node).replaceWith(italicised);
    }

    if ($(node).text().trim() === '') {
      $(node).remove();
    }

    $(node).replaceWith($(node).html());
  });

  // fix links
  $('body').find('a').each((j, link) => {
    const newLink = $(link).attr('href').split('&')[0].replace('https://www.google.com/url?q=', '');
    $(link).attr('href', newLink);
    $(link).removeAttr('style');
  });

  // go through every other tag (like headers) and get rid of styles
  $('body').children().each((k, tag) => {
    $(tag).removeAttr('style');
    $(tag).removeAttr('id');
    $(tag).removeAttr('class');
  });

  $('ul').children().each((k, tag) => {
    $(tag).removeAttr('style');
    $(tag).removeAttr('id');
    $(tag).removeAttr('class');
  });

  $('ol').children().each((k, tag) => {
    $(tag).removeAttr('style');
    $(tag).removeAttr('id');
    $(tag).removeAttr('class');
  });

  return $.html();
}