(function(){
  let linkData = {}
  window.getVendorSale = function(){
    return {
      vendorName: "Uncommon Goods",
      sale: {}
    }
  }

  window.sendBranchSMS = async function(){
    const formEl = document.querySelector('#branch-sms-form')
    const submitEl = formEl.querySelector('button')
    const outputEl = formEl.querySelector('output')
    const inputEl = formEl.querySelector('#phone')

    outputEl.innerHTML = '' 
    submitEl.setAttribute('disabled', true)

    const resp = await fetch("https://api.sendheirloom.com/send-link-to-app", {
      method: "POST",
      body: JSON.stringify({
        phoneNumber: inputEl.value,
        link: linkData['~referring_link']
      })
    })
    const body = await resp.json()

    submitEl.removeAttribute('disabled')

    if (!body.ok) {
      switch (body.code) {
        case "no-phone":
          outputEl.innerText = "Please provide a phone number."
          return
        case "bad-phone":
          outputEl.innerText = "Your phone number appears invalid. Please try again or contact us for further assistance."
          return
        case "sending":
          outputEl.innerText = "We were not able to send your message. Please try again later."
          return
        default:
          outputEl.innerText = "An unknown error occurred. Please try again."
          console.error("Unmatched error", body)
          return
      }
    }

    outputEl.innerText = "Link sent! Please check your phone to continue."
  }

  window.handleDeeplink = function(data) {
    if (data.link_type === "prepurchase"){
      linkData = data

      const event = new CustomEvent("branch-loaded", {
        detail: {
          sale: linkData
        }
      });
      window.dispatchEvent(event);
    }
  }
})()
