const client = ShopifyBuy.buildClient({
  storefrontAccessToken: '4feb6961d0e690628afa47a6eb8b576f',
  domain: 'send-heirloom-inc.myshopify.com'
})

client.product.fetchAll().then((products) => {
  let html = ''

  if( products.length > 0 ) {
    products.reverse().forEach(product => {
      if(  product.availableForSale ) {
        const sku = product.variants[0].sku.toUpperCase()
        if( sku.startsWith('BOOK') ) {
          html += '<div class="product__item scale-on-hover-desktop"><div class="product__item__inner" style="background-image: url(' + product.images[0].src + ')"></div></div>'
        }
      }
    })
  }

  document.getElementById('products-container').innerHTML = html;

});