export default class TopBar {
  #element = document.createElement('div')
  elementbar = document.createElement('div')
  #window = null

  #zindex = 0
  #max = false
  #windowPlacesMinimaized = { left: 0, top: 0 }

  #close = document.createElement('button')
  #maximize = document.createElement('button')
  #minimize = document.createElement('button')
  #hide = document.createElement('button')

  #closeWindow = null

  #maxWindow = new Event('max')
  #minWindow = new Event('min')
  #windowContainer = null

  #closeSocket = new Event('closeSocket')

  constructor (window) {
    this.#window = window

    this.#closeWindow = new CustomEvent('closewindow', {
      detail: { win: this.#window },
      bubbles: true
    })

    this.#element.classList.add('topBar')

    this.elementbar.classList.add('elementbar')
    this.#element.appendChild(this.elementbar)

    const operationDiv = document.createElement('operationDiv')
    operationDiv.classList.add('operationDiv')

    this.#close.classList.add('close')
    operationDiv.appendChild(this.#close)
    this.#close.tabIndex = -1 // removing the ability to come across the button with tab

    this.#maximize.classList.add('maximize')
    operationDiv.appendChild(this.#maximize)
    this.#maximize.tabIndex = -1 // removing the ability to come across the button with tab

    this.#minimize.classList.add('minimize')
    operationDiv.appendChild(this.#minimize)
    this.#minimize.tabIndex = -1 // removing the ability to come across the button with tab

    this.#hide.classList.add('hide')
    operationDiv.appendChild(this.#hide)
    this.#hide.tabIndex = -1 // removing the ability to come across the button with tab


    this.#element.appendChild(operationDiv)
  }

  /**
   * Returns the div of the top bar
   * @returns {HTMLDivElement} the div of the top bar
   */
  getDiv () {
    return this.#element
  }

  /**
   * Adds the listeners to the top bar
   */
  addListeners () {
    this.#close.addEventListener('click', () => {
      this.#close.dispatchEvent(this.#closeWindow)
      this.#windowContainer.childNodes[0].dispatchEvent(this.#closeSocket)
      this.#element.parentNode.remove()
    })

    this.#maximize.addEventListener('click', () => this.maximize())

    this.#minimize.addEventListener('click', () => this.minimize())

    this.#hide.addEventListener('click', () => this.hide())


    this.#element.parentNode.addEventListener('keyup', e => {
      switch (e.key) {
        case 'Escape': 
          this.#close.dispatchEvent(this.#closeWindow)
          this.#windowContainer.childNodes[0].dispatchEvent(this.#closeSocket)
          this.#element.parentNode.remove()
        
          break
        case 'PageUp': 
          this.maximize()
        
          break
        case 'PageDown': 
          this.minimize()
          break
        
        case 'End':
          this.hide()
        default:
      }
    })
  }

  /**
   * replaces the element bar
   */
  replaceElementBar () {
    this.elementbar = document.createElement('div')
    this.#element.replaceChild(this.elementbar, this.#element.childNodes[0])
    this.elementbar.classList.add('elementbar')
  }

  /**
   * Maximizes the window and changes the button to minimize
   */
  maximize () {
    this.#windowContainer.childNodes[0].dispatchEvent(this.#maxWindow)
    this.#max = true
    this.#window.getDiv().classList.add('maxed')
    this.#window.removeListeners()

    this.#windowPlacesMinimaized.left = this.#window.getDiv().offsetLeft
    this.#windowPlacesMinimaized.top = this.#window.getDiv().offsetTop

    const sp = document.getElementById('space')

    this.#window.getDiv().style.top = 0 + 'px'
    this.#window.getDiv().style.left = 90 + 'px'

    this.#window.getDiv().style.height = sp.offsetHeight + 'px'

    this.#window.getDiv().style.width = (sp.offsetWidth - 105) + 'px'

    this.#maximize.style.display = 'none'
    this.#minimize.style.display = 'block'
  }

  /**
   * Minimizes the window and changes the button to maximize
   */
  minimize () {
    this.#windowContainer.childNodes[0].dispatchEvent(this.#minWindow)

    if (this.#max === false) return
    this.#window.getDiv().classList.remove('maxed')

    this.#max = false
    this.#window.addListeners()

    this.#window.getDiv().style.top = this.#windowPlacesMinimaized.top + 'px'
    this.#window.getDiv().style.left = this.#windowPlacesMinimaized.left + 'px'

    this.#window.getDiv().style.height = 'auto'
    this.#window.getDiv().style.width = 700 + 'px'

    this.#maximize.style.display = 'block'
    this.#minimize.style.display = 'none'
  }

  hide () {
    this.#window.getDiv().classList.add('hidden')
  }

  /**
   * Sets the window container
   * @param {HTMLDivElement} container the window container
   */
  assingContainer (container) {
    this.#windowContainer = container
  }
}
