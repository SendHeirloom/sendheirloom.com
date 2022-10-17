async function sendheirloomGetAndShowCovers() {
  fetch('https://api.sendheirloom.com/query/public', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query Stock {
          stock {
              books {
                  id
                  displayName
                  images
                  covers {
                      id
                      displayName
                      images
                      metadata
                  }
              }
          }
      }
      `,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      if (
        !result.data.stock
        || !result.data.stock.books
        || !result.data.stock.books[0]
        || !result.data.stock.books[0].covers
      ) {
        return;
      }

      const covers = result.data.stock.books[0].covers

      covers.sort((a, b) => {
        if (!a.metadata || !a.metadata.sortOrder) {
          return 1;
        }
        if (!b.metadata || !b.metadata.sortOrder) {
          return -1;
        }

        return a.metadata.sortOrder - b.metadata.sortOrder
      })

      let html = '';
      covers.forEach(cover => {
        html += '<div class="product__item scale-on-hover-desktop"><div class="product__item__inner" style="background-image: url(' + cover.images[0].trim().replace(" ", "%20") + ')"></div></div>'
      })
      document.getElementById('products-container').innerHTML = html;
    });
}

sendheirloomGetAndShowCovers()
