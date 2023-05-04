import WindowBar from './windowBar.mjs'

const space = document.getElementById('space')
const bar = document.getElementById('bar')
bar.style.zIndex = 1000

const openedApps = document.getElementById('openedApps')
const openbtns = []

const memory = document.getElementById('memoryApp')
const chatt = document.getElementById('chattApp')
const nasa = document.getElementById('nasaApp')

let z = 0
const windows = []
const pos = { left: 90, top: 10 }

memory.addEventListener('click', e => {
  e.preventDefault()
  createWindow('memory')
})

chatt.addEventListener('click', e => {
  e.preventDefault()
  createWindow('chatt')
})

nasa.addEventListener('click', e => {
  e.preventDefault()
  createWindow('nasa')
})

/**
 * resets the z-index of all windows
 */
function resetZindex () {
  z = 0
  windows.sort((a, b) => a.getZindex() < b.getZindex())
  for (let i = 0; i < windows.length; i++) {
    windows[i].setZindex(z)
    z++
  }
}

/**
 * creates a new window and adds it to the space
 *
 * @param {string} app - the name of the app
 */
function createWindow (app) {
  const win = new WindowBar(app)
  windows.push(win)
  z += 1
  win.setZindex(z)

  win.getDiv().addEventListener('mousedown', () => {
    z += 1

    if (z === 900) {
      resetZindex()
    }
    win.setZindex(z)
  })
  space.appendChild(win.getDiv())

  win.getDiv().style.left = pos.left + 'px'
  win.getDiv().style.top = pos.top + 'px'
  pos.left += 10
  pos.top += 10
  win.getDiv().focus()

  addTaskbarBtn(win, app + 'App')
}

/**
 * adds a button to the taskbar for each window
 *
 * @param {WindowBar} win - the window of the app
 * @param {string} app - the name of the app
 */
function addTaskbarBtn (win, app) {
  const appBtn = document.createElement('button')
  appBtn.classList.add(app)
  appBtn.addEventListener('click', () => {
    if (win.getDiv().classList.contains('hidden')) {
      win.getDiv().classList.remove('hidden')
    }

    win.getDiv().focus()
    z += 1

    if (z === 900) {
      resetZindex()
    }
    win.setZindex(z)
  })
  openedApps.appendChild(appBtn)
  openbtns.push(appBtn)
}

// catches close window event and removes the window and the button from the taskbar
document.addEventListener('closewindow', function (e) {
  if (windows.includes(e.detail.win)) {
    const index = windows.indexOf(e.detail.win)

    openedApps.removeChild(openbtns[index])

    space.removeChild(windows[index].getDiv())

    windows.splice(index, 1)
    openbtns.splice(index, 1)
  }
})

// create clock in the top right corner that updates every second and show the time, date and day
const dateDiv = document.createElement('div')
dateDiv.classList.add('dateDiv')
dateDiv.style.zIndex = 1
dateDiv.style.position = 'absolute'
dateDiv.style.top = '0px'
dateDiv.style.right = '0px'
dateDiv.style.padding = '5px'
dateDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
dateDiv.style.color = 'white'
dateDiv.style.fontSize = '1.5em'

const date = new Date()
const day = date.getDay()
const month = date.getMonth()
const year = date.getFullYear()
const hours = date.getHours()
const minutes = date.getMinutes()
const seconds = date.getSeconds()

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

dateDiv.innerHTML = days[day] + ' ' + months[month] + ' ' + year + ' ' + hours + ':' + minutes + ':' + seconds

space.appendChild(dateDiv)

setInterval(() => {
  const date = new Date()
  const day = date.getDay()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  dateDiv.innerHTML = days[day] + ' ' + months[month] + ' ' + year + ' ' + hours + ':' + minutes + ':' + seconds
}, 1000)
