import cheerio from 'cheerio';

if (!String.prototype.trim) {
  // eslint-disable-next-line no-extend-native, func-names
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
    if ($(node).attr('style')) {
      if ($(node).attr('style').includes('font-weight:700')) {
        const bolded = $(`<b>${$(node).html()}</b>`);
        $(node).replaceWith(bolded);
      }

      if ($(node).attr('style').includes('text-decoration:underline')) {
        const underlined = $(`<u>${$(node).html()}</u>`);
        $(node).replaceWith(underlined);
      }

      if ($(node).attr('style').includes('font-style:italic')) {
        const italicised = $(`<i>${$(node).html()}</i>`);
        $(node).replaceWith(italicised);
      }

      $(node).removeAttr('style');
    }

    if ($(node).text().trim() === '') {
      $(node).remove();
    }

    $(node).replaceWith($(node).html());
  });

  // fix links
  $('body').find('a').each((j, link) => {
    if ($(link).attr('href')) {
      const newLink = $(link).attr('href').split('&')[0].replace('https://www.google.com/url?q=', '');
      $(link).attr('href', newLink);
      $(link).removeAttr('style');
    } else {
      // if anchor tag has no href, then remove
      // Google Docs adds anchor tags above tables, for example, which don't need
      // to be rendered here
      $(link).remove();
    }
  });

  // go through every other tag (like headers) and get rid of styles
  $('body').children().each((k, tag) => {
    $(tag).removeAttr('style');
    $(tag).removeAttr('id');
    $(tag).removeAttr('class');
  });

  const otherElementsToStrip = ['ul', 'ol', 'li', 'tr', 'td', 'th'];
  otherElementsToStrip.forEach((element) => {
    $(element).each((k, tag) => {
      $(tag).removeAttr('style');
      $(tag).removeAttr('id');
      $(tag).removeAttr('class');
    });
  });

  return $.html();
}
