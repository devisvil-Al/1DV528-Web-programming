const SERVERURL = "http://localhost:3000";

import divsCreater from './divsCreater.mjs';
import mainFunctions from './main.mjs';
import { state } from './state.mjs';

if(window.location.pathname !== '/') {
  window.history.pushState({}, '', '/projects');
  mainFunctions.createHeader()
  mainFunctions.createProjectsDiv()
} else {
  window.history.pushState({}, '', '/');
  mainFunctions.createHome(true);
}

import '/socket.io-client/socket.io.min.js'

// настройка соединения сокета
const Socket = {
  socket: null,

  init: async function() {
    if (this.socket === null) {
      try {
        this.socket = io(SERVERURL);

      } catch (error) {
        console.error('Error on connecting to server', error)
      }
      
      this.socket.on('connect', () => {
        console.log('Connected to server with id: ' + this.socket.id);
      })
    }
    return this.socket
  },

}

const socket = await Socket.init()

// сообщение о подключенни к серверу
socket.on('connect', () => {
  sessionStorage.setItem('socketId', socket.id)
  console.log('Connected to server with id: ' + socket.id);
});
// сообщение о разрыве соединения
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// принятие сообщений с сервера
socket.on('message', (message) => {
  socket.showFlashMessage(message);
  var page = window.location.pathname
  var arr = []
  page = page.split('/')
  for (let i = 0; i < page.length; i++) {
    if (! (page[i] === '')) {
      arr.push(page[i])
    }
  }
  // получение данных (webHook)
  if (arr[0] === 'projects') {
    if (message.object_kind === 'issue') {
      const div = document.getElementById(`projectDiv${message.project.id}`)
      const update = div.childNodes[1]
      const lastActivityDate = new Date(message.object_attributes.updated_at)
      const lastActivityDateStr = lastActivityDate.toDateString()
      const lastActivityTimeStr = lastActivityDate.toLocaleTimeString()
      update.innerHTML = `Last activity at: ${lastActivityDateStr} ${lastActivityTimeStr}`
    
    } else if (message.object_kind === 'push') {
      const div = document.getElementById('projectsDiv')
      div.appendChild(divsCreater.createProjectDiv(message.project))   
    }
  
  } else if (arr[0] === 'project') {
    console.log(message)
    if (arr[1] === message.project.id.toString()) {
      if (message.object_kind === 'issue') {
        setTimeout(() => {
          window.location.reload()
        }, 5000)

      }
    }
  } 
  // получение данных с сервера
  if(message.mod === 'issue') {
    message.body.state = message.body.state_event === "reopen" ? "opened" : "closed"
    const issues = state.issues.map(issue => {
      if (issue.iid === message.body.issue_iid) {
        return message.body
      }
      return issue
    })
    state.issues = issues
    state.replaceIssues()
  }
  
  
});

socket.showFlashMessage = (message) => {
  const flashMessage  = document.getElementById('flashMessage')

  if (message.object_kind === 'issue') {
    console.log(message)
    flashMessage.innerHTML = "New updates in " + message.project.name + " project. at the issue: " + message.object_attributes.title 
    flashMessage.style.display = 'flex'
    setTimeout(() => {
      flashMessage.style.display = 'none'
    }, 5000)
    
  } else if (message.object_kind === 'push') {
    flashMessage.innerHTML = "New project with name " + message.project.name + " created"
    flashMessage.style.display = 'flex'
    setTimeout(() => {
      flashMessage.style.display = 'none'
    }, 5000)

  } else if (message.object_kind === 'note') {
    flashMessage.innerHTML = "New comment in " + message.project.name + " project. at the issue: " + message.issue.title
    flashMessage.style.display = 'flex'
    setTimeout(() => {
      flashMessage.style.display = 'none'
    }, 5000)
  }
  else if (message.mod === 'issue'){
    flashMessage.innerHTML = `The question titled ${message.body.title} has been changed` 
    flashMessage.style.display = 'flex'
    setTimeout(() => {
      flashMessage.style.display = 'none'
    }, 5000)
  }
}

export default socket
