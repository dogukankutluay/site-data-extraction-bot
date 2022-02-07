const axios = require('axios'),
  jsdom = require('jsdom'),
  { JSDOM } = jsdom,
  fs = require('fs');

const forin = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
let leng = 0;
for (let index = 0; index < forin.length; index++) {
  const url = `https://raindrop.io/doruk-karaboncuk/interaktifis-16864647/sort=-sort&perpage=30&page=${index}`;
  axios
    .get(url)
    .then(response => {
      getNodes(response.data, le => {
        leng++;
        if (leng === 12) {
          console.log(le.length);
          const jsonContent = JSON.stringify(le);
          fs.writeFile('output.json', jsonContent, 'utf8', function (err) {
            if (err) {
              console.log(
                'An error occured while writing JSON Object to File.'
              );
              return console.log(err);
            }

            console.log('JSON file has been saved.');
          });
        }
      });
    })
    .catch(error => {});
}
const data = [];

const getNodes = (html, cb) => {
  const dom = new JSDOM(html),
    news = dom.window.document.querySelectorAll('._list_1mv6m_107');
  news.forEach(item => {
    const title = item.lastChild.textContent;
    const href = item.lastChild.getAttribute('href');

    const picture = item.firstChild.firstChild.firstChild
      .getAttribute('srcset')
      .split(',')[0]
      .split(' ')[0];
    const desc =
      item.firstChild?.childNodes[1]?.childNodes[1]?.className ===
      '_excerpt_1mv6m_43'
        ? item.firstChild?.childNodes[1]?.childNodes[1]?.textContent
        : '';
    const tags =
      item.firstChild.childNodes[1].childNodes[2].className ===
      '_buttons_mzeri_112 _filters_1mv6m_57'
        ? item.firstChild.childNodes[1].childNodes[2].textContent
            .split('#')
            .slice(1)
        : [];
    const link =
      item?.firstChild?.childNodes[1]?.childNodes[3]?.childNodes[1]
        .textContent || '';
    data.push({
      title,
      href,
      picture,
      desc,
      tags,
      link,
    });
  });
  cb(data);
};
