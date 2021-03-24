(function(){
  const initMobileHeader = () => {
    const el = document.querySelector("[data-header]")
    if (!el) return
    const button = el.querySelector("[data-toggle]")

    button.addEventListener("click", () => {
      if (el.hasAttribute("data-is-open")) {
        el.removeAttribute("data-is-open")
      } else {
        el.setAttribute("data-is-open", "")
      }
    })

    document.body.addEventListener("click", event => {
      if (el.contains(event.target)) return
      el.removeAttribute("data-is-open")
    })
  }
  
  initMobileHeader()
})()
