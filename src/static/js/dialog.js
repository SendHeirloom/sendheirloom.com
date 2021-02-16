(() => {
  const focusableSelector = '*[tabindex]:not([tabindex="-1"]),a[href]:not([tabindex="-1"]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled])'
  const textInputsSelector = 'input[type=text],input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=url],textarea'

  const makeInert = (el) => {
    el.querySelectorAll(focusableSelector).forEach(el => {
      el.setAttribute('data-inert', '')

      if (el.matches('[tabindex]')) {
        const tabIndex = el.getAttribute('tabindex')
        if (tabIndex) el.setAttribute('data-original-tabindex', tabIndex)
        el.setAttribute('tabindex', -1)
      } else {
        el.setAttribute('disabled', '')
      }
    })
  }

  const makeErt = (el) => {
    el.querySelectorAll('[data-inert]').forEach(el => {
      if (el.matches('[tabindex]')) {
        const tabIndex = el.getAttribute('data-original-tabindex')
        el.removeAttribute('tabindex')
        if (tabIndex !== null) el.setAttribute('tabindex', tabIndex)
      } else {
        el.removeAttribute('disabled')
      }

      el.removeAttribute('data-inert')
    })
  }

  const trapFocus = el => event => {
    if (el.contains(event.target)) return

    const els = Array.from(el.querySelectorAll(focusableSelector))

    els.unshift(el)

    if (el.previousElementSibling === event.target) {
      els[els.length - 1].focus()
    } else if (el.nextElementSibling === event.target) {
      els[0].focus()
    }
  }

  const checkForEscape = dialog => event => {
    if (event.target.matches(textInputsSelector)) return
    if (event.key === 'Escape') dialog.close()
  }

  const once = (fn) => {
    let ran = false

    return () => {
      if (ran) return
      fn()
      ran = true
    }
  }

  const enforceOneAtATime = once(() => {
    let openedDialog

    document.documentElement.addEventListener('dialogOpen', ({detail: { dialog }}) => {
      if (openedDialog) {
        openedDialog.originalActiveElement = null
        openedDialog.close()
      }
      openedDialog = dialog
    })

    document.documentElement.addEventListener('dialogClose', ({detail: { dialog }}) => {
      openedDialog = null
    })
  })


  window.Dialog = class Dialog {
    constructor(el) {
      this.el = el
      this.el.setAttribute('tabindex', 0)
      this.backdropEl = el.closest('[dialog-backdrop]')

      this.setupARIA()
      this.prepareFocusTrap()

      this.checkForEscape = checkForEscape(this)
      this.setupClosers()

      makeInert(this.backdropEl)

      this.isOpen = false
      enforceOneAtATime()
    }

    setupARIA() {
      this.el.setAttribute('role', 'dialog')
      this.el.setAttribute('aria-modal', true)
    }

    prepareFocusTrap() {
      const html = '<div tabindex="0"></div>'
      this.el.insertAdjacentHTML('beforebegin', html)
      this.el.insertAdjacentHTML('afterend', html)
      this.trapFocus = trapFocus(this.el)
    }

    setupClosers() {
      const close = '[dialog-close]'
      this.backdropEl.addEventListener('click', event => {
        const el = event.target
        if (el === this.backdropEl || el.matches(close) || el.closest(close))
          this.close()
      })
    }

    dispatch(eventName) {
      this.el.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          detail: {
            dialog: this
          }
        })
      )
    }

    open() {
      if (this.isOpen) return
      this.isOpen = true
      makeErt(this.backdropEl)
      this.originalActiveElement = document.activeElement
      this.backdropEl.setAttribute('is-active', '')
      document.documentElement.setAttribute('is-dialog', '')
      document.addEventListener('focus', this.trapFocus, true)
      document.addEventListener('keyup', this.checkForEscape, true)
      const autofocusEl = this.el.querySelector('[dialog-autofocus]')
      if (autofocusEl)
        autofocusEl.focus()
      else if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        this.el.focus({ preventScroll: true })
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.backdropEl.scrollTo(0, 0)
          })
        })
      }
      this.dispatch('dialogOpen')
    }

    close() {
      if (!this.isOpen) return
      this.isOpen = false
      makeInert(this.backdropEl)
      this.backdropEl.removeAttribute('is-active', '')
      document.documentElement.removeAttribute('is-dialog')
      document.removeEventListener('focus', this.trapFocus, true)
      document.removeEventListener('keyup', this.checkForEscape, true)
      if (this.originalActiveElement) this.originalActiveElement.focus()
      this.dispatch('dialogClose')
    }
  }
})()
