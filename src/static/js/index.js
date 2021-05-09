(() => {
  window.toast = message => {
    const el = document.createElement("div")
    el.className = "Toast"
    el.innerHTML = `<div class="Toast--content"></div>`
    el.firstElementChild.textContent = message
    document.body.appendChild(el)
  }

  const parseQuery = function(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  const renderDialogError = function(el, message) {
    const p = document.createElement("p")
    p.className = "Dialog--error-text"
    p.textContent = message
    el.appendChild(p)
  }

  const subscribe = async email => {
    const resp = await fetch("https://texter.sendheirloom.com/subscribe/email", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        source: "website",
        campaign: "website-dialog",
        sendWelcomeMessage: true
      })
    })

    const body = await resp.json()

    if (resp.status >= 400) {
      console.error("Error subscribing:", body)
    }

    return body
  }

  const initEmailDialog = () => {
    const el = document.querySelector(`[dialog="email"]`)
    if (!el) return
    const formEl = el.querySelector("[dialog-form]")
    const outputEl = formEl.querySelector(`[dialog-output]`)
    const submitEl = el.querySelector("[dialog-submit]")

    const dialog = new Dialog(el)

    formEl.addEventListener("submit", async event => {
      event.preventDefault()

      outputEl.innerHTML = ""
      submitEl.setAttribute("disabled", "")

      const email = formEl.querySelector(`input[name="email"]`).value
      const resp = await subscribe(email)

      submitEl.removeAttribute("disabled")

      if (resp.ok) {
        toast("Thanks for subscribing!")

        dialog.close()
      } else if (resp.code === "no-email") {
        renderDialogError(outputEl, "Please provide a valid email address.")
      } else {
        renderDialogError(outputEl, "There was an error subscribing, please try again.")
      }
    })

    document.querySelectorAll("[intent='open-email-dialog']").forEach(el => {
      el.addEventListener("click", event => {
        event.preventDefault()
        dialog.open()
      })
    })
  }

  const isMobileOrTablet = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  const initSMSDialog = () => {
    const el = document.querySelector(`[dialog="sms"]`)
    if (!el) return
    const formEl = el.querySelector("[dialog-form]")
    const outputEl = el.querySelector("[dialog-output]")
    const submitEl = el.querySelector("[dialog-submit]")

    const dialog = new Dialog(el)

    formEl.addEventListener("submit", event => {
      event.preventDefault()
      const data = Object.fromEntries(new FormData(formEl))
      sendSMS(data.phone)
    })

    const sendEvent = function() {
      // For GTM. Have not been able to get events to actually propagate.
      window.dataLayer && window.dataLayer.push({'event': 'app_install_attempt'})

      // Leading to a manual install of GA:
      window.gtag && window.gtag('event', 'app_install_attempt')
    }

    const sendSMS = async function(number) {
      sendEvent()

      outputEl.innerHTML = ""
      submitEl.setAttribute("disabled", "")

      const query = parseQuery(document.location.search)
      let passAlong = {}
      for (const [key, value] of Object.entries(query)){
        if (key.indexOf("utm_") === 0){
          passAlong[key] = value
        }
      }

      const resp = await fetch("https://texter.sendheirloom.com/send-link-to-app", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: number,
          params: passAlong,
        })
      })
      const body = await resp.json()

      submitEl.removeAttribute("disabled")

      if (!body.ok) {
        switch (body.code) {
          case "no-phone":
            renderDialogError(outputEl, "Please provide a phone number.")
            return
          case "bad-phone":
            renderDialogError(outputEl, "Your phone number appears invalid. Please try again or contact us for further assistance.")
            return
          case "sending":
            renderDialogError(outputEl, "We were not able to send your message. Please try again later.")
            return
          default:
            renderDialogError(outputEl, "An unknown error occurred. Please try again.")
            console.error("Unmatched error", body)
            return
        }
      }

      dialog.close()
      toast("Your message has been sent!")
    }

    /*
    const links = document.querySelectorAll(`a[intent="build-book"]`);
    for (var i=links.length; i--;){
      if (!isMobileOrTablet()) {
        links[i].addEventListener('click', (e) => {
          e.preventDefault()
          SMSDialog.open()
        })
      } else {
        links[i].addEventListener('click', (e) => {
          sendEvent()

          var el = e.target
          var isMeta = (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)

          if (el.target != '_blank' && !isMeta) {
            var href = el.getAttribute('href')
            e.preventDefault()

            // Give the analytics time to submit
            setTimeout(() => {
              window.location.href = href
            }, 300);
          }
        })
      }
    }
    */

    window.SMSDialog = dialog
  }

  const initAudioButtons = () => {
    const els = document.querySelectorAll("[data-play-button-root]")
    els.forEach(el => {
      el.setAttribute("data-is-visible", "")

      const src = el.getAttribute("data-src")
      const audio = new Audio(src)
      const button = el.querySelector("button")

      button.addEventListener("click", () => {
        if (audio.paused) {
          el.setAttribute("data-playing", "")
          audio.play()
        } else {
          audio.pause()
          audio.currentTime = 0
          el.removeAttribute("data-playing")
        }
      })

      audio.addEventListener("ended", () => {
        audio.currentTime = 0
        el.removeAttribute("data-playing")
      })
    })
  }

  const initReviewDialogs = () => {
    const reviewEls = document.querySelectorAll("[data-reviews] > *")
    const dialogEl = document.querySelector(`[dialog="review"]`)

    if (!dialogEl) return
    const contentEl = dialogEl.querySelector("[dialog-content]")
    const dialog = new Dialog(dialogEl)

    reviewEls.forEach(el => {
      el.addEventListener("click", () => {
        contentEl.innerHTML = ""
        contentEl.appendChild(el.cloneNode(true))
        dialog.open()
      })
    })
  }

  const initYouTubeDialogs = () => {
    const els = document.querySelectorAll("[data-youtube]")
    if (!els.length) return

    document.body.insertAdjacentHTML("beforeend", `
      <div class="Dialog---backdrop" dialog-backdrop>
        <div class="Dialog Dialog-is-video" dialog="youtube">
          <div class="AspectRatio" data-content style="--ratio: calc(16 / 9)"></div>
          <div class="Dialog--close-positioner">
            <button class="Button Button-is-white Button-is-close" aria-label="Close" dialog-close>
              <svg viewBox="0 0 8 8"><path stroke="currentColor" stroke-width=".75" d="M0 0 L8 8 M8 0 L0 8"/></svg>
            </button>
          </div>
        </div>
      </div>
    `)

    const dialogEl = document.querySelector(`[dialog="youtube"]`)
    const dialog = new Dialog(dialogEl)

    els.forEach(el => {
      const id = el.getAttribute("data-youtube")

      el.addEventListener("click", event => {
        event.preventDefault()

        const contentEl = dialogEl.querySelector("[data-content]")
        contentEl.innerHTML = `<iframe class="AspectRatio--content" src="https://www.youtube.com/embed/${id}?rel=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`

        dialog.open()

        dialogEl.addEventListener('dialogClose', ()  => {
          contentEl.innerHTML = ""
        })
      })
    })
  }

  const initImageSwipe = () => {
    const els = document.querySelectorAll("[data-image-swipe]")

    els.forEach(el => {
      const imagesEl = document.querySelector("[data-image-swipe-images]")
      const progressEls = document.querySelectorAll("[data-image-swipe-progress]")

      imagesEl.addEventListener("scroll", () => {
        const numImages = imagesEl.childElementCount
        const approxSnapDist = imagesEl.scrollWidth / numImages
        let num = 0
        let minDist = Infinity
        for (let i = 0; i < numImages; i += 1) {
          const dist = Math.abs(i * approxSnapDist - imagesEl.scrollLeft)
          if (dist < minDist) {
            minDist = dist
            num = i
          }
        }
        progressEls.forEach(el => {
          el.querySelectorAll("*").forEach((el, i) => {
            if (i === num) {
              el.setAttribute("data-is-active", "")
            } else {
              el.removeAttribute("data-is-active")
            }
          })
        })
      })
    })
  }

  const init = () => {
    initEmailDialog()
    initSMSDialog()
    initAudioButtons()
    initReviewDialogs()
    initYouTubeDialogs()
    initImageSwipe()
  }

  init()
})()

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
        node: document.getElementById('product-component-1619800828955'),
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
  var prevHide = window.dataLayer.hide && window.dataLayer.hide.end;
  window.dataLayer.hide = {
    end: function(){
      prevHide && prevHide();

      var tries = 0;
      var intv = setInterval(function(){
        tries++
        var node = document.getElementById('product-component-1619800828955');

        if (tries > 10 || node) {
          clearInterval(intv);
        }

        if (node) {
          initShopifyButton()
        }
      }, 500)
    }
  }
})()
