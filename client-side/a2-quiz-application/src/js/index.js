
const startUrl = 'https://courselab.lnu.se/quiz/question/1'

const nameForm = document.getElementById('name-form')
const startBtn = document.getElementById('start')
const answerBtn = document.getElementById('submit')
const question = document.getElementById('question')
const answerField = document.getElementById('answer')
const radioBtnDiv = document.getElementById('radio-buttons')

const questionContainer = document.getElementById('question-container')
hideShow('hide', questionContainer) // should not be showed when we ask the user for name

const result = document.getElementById('result')
const resultDiv = document.getElementById('result-div')
hideShow('hide', resultDiv) // should onlu be showed when the quiz is over

const timeH2 = document.getElementById('time') // the element where to show the thime in the page
const restartBtn = document.getElementById('restart')

// attributes related to the quiz and the user.
let NAME = ''
let userTime
let questionType = 0
let btns = []

let nexturl = ''

// timer attributs
const progressBar = document.getElementById('progress-bar')
let timer
let progressTimer

let highScoreList = []

/**
 * start the timer for the questions.
 */
function startTimer () {
  clearInterval(progressTimer)
  const time = 10
  setInterval(progressBarTimer(time), 10000)
}

/**
 * reset the progressBar to 100% with removing the transition
 */
function resetProgressBar () {
  progressBar.style.transition = 'none'
  progressBar.style.width = '100%'
  progressBar.style.backgroundColor = 'green'
}

/**
 * this timer is mainly used to update the progressBar.
 *
 * @param {number} time is the seconde which will be displayed.
 */
function progressBarTimer (time) {
  progressBar.style.transition = 'all 1s linear'

  timeH2.innerHTML = 'time: ' + time + ' s'
  progressTimer = setInterval(() => {
    time -= 1
    if (time < 0) {
      gameOver("Time's up <br> Game Over")
    } else {
      if (time === 5) {
        progressBar.style.backgroundColor = 'orange'
      }
      if (time === 2) {
        progressBar.style.backgroundColor = 'red'
      }

      progressBar.style.width = `${(time / 10) * 100}%`
      timeH2.innerHTML = 'time: ' + time + ' s'
    }
  }, 1000)
}

startBtn.addEventListener('click', e => {
  e.preventDefault()
  const name = document.getElementById('name')
  if (name.value === '') {
    alert('Please write your name to be able to start the quiz')
  } else {
    startQuiz(name)
  }
})

/**
 * gets the name of the user before starting the quiz.
 *
 * @param {element} name is the element where to get the name from.
 */
function getname (name) {
  NAME = name.value
  name.value = ''
  hideShow('hide', nameForm)
  hideShow('show', questionContainer)
}

/**
 * send get and post requests deppending on the params given.
 * returns the response.
 *
 * @param {url} url is the URL where to send the request to.
 * @param {object} opt if it is a post then the opt is the json to send including the headers and the data.
 */
async function fetching (url, opt = null) {
  if (opt === null) {
    return await fetch(url)
  } else {
    return await fetch(url, opt)
  }
}

/**
 * starts the quiz when the user has given a name.
 *
 * @param {element} name is tbe element where to get the name.
 */
async function startQuiz (name) {
  getname(name)

  const question = await fetching(startUrl)

  if (question.status === 200) {
    userTime = Date.now()
    createQuestion(await question.json())
  } else {
    alert('Some problem occured!')
    console.log('error occured')
  }
}

/**
 * creates the question froms the response of the server.
 *
 * @param {object} response is the response containing the question.
 */
function createQuestion (response) {
  clearInterval(timer)

  question.innerHTML = response.question

  if ('alternatives' in response) {
    questionType = 1
    hideShow('hide', answerField)
    hideShow('show', radioBtnDiv)

    btns = []
    createRadioBtns(response.alternatives)
  } else {
    questionType = 0
    hideShow('show', answerField)
    hideShow('hide', radioBtnDiv)
  }

  if ('nextURL' in response) {
    nexturl = response.nextURL
  }
  timer = startTimer()
}

answerBtn.addEventListener('click', e => {
  e.preventDefault()

  if (questionType === 0 && answerField.value === '') {
    gameOver('You Faild to answer the question!')
  } else {
    const checkedBtn = getCheckedBtn()

    const opt = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { answer: (questionType === 0) ? answerField.value : checkedBtn }
      )
    }

    radioBtnDiv.replaceChildren()
    answerField.value = ''

    sendResponse(nexturl, opt)
  }
})

/**
 * function that creates and sends the response to the server.
 * it also handle the response of the response.
 *
 * @param {url} url is the URL where to sen the.
 * @param {object} opt is the json to be sended.
 */
async function sendResponse (url, opt) {
  const resOnRes = await fetching(url, opt)
  const resOnResData = await resOnRes.json()

  resetProgressBar()

  if (resOnRes.status === 200) {
    if ('nextURL' in resOnResData) {
      const nextQuestion = await fetch(resOnResData.nextURL)

      createQuestion(await nextQuestion.json())
    } else {
      userTime = ((Date.now() - userTime) / 1000)
      highScoreList.push({ name: NAME, time: userTime })

      gameOver('Congrats, You win! <br>' + resOnResData.message + '<br> time: ' + userTime + ' s')
    }
  } else if (resOnRes.status === 400) {
    gameOver(resOnResData.message + '<br> Game Over')
  }
}

/**
 *
 * This function will create labels that will contain
 * the answer alternatives and will add a click listner to them.
 * it works as a custom radio btns.
 *
 * @param {object} alternatives is the alternatives to answer the question.
 */
function createRadioBtns (alternatives) {
  for (const alt in alternatives) {
    const label = document.createElement('label')

    label.classList.add('label')
    label.innerText = alternatives[alt] // is the value to be shown in the page
    label.name = alt // is the value of the custom btn
    label.id = '0' // will be the 1 if the button is checked and 0 if not

    radioBtnDiv.appendChild(label)

    btns.push(label)

    // when any btn is clicked the value of it should cahnge to 1
    // and some styling changes to show that the btn was ckĺicked
    label.addEventListener('click', () => {
      // before it apply the the changes to the clicked btn
      // it should reset the rest of the btns.
      for (let l = 0; l < btns.length; l++) {
        if (btns[l].id === '1' && btns[l] !== label) {
          btns[l].id = '0'
          btns[l].style.borderColor = 'black'
          btns[l].style.backgroundColor = 'rgba(0, 60, 255, 0.349)'
          btns[l].style.border = '1px solid'
        }
      }
      label.id = 1
      label.style.borderColor = 'blue'
      label.style.background = 'rgba(0, 60, 255, 0.5)'
      label.style.border = '2px solid'
    })
  }
}

/**
 * returns the button checked from the radio buttons.
 *
 * @returns {string} the alternative chisen.
 */
function getCheckedBtn () {
  for (let i = 0; i < btns.length; i++) {
    if (btns[i].id === '1') {
      console.log(typeof btns[i].name)
      return btns[i].name
    }
  }
  return ''
}

/**
 * hide or shows elements in the page.
 *
 * @param {string} action is to hide or show an element.
 * @param {element} element is swhich element to applay the action on.
 */
function hideShow (action, element) {
  (action === 'hide') ? element.style.display = 'none' : element.style.display = 'block'
}

/**
 * the function that is called when the user wins or loses.
 *
 * @param {string} message is the message to be shown when gane is over.
 */
function gameOver (message) {
  clearInterval(timer)
  clearInterval(progressTimer)

  result.innerHTML = message
  hideShow('show', resultDiv)
  hideShow('hide', timeH2)
  hideShow('hide', questionContainer)
  displayResults()
}

/**
 * displays the results as a table in the result div.
 */
function displayResults () {
  // look at list from localstorage and add the values to the list exsisting here.
  const savedScores = JSON.parse(localStorage.getItem('highScoreList'))
  if (savedScores != null) {
    savedScores.forEach(result => highScoreList.push(result))
  }

  // sort the list and get only the first 5 objects.
  highScoreList.sort((a, b) => a.time - b.time)
  highScoreList = highScoreList.slice(0, 5)
  localStorage.setItem('highScoreList', JSON.stringify(highScoreList))

  // create a table element
  const table = document.getElementById('score-table')
  table.replaceChildren()

  // create a table header with the column names
  const thead = document.createElement('thead')
  const tr = document.createElement('tr')
  tr.innerHTML = '<th>name</th><th>Time</th>'
  thead.appendChild(tr)
  table.appendChild(thead)

  // create a table body and add a row for each score in the highScoreList
  const tbody = document.createElement('tbody')
  highScoreList.forEach(result => {
    const tr = document.createElement('tr')
    tr.innerHTML = `<td>${result.name}</td><td>${result.time}</td>`
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)

  // add the table to the result div
  resultDiv.appendChild(table)
}

/**
 * restarts the game.
 */
restartBtn.addEventListener('click', e => {
  e.preventDefault()

  highScoreList = []

  resetProgressBar()

  hideShow('hide', resultDiv)
  hideShow('show', nameForm)
  hideShow('show', timeH2)
})
