(function(){
  const initMobileHeader = () => {
    const el = document.querySelector("[data-header]")
    if (!el) return
    const button = el.querySelector("[data-toggle]")

    button.addEventListener("click", () => {
      
      const aboveMenuHeight = getHeightOfElementsAboveMobileMenu()
      const menuLinks = el.getElementsByClassName('Header--links')
      if( aboveMenuHeight && menuLinks.length ) {
        menuLinks[0].style.top = aboveMenuHeight + 'px'
      }
      menuLinks[0].style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

      el.classList.toggle('data-is-open')
      document.body.classList.toggle('mobile-menu-opened')
    })

  }
  
  const getHeightOfElementsAboveMobileMenu = () => {
    const calculateHeightElClasses = ['TopBanner', 'Header']
    let heightSum = 0

    calculateHeightElClasses.forEach(function (className) {
      let el = document.getElementsByClassName(className)
      if( el.length > 0 ) {
        heightSum += el[0].offsetHeight
      }
    })
    
    
    return heightSum
  }
  
  initMobileHeader()

  document.addEventListener('DOMContentLoaded', function () {
    const toggles = document.querySelectorAll('.Header-nested--toggle');

    toggles.forEach(toggle => {
      toggle.addEventListener('change', function () {
        if (this.checked) {
          toggles.forEach(otherToggle => {
            if (otherToggle !== this) {
              otherToggle.checked = false;
            }
          });
        }
      });
    });
    document.addEventListener('click', function (e) {
      const isMenuClick = e.target.closest('.Header-links--menu');
      if (!isMenuClick) {
        toggles.forEach(toggle => toggle.checked = false);
      }
    });
  });

  
})()
