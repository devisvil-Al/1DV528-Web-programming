
import webSocket from './webSocket.mjs'

export default class Chatt {
  #chatt = document.createElement('div')
  #chattBody = null
  #chattInput = null
  #usernameCheck = e => { this.checkUsername(e) }

  #password = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

  // the data object that is sent to the server
  d = {
    type: 'message',
    data: 'The message text is sent using the data property',
    username: localStorage.getItem('username'),
    channel: 'General',
    key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
  }

  constructor () {
    this.#chatt.classList.add('chatt')

    // helps to fix the styling
    this.#chatt.addEventListener('max', () => {
      this.#chattBody.classList.add('max')
      this.#chattBody.scrollTop = this.#chattBody.scrollHeight
    })

    this.#chatt.addEventListener('min', () => {
      this.#chattBody.classList.remove('max')
      this.#chattBody.scrollTop = this.#chattBody.scrollHeight
    })


    if (localStorage.getItem('username') === null) {
      this.createUsernameDiv()
    } else {
      this.d.username = localStorage.getItem('username')
      this.createChattDiv()
    }
  }

  /**
   * Returns the div element
   * @returns {HTMLDivElement} the div element
   */
  getDiv () {
    return this.#chatt
  }

  /**
   * Creates the div that asks for username first time to open chatt
   */
  createUsernameDiv () {
    const usernameDiv = document.createElement('div')

    const t = document.createElement('h1')
    t.innerHTML = ' Welcome to Chat Application'

    const tt = document.createElement('h3')

    tt.innerHTML = 'To start using the application please enter your username.'

    usernameDiv.appendChild(t)
    usernameDiv.appendChild(tt)

    usernameDiv.classList.add('usernameDiv')
    const username = document.createElement('input')
    username.classList.add('username')
    username.placeholder = 'Username'

    username.addEventListener('focus', e => {
      username.placeholder = ''
    })
    username.addEventListener('blur', e => {
      username.placeholder = 'Username'
    })

    username.addEventListener('keyup', e => {
      switch (e.key) {
        case 'Enter':
          this.checkUsername(e)
          break
        default:
          break
      }
    })

    const usernameButton = document.createElement('button')
    usernameButton.classList.add('usernameButton')
    usernameButton.innerHTML = 'Set username'
    usernameDiv.appendChild(username)
    usernameDiv.appendChild(usernameButton)

    usernameButton.addEventListener('click', this.#usernameCheck)

    this.#chatt.appendChild(usernameDiv)
  }

  /**
   * validates the username and creates the chatt div
   * @param {event} e 
   */
  checkUsername (e) {
    e.preventDefault()
    const username = document.querySelector('.username')
    const regex = /[^a-zA-Z0-9]/g
    if (username.value === '') {
      alert('Please enter a username')
    } else {
      if (regex.test(username.value)) {
        alert('Please enter a valid username')
      } else {
        const user = username.value
        localStorage.setItem('username', user)
        this.d.username = user

        this.#chatt.removeChild(this.#chatt.childNodes[0])
        this.createChattDiv()
      }
    }
  }

  /**
   * Creates the chatt element
   * @returns {HTMLDivElement} the chatt element
   * 
   */
  createChattDiv () {
    const chattDiv = document.createElement('div')
    chattDiv.classList.add('chattDiv')

    const chattHeader = this.chattHeader()
    chattDiv.appendChild(chattHeader)

    this.#chattBody = document.createElement('div')
    this.#chattBody.classList.add('chattBody')

    chattDiv.appendChild(this.#chattBody)

    const chattFooter = this.chattFooter()
    chattDiv.appendChild(chattFooter)

    this.#chatt.appendChild(chattDiv)

    this.initWebSocket()
  }

  /**
   * start the webSocket adds the listners
   */ 
  initWebSocket () {
    webSocket.init(this)
    this.#chatt.addEventListener("closeSocket", () => {
      webSocket.remove(this)
    })

  }

  /**
   * dunction called fro webSocket when a new message is received
   * @param {event} e the event that contains all data needed
   */
  newMsg(e) {

    const msgDiv = document.createElement('div')
    const t = document.createElement('p')
    t.innerHTML = 'Channel: ' + JSON.parse(e.data).channel + ' | ' + new Date().toLocaleString()

    const msg = document.createElement('p')
    msg.classList.add('msg')

    // if the user is the same as in the current chat then the message will be on the right side
    if (JSON.parse(e.data).username === this.d.username) {
      msgDiv.style.backgroundColor = 'rgb(2, 54, 167)'
      msgDiv.style.marginLeft = '28%'
    }

    msg.innerHTML = JSON.parse(e.data).username + ': ' + JSON.parse(e.data).data
    msgDiv.appendChild(msg)
    msgDiv.appendChild(t)

    if (this.d.channel === 'General') {
      if (JSON.parse(e.data).channel === 'General' || JSON.parse(e.data).channel === 'general') {
        this.#chattBody.appendChild(msgDiv)
      }
    } else if (this.d.channel === 'Encrypted') {
      if (JSON.parse(e.data).channel === 'Encrypted' || JSON.parse(e.data).channel === 'encrypted') {
        msg.innerHTML = JSON.parse(e.data).username + ': ' + this.decrypt(JSON.parse(e.data).data)

        this.#chattBody.appendChild(msgDiv)
      }
    } else {
      this.#chattBody.appendChild(msgDiv)
    }

    this.#chattBody.scrollTop = this.#chattBody.scrollHeight
  }


  /**
   * Sends the message to the server
   *
   * @param {string} msg
   */
  sendMsg (msg) {
    if (!webSocket.ws || webSocket.ws.readyState !== WebSocket.OPEN) {
      return
    }
    if (this.d.channel === 'Encrypted') {
      this.d.data = this.encrypt(msg)
    } else {
      this.d.data = msg
    }
    console.log("here")
    webSocket.ws.send(JSON.stringify(this.d))
  }

  /**
   * Creates the header for the chatt
   *
   * @returns {HTMLDivElement} chattHeader
   */
  chattHeader () {
    const chattHeader = document.createElement('div')
    chattHeader.classList.add('chattHeader')

    const userDiv = document.createElement('div')

    const username = document.createElement('p')
    username.classList.add('username')
    username.innerHTML = 'Username: ' + localStorage.getItem('username')
    userDiv.appendChild(username)

    const changeUserBtn = document.createElement('button')
    changeUserBtn.classList.add('changeUserBtn')
    changeUserBtn.innerHTML = 'Change user'
    userDiv.appendChild(changeUserBtn)

    const usernameField = document.createElement('input')

    usernameField.addEventListener('keyup', e => {
      switch (e.key) {
        case 'Enter':
          const regex = /[^a-zA-Z0-9]/g
          if (regex.test(usernameField.value)) {
            alert('Please enter a valid username')
          } else {
            localStorage.setItem('username', usernameField.value)
            username.innerHTML = 'Username: ' + localStorage.getItem('username')
            userDiv.removeChild(usernameField)
            userDiv.appendChild(changeUserBtn)
            this.d.username = localStorage.getItem('username')
          }
          break
        default:
          break
      }
    })

    usernameField.addEventListener('blur', e => {
      new Promise(r => setTimeout(() => {
        if (userDiv.contains(usernameField)) {
          userDiv.removeChild(usernameField)
          userDiv.appendChild(changeUserBtn)
        }
      }, 10))

      username.innerHTML = 'Username: ' + localStorage.getItem('username')
    })

    changeUserBtn.addEventListener('click', e => {
      username.innerHTML = 'Username: '
      userDiv.replaceChildren(username, usernameField)
      usernameField.focus()
    })

    chattHeader.appendChild(userDiv)

    const channelDiv = document.createElement('div')
    const channel = document.createElement('p')
    channel.innerHTML = 'Channel: '

    const channelSelect = document.createElement('select')
    channelSelect.classList.add('channelSelect')
    const option1 = document.createElement('option')
    option1.innerHTML = 'General'

    const option2 = document.createElement('option')
    option2.innerHTML = 'Encrypted'

    const option3 = document.createElement('option')
    option3.innerHTML = 'Any'

    channelSelect.addEventListener('change', e => {
      this.d.channel = channelSelect.options[channelSelect.selectedIndex].value
      this.readCahsedMsgs(this.d.channel)
    })

    channelSelect.appendChild(option1)
    channelSelect.appendChild(option2)
    channelSelect.appendChild(option3)
    channel.appendChild(channelSelect)
    channelDiv.appendChild(channel)

    const clearBtn = document.createElement('button')
    clearBtn.classList.add('clearBtn')
    clearBtn.innerHTML = 'Clear Chatt'

    clearBtn.addEventListener('click', e => {
      this.#chattBody.innerHTML = ''

      localStorage.setItem(this.d.channel, null)
    })

    channelDiv.appendChild(clearBtn)
    




    chattHeader.appendChild(channelDiv)

    return chattHeader
  }

  /**
   * Creates the footer for the chatt
   *
   * @returns {HTMLDivElement} chattFooter
   */
  chattFooter () {
    const chattFooter = document.createElement('div')
    chattFooter.classList.add('chattFooter')

    const emojiButton = document.createElement('button')
    emojiButton.classList.add('emojiButton')
    emojiButton.innerHTML = '😀'

    const emojiDiv = this.createEmojies()

    emojiDiv.style.display = 'none'
    chattFooter.appendChild(emojiDiv)

    emojiButton.addEventListener('click', e => {
      if (emojiDiv.style.display === 'none') {
        emojiDiv.style.display = 'block'
      } else {
        emojiDiv.style.display = 'none'
      }
    })

    chattFooter.appendChild(emojiButton)

    this.#chattInput = document.createElement('input')
    this.#chattInput.classList.add('chattInput')
    this.#chattInput.placeholder = 'Message'

    this.#chattInput.addEventListener('keyup', e => {
      switch (e.key) {
        case 'Enter':
          if (this.#chattInput.value === '') {
            break
          }
          this.sendMsg(this.#chattInput.value)
          this.#chattInput.value = ''
          break
        default:
          break
      }
    })

    chattFooter.appendChild(this.#chattInput)

    const chattButton = document.createElement('button')
    chattButton.classList.add('chattButton')
    chattButton.innerHTML = 'Send'

    chattButton.addEventListener('click', e => {
      if (this.#chattInput.value === '') {
        return
      }
      this.sendMsg(this.#chattInput.value)
      this.#chattInput.value = ''
    })

    chattFooter.appendChild(chattButton)

    return chattFooter
  }

  /**
   * function to create emoji buttons from hex code.
   * it adds them in to a div and adds event listeners to them.
   *
   * @returns {div} emojiDiv
   */
  createEmojies () {
    const emojiDiv = document.createElement('div')
    emojiDiv.classList.add('emojiDiv')
    for (let i = 128512; i < 128592; i++) {
      const emojiHexCode = i.toString(16)
      const emoji = String.fromCodePoint(`0x${emojiHexCode}`)
      const emojiButton = document.createElement('button')
      emojiButton.innerHTML = emoji
      emojiButton.addEventListener('click', e => {
        this.#chattInput.value += emoji
        emojiDiv.style.display = 'none'
      })
      emojiDiv.appendChild(emojiButton)
    }

    for (let i = 128636; i < 128700; i++) {
      const emojiHexCode = i.toString(16)
      const emoji = String.fromCodePoint(`0x${emojiHexCode}`)
      const emojiButton = document.createElement('button')
      emojiButton.innerHTML = emoji
      emojiButton.addEventListener('click', e => {
        this.#chattInput.value += emoji
        emojiDiv.style.display = 'none'
      })
      emojiDiv.appendChild(emojiButton)
    }

    return emojiDiv
  }

  /**
   * reads the cached messages from local storage and added them To the chatt.
   *
   * @param {string} channel
   */
  readCahsedMsgs (channel) {
    this.#chattBody.replaceChildren()
    const msgs = JSON.parse(localStorage.getItem(channel))
    if (msgs === null) {
      return
    }

    for (let i = 0; i < msgs.length; i++) {
      const t = document.createElement('p')

      if (channel === 'Any') {
        t.innerHTML = 'Channel: ' + msgs[i].channel + ' | ' + msgs[i].time
      } else {
        t.innerHTML = 'Channel: ' + channel + ' | ' + msgs[i].time
      }

      const msgDiv = document.createElement('div')
      const msg = document.createElement('p')

      if (channel === 'Encrypted') {
        msg.innerHTML = msgs[i].username + ': ' + this.decrypt(msgs[i].msg)
      } else {
        msg.innerHTML = msgs[i].username + ': ' + msgs[i].msg
      }

      msgDiv.appendChild(msg)
      msgDiv.appendChild(t)
      this.#chattBody.appendChild(msgDiv)

      if (msgs[i].username === this.d.username) {
        msgDiv.style.marginLeft = '28%'
        msgDiv.style.backgroundColor = 'rgb(2, 54, 167)'
      }

      this.#chattBody.scrollTop = this.#chattBody.scrollHeight
    }
  }

  /**
   * encrypt the msg if the channel is encrypted.
   *
   * @param {string} msg
   * @returns {string} encrypted msg
   */
  encrypt (msg) {
    let encrypted = ''
    for (let i = 0; i < msg.length; i++) {
      encrypted += String.fromCharCode(msg.charCodeAt(i) ^ this.#password.charCodeAt(i % this.#password.length))
    }
    return encrypted
  }

  /**
   * decrypt the msg if the channel is encrypted.
   *
   * @param {string} msg
   * @returns {string} decrypted msg
   */
  decrypt (msg) {
    let decrypted = ''
    for (let i = 0; i < msg.length; i++) {
      decrypted += String.fromCharCode(msg.charCodeAt(i) ^ this.#password.charCodeAt(i % this.#password.length))
    }

    return decrypted
  }
}
