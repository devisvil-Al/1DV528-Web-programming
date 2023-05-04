export default class Nasa {
  #api = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count='

  #count = 1

  #nasaDiv = document.createElement('div')
  #topDiv = document.createElement('div')
  #factContainer = document.createElement('div')

  constructor () {
    this.#nasaDiv.classList.add('nasaDiv')
    this.#topDiv.classList.add('topDiv')
    this.#factContainer.classList.add('factContainer')

    // helps to fix the styling
    this.#nasaDiv.addEventListener('max', () => {
      this.#nasaDiv.classList.add('maxNasa')
      this.#nasaDiv.scrollTop = this.#nasaDiv.scrollHeight
    })

    this.#nasaDiv.addEventListener('min', () => {
      this.#nasaDiv.classList.remove('maxNasa')
      this.#nasaDiv.scrollTop = this.#nasaDiv.scrollHeight
    })

    this.#nasaDiv.appendChild(this.#topDiv)
    this.#nasaDiv.appendChild(this.#factContainer)

    const updateBtn = document.createElement('button')
    updateBtn.classList.add('updateBtn')
    updateBtn.innerHTML = 'Update'
    updateBtn.addEventListener('click', () => {
      this.#factContainer.innerHTML = ''
      this.#fetchData()
    })

    this.#topDiv.appendChild(updateBtn)

    const select = document.createElement('select')

    for (let i = 1; i < 11; i++) {
      const option = document.createElement('option')
      option.innerHTML = i
      select.appendChild(option)
    }

    select.addEventListener('change', () => {
      console.log(select.options[select.selectedIndex].value)
      this.#count = select.options[select.selectedIndex].value
    })

    const label = document.createElement('label')
    label.innerHTML = 'Number of facts: '
    this.#topDiv.appendChild(label)

    select.classList.add('selectCount')
    this.#topDiv.appendChild(select)

    this.#fetchData()
  }

  /**
   * Returns the div that contains the nasa facts
   * @returns {HTMLDivElement} the div that contains the nasa facts
   */
  getDiv () {
    return this.#nasaDiv
  }

  /**
   * Fetches the data from the api
   * 
   */
  #fetchData = async () => {
    const response = await fetch(this.#api + this.#count)
    const data = await response.json()
    this.#renderData(data)
  }


  /**
   * Renders the data to the page
   * @param {Array} data the data to render
   */
  #renderData = (data) => {
    data.forEach(element => {
      const div = document.createElement('div')
      if (element.media_type === 'video') {
        const iframe = document.createElement('iframe')
        iframe.src = element.url
        div.appendChild(iframe)
      } else {
        const img = document.createElement('img')
        img.src = element.url
        div.appendChild(img)
      }

      const img = document.createElement('img')
      const p = document.createElement('p')
      const h2 = document.createElement('h2')

      div.classList.add('nasadiv__item')
      img.classList.add('nasadiv__item__img')
      p.classList.add('nasadiv__item__p')
      h2.classList.add('nasadiv__item__h2')

      img.src = element.url
      p.innerHTML = element.explanation
      h2.innerHTML = element.title

      div.appendChild(h2)
      div.appendChild(p)
      this.#factContainer.appendChild(div)
    })
  }
}
