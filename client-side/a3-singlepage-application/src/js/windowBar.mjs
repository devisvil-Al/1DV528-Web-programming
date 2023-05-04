import Memory from './memory.mjs'
import Chatt from './chatt.mjs'
import TopBar from './topBar.mjs'
import Nasa from './nasa.mjs'



export default class WindowBar {
  #window = document.createElement('div')
  #topBar = new TopBar(this)
  #moving = false
  #initialMousePos = { x: 0, y: 0 }
  #container = document.createElement('div')
  zIndex = 0
  title = ''

  // bind functions was the only solution that worked to remove the event listeners.
  #downBound = (e) => { this.mouseDown(e) }
  #upBound = () => { this.mouseUp() }
  #moveBound = (e) => { this.moveWindow(e) }

  constructor (app) {
    this.title = app
    this.#window.classList.add('window')
    this.#window.appendChild(this.#topBar.getDiv())
    this.addListeners()
    this.#topBar.addListeners()

    this.#container.classList.add('container')
    this.#window.appendChild(this.#container)

    this.#topBar.assingContainer(this.#container)

    switch (app) {
      case 'memory':
        this.#container.appendChild(new Memory().getDiv())
        this.#topBar.elementbar.innerHTML = 'Memory'

        break
      case 'chatt':
        this.#container.appendChild(new Chatt().getDiv())
        this.#topBar.elementbar.innerHTML = 'Chatt'

        break
      case 'nasa':
        this.#container.appendChild(new Nasa().getDiv())
        this.#topBar.elementbar.innerHTML = 'Nasa'

        break
      default:
        break
    }
  }

  /**
   * @description adds the event listeners
   */
  addListeners () {
    this.#topBar.elementbar.addEventListener('mouseout', () => {
      this.#moving = false
      this.#window.style.cursor = 'default'
    })

    this.#topBar.elementbar.addEventListener('mousedown', this.#downBound)

    this.#topBar.elementbar.addEventListener('mouseup', this.#upBound)

    this.#topBar.elementbar.addEventListener('mousemove', this.#moveBound)
  }

  /**
   * @description returns the window div
   * @returns {HTMLElement} the window div
   */
  getDiv () {
    return this.#window
  }

  /**
   * @description sets the moving to true when mouse clicked
   * @param {event} e the event
   */
  mouseDown (e) {
    e.preventDefault()
    this.#window.style.cursor = 'move'
    this.#moving = true
    this.#initialMousePos = {
      x: this.#window.offsetLeft - e.clientX,
      y: this.#window.offsetTop - e.clientY
    }
  }

  /**
   * @description sets the moving to false when mous no longer clicked
   */
  mouseUp () {
    this.#window.style.cursor = 'default'
    this.#moving = false
  }

  /**
   * @description moves the window
   * @param {event} e the event
   */
  moveWindow (e) {
    e.preventDefault()

    if (this.#moving) {
      this.#window.style.left = (e.clientX + this.#initialMousePos.x) + 'px'
      this.#window.style.top = (e.clientY + this.#initialMousePos.y) + 'px'
    }
  }

  /**
   * @description sets the z-index of the window
   * @param {number} zIndex the z-index of the window
   */
  setZindex (zIndex) {
    this.zIndex = zIndex
    this.#window.style.zIndex = zIndex
  }
  


  /**
   * @description removes all the event listeners from the window
   */
  removeListeners () {
    this.#topBar.elementbar.removeEventListener('mousedown', this.#downBound)
    this.#topBar.elementbar.removeEventListener('mouseup', this.#upBound)
    this.#topBar.elementbar.removeEventListener('mousemove', this.#moveBound)
  }
}
