
// import "../assests/game_cards/" 
// import {html} from "../public/game_cards/html.png";
// import java from "../assests/game_cards/java.png";
// import js from "../assests/game_cards/js.png";
// import py from "../assests/game_cards/py.png";
// import ts from "../assests/game_cards/ts.png";
// import css from "../assests/game_cards/css.png";
// import csharp from "../assests/game_cards/c-sharp.png";
// import ruby from "../assests/game_cards/ruby.png";
// import logoOfGame from "../assests/memory-game-logo.png";

export default class Memory {
  #gameDiv = document.createElement('div')

  #game = document.createElement('div')

  #imgs = ['html.png', 'java.png', 'js.png', 'py.png', 'ts.png', 'css.png', 'c-sharp.png', 'ruby.png']
  // #imgs = [html, java, js, py, ts, css, csharp, ruby]
  #imgsId = [0, 1, 2, 3, 4, 5, 6, 7]
  #path = './assets/game_cards/'

  #startDiv = document.createElement('div')

  #openCard = null
  #attempts = document.createElement('div')
  #attemptsP = document.createElement('p')
  #attemptsCount = 0
  #size = 0
  #canflip = true
  #flipped = 0

  #startBtns = []

  #index = 0
  #currentCard = null

  #flipBound = (e) => { this.flip(e) }
  #keyBound = (e) => { this.keys(e) }

  constructor () {
    this.#gameDiv.classList.add('gameDiv')

    this.#game.classList.add('gameMemory')

    this.#attempts.classList.add('attempts')
    this.#attempts.style.color = 'white'
    this.#attemptsP.innerHTML = `Attempts: ${this.#attemptsCount}`
    this.#attempts.appendChild(this.#attemptsP)

    this.#startDiv.classList.add('startDiv')

    this.createStartDiv()
  }

  /**
   * @description creates the game
   * @returns the game div
   */
  getDiv () {
    return this.#gameDiv
  }

  /**
   * @description creates the start div
   */
  createStartDiv () {
    this.#gameDiv.replaceChildren()
    this.#startDiv.replaceChildren()
    const logo = document.createElement('img')
    logo.classList.add('logo')
    logo.src = './assets/memory-game-logo.png'
    // logo.src = logoOfGame
    this.#startDiv.appendChild(logo)


    this.createStartBtn('Advanced', 4)
    this.createStartBtn('Hard', 3)
    this.createStartBtn('Easy', 2)

  }

  /**
   * @description creates the start buttons
   * @param {string} name the name of the button
   * @param {number} size the size of the game
   */
  createStartBtn (name, size) {
    const startBtn = document.createElement('button')
    startBtn.classList.add('startBtn')
    startBtn.innerText = name
    startBtn.onclick = this.btnListner(size)
    this.#startDiv.appendChild(startBtn)
    this.#gameDiv.appendChild(this.#startDiv)
    this.#startBtns.push(startBtn)
  }

  /**
   * @description adds the listeners to the start buttons
   * @param {number} size the size of the game
   * @returns the function
   */
  btnListner (size) {
    return () => {
      this.#game.style.display = 'grid'
      this.#game.style.gridTemplateColumns = `repeat(${size}, 1fr)`
      this.#gameDiv.replaceChildren()
      this.#game.replaceChildren()
      this.#size = (size == 2) ? size : (size * 2)
      this.createGame()
    }
  }

  /**
   * creates the game as it should be acording to the size
   */
  createGame () {
    const topDivOfGame = document.createElement('div')
    topDivOfGame.classList.add('topDivOfGame')
    const hintBtn = document.createElement('button')
    hintBtn.classList.add('hintBtn')
    hintBtn.innerText = 'Hint'

    topDivOfGame.appendChild(hintBtn)
    topDivOfGame.appendChild(this.#attempts)

    this.#currentCard = null
    this.#openCard = null
    this.#index = 0
    this.#attemptsCount = 0
    this.#flipped = 0
    this.#attemptsP.innerHTML = `Attempts: ${this.#attemptsCount}`

    this.#gameDiv.appendChild(topDivOfGame)
    this.#gameDiv.appendChild(this.#game)

    const cards = []
    const cloned = []
    // shuffle the imgsId
    this.#imgsId.sort(() => Math.random() - 0.5)
    let i = 0

    // create the cards
    for (const nr of this.#imgsId) {
      if (i === this.#size) break
      const cardDiv = document.createElement('div')
      cardDiv.classList.add('cardDiv')

      const backSide = document.createElement('img')
      backSide.classList.add('backSide')
      backSide.src = './assets/memory-game-logo.png'
      // backSide.src = logoOfGame

      cardDiv.appendChild(backSide)

      const card = document.createElement('img')
      card.classList.add('card')
      card.src = `${this.#path}${this.#imgs[nr]}`
      // card.src = this.#imgs[nr]
      card.id = nr

      cardDiv.appendChild(card)
      this.#game.appendChild(cardDiv)

      cloned.push(cardDiv.cloneNode(true))
      cards.push(cardDiv)
      i++
    }

    // shuffle the cloned cards
    cloned.sort(() => Math.random() - 0.5)

    // add the cloned cards to the game
    cloned.forEach(card => {
      cards.push(card)
      this.#game.appendChild(card)
    })

    // show all the card for 2 seconds when the game starts
    cards.forEach(card => {
      card.classList.toggle('flipped')
    })

    // hide all the cards after 2 seconds
    setTimeout(() => {
      cards.forEach(card => {
        card.classList.toggle('flipped')
        this.addCardListeners(card)
      })
    }
    , 2000)

    // the parentElement of the parentElement of gameDiv is the window div that is needed to add the event listener
    this.#gameDiv.parentElement.parentElement.addEventListener('keydown', this.#keyBound)
    this.#gameDiv.parentElement.parentElement.tabIndex = 0
    this.#gameDiv.parentElement.parentElement.focus()

    this.#gameDiv.addEventListener('mouseover', (e) => {
      if (this.#currentCard !== null) {
        this.#currentCard.classList.remove('currentCard')
      }
    })

    let hints = 3
 
    // activate the hint button after 2 seconds
    setTimeout(() => {
      hintBtn.addEventListener('click', () => {
        if (hints === 0) {
          hintBtn.innerHTML = 'No more hints'
          return
        }
        this.#canflip = false
        let card = cards[Math.random() * cards.length | 0]
        if (card.classList.contains('flipped')) {
          cards.forEach(c => {
            if (!c.classList.contains('flipped')) {
              card = c
              return
            }
          })
        }
        card.classList.toggle('flipped')

        setTimeout(() => {
          card.classList.toggle('flipped')
          this.#canflip = true

        },500)
        hints--

    })
  }, 2000)


  }

  /**
   * the function that is called when the user clicks on a card.
   * it flips the card and checks if the user found a pair
   *
   * @param {event} e
   */
  async flip (e) {
    if (!this.#canflip) return

    // assuming that the cardDiv is the parent of the img
    let cardDiv = e.target.parentElement
    // this check is needed when the user clicks on the margin of the card and not the image
    if (!cardDiv.classList.contains('cardDiv')) { cardDiv = e.target }
    if (!cardDiv.classList.contains('cardDiv')) { cardDiv = this.#currentCard }

    if (this.#openCard === null) {
      cardDiv.classList.toggle('flipped')

      this.#openCard = cardDiv
      this.removeCardListeners(this.#openCard)
    } else {
      if (this.#openCard.childNodes[1].id === cardDiv.childNodes[1].id) {
        cardDiv.classList.toggle('flipped')
        this.#canflip = false

        // this is needed to wait for the flip animation to finish
        await new Promise(() => setTimeout(async () => {
          this.#openCard.childNodes[1].classList.add('correct')
          cardDiv.childNodes[1].classList.add('correct')
          // this is needed to wait for the jump animation to finish
          await new Promise(() => setTimeout(() => {
            this.#openCard.childNodes[1].classList.remove('correct')
            cardDiv.childNodes[1].classList.remove('correct')

            this.#openCard = null
            this.removeCardListeners(cardDiv)
            this.#canflip = true
            this.#attemptsCount++
            this.#attemptsP.innerHTML = `Attempts: ${this.#attemptsCount}`

            this.#flipped++

            this.checkWin()
          },
          750))
        }, 200))
      } else {
        this.#canflip = false
        cardDiv.classList.toggle('flipped')
        // this is needed to wait for the flip animation to finish
        await new Promise(() => setTimeout(async () => {
          this.#openCard.childNodes[1].classList.add('wrong')
          cardDiv.childNodes[1].classList.add('wrong')
          // this is needed to wait for the shake animation to finish
          await new Promise(() => setTimeout(() => {
            this.#openCard.childNodes[1].classList.remove('wrong')
            cardDiv.childNodes[1].classList.remove('wrong')
            cardDiv.classList.toggle('flipped')
            this.#openCard.classList.toggle('flipped')
            this.addCardListeners(this.#openCard)
            this.#openCard = null
            this.#canflip = true
            this.#attemptsCount++
            this.#attemptsP.innerHTML = `Attempts: ${this.#attemptsCount}`
          },
          750))
        }, 200))
      }
    }
  }

  /**
   * checks if the player won
   */
  checkWin () {
    if (this.#flipped === this.#size) {
      const w = document.createElement('div')
      w.classList.add('win')

      const b = document.createElement('button')
      b.innerText = 'Play again'

      const p = document.createElement('p')
      p.innerText = `You won in ${this.#attemptsCount} attempts!`

      b.addEventListener('click', () => {
        this.#gameDiv.replaceChildren()
        this.createStartDiv()
      })

      w.appendChild(p)
      w.appendChild(b)

      this.#gameDiv.appendChild(w)
    }
  }

  /**
   * adds the listners to the cardDiv
   *
   * @param {div} cardDiv
   */
  addCardListeners (cardDiv) {
    cardDiv.addEventListener('click', this.#flipBound)
  }

  /**
   * removes the listners from the cardDiv
   *
   * @param {div} cardDiv
   */
  removeCardListeners (cardDiv) {
    cardDiv.removeEventListener('click', this.#flipBound)
  }

  /**
   * the function that handles the keydown event.
   * it handles the arrows keys and the enter and space keys as triggers to flip.
   *
   * @param {event} e is the event trigged of the keydown
   */
  keys (e) {
    if (this.#currentCard == null) {
      this.#currentCard = this.#game.childNodes[0]
      this.#currentCard.classList.add('currentCard')
      this.#index = 0
    } else {
      if (e.key === 'ArrowRight') {
        this.#index++

        if (this.#index >= this.#game.childNodes.length) {
          this.#index = 0
        }

        this.#currentCard.classList.remove('currentCard')
        this.#currentCard = this.#game.childNodes[this.#index]
        this.#currentCard.classList.add('currentCard')
      }

      if (e.key === 'ArrowLeft') {
        this.#index--

        if (this.#index < 0) {
          this.#index = this.#game.childNodes.length - 1
        }

        this.#currentCard.classList.remove('currentCard')
        this.#currentCard = this.#game.childNodes[this.#index]
        this.#currentCard.classList.add('currentCard')
      }

      if (e.key === 'ArrowUp') {
        const s = this.#size == 2 ? 4 : this.#size

        if (!(this.#index < (s / 2))) {
          this.#index -= s / 2
          this.#currentCard.classList.remove('currentCard')
          this.#currentCard = this.#game.childNodes[this.#index]
          this.#currentCard.classList.add('currentCard')
        }
      }

      if (e.key === 'ArrowDown') {
        const s = this.#size == 2 ? 4 : this.#size

        if (!(this.#index >= this.#game.childNodes.length - (s / 2))) {
          this.#index += s / 2
          this.#currentCard.classList.remove('currentCard')
          this.#currentCard = this.#game.childNodes[this.#index]
          this.#currentCard.classList.add('currentCard')
        }
      }

      if (e.key === 'Enter' || e.key === ' ') {
        if (this.#currentCard.classList.contains('flipped')) return
        this.flip(e)
      }
    }
  }
}
