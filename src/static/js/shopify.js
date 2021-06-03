// This is explicitly to include the Shopify CTA which is being added as an experiment using
// Google Optimize
// It's not currently active and can be deleted if we give up on the embedded Shopify cart idea.
var initShopifyButton = function () {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'send-heirloom-inc.myshopify.com',
      storefrontAccessToken: '7bb95f6e0b02ac2888a8e69cca28bffe',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('product', {
        id: '6835206455459',
        node: document.getElementById('buy-button-above-the-fold'),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
          "product": {
            "styles": {
              "product": {
                "@media (min-width: 601px)": {
                  "max-width": "calc(25% - 20px)",
                  "margin-left": "20px",
                  "margin-bottom": "50px"
                }
              },
              "button": {
                ":hover": {
                  "background-color": "#c4374e"
                },
                "background-color": "#da3d57",
                ":focus": {
                  "background-color": "#c4374e"
                },
                "border-radius": "34px",
                "padding-left": "42px",
                "padding-right": "42px"
              }
            },
            "contents": {
              "img": false,
              "button": false,
              "buttonWithQuantity": true,
              "title": false,
              "price": false
            },
            "text": {
              "button": "Add To Cart"
            }
          },
          "productSet": {
            "styles": {
              "products": {
                "@media (min-width: 601px)": {
                  "margin-left": "-20px"
                }
              }
            }
          },
          "modalProduct": {
            "contents": {
              "img": false,
              "imgWithCarousel": true,
              "button": false,
              "buttonWithQuantity": true
            },
            "styles": {
              "product": {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0px",
                  "margin-bottom": "0px"
                }
              },
              "button": {
                ":hover": {
                  "background-color": "#c4374e"
                },
                "background-color": "#da3d57",
                ":focus": {
                  "background-color": "#c4374e"
                },
                "border-radius": "34px",
                "padding-left": "42px",
                "padding-right": "42px"
              }
            },
            "text": {
              "button": "Add to cart"
            }
          },
          "option": {},
          "cart": {
            "styles": {
              "button": {
                ":hover": {
                  "background-color": "#c4374e"
                },
                "background-color": "#da3d57",
                ":focus": {
                  "background-color": "#c4374e"
                },
                "border-radius": "34px"
              }
            },
            "text": {
              "total": "Subtotal",
              "notice": "Building your video book is easy! You will receive an email after your order with a link to our video book builder.",
              "button": "Checkout"
            },
            "popup": false
          },
          "toggle": {
            "styles": {
              "toggle": {
                "background-color": "#da3d57",
                ":hover": {
                  "background-color": "#c4374e"
                },
                ":focus": {
                  "background-color": "#c4374e"
                }
              }
            }
          }
        },
      });
    });
  }
};

(function(){
  window.dataLayer = window.dataLayer || []

  var show = function(){
    var hidden = document.querySelectorAll('[hide-until-optimized]')
    if (hidden) {
      for (var i=hidden.length; i--;){
        hidden[i].setAttribute('optimized', true)
      }
    }
  }

  setTimeout(show, 2000)

  var prevHide = window.dataLayer.hide && window.dataLayer.hide.end;
  window.dataLayer.hide = {
    end: function(){
      prevHide && prevHide()

      show()
    }
  }
})()

initShopifyButton();
