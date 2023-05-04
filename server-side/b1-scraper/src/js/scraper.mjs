
import parser from 'node-html-parser'
import fetch from 'node-fetch'
import consoleAttributes from './consoleAttr.mjs'

/**
 * function that start the scraping process
 * @param {String} url - The url to start scraping from
 */
async function startScrap (url) {
  const extracted = await extraxt(url, 'links')
  const links = extracted[0]
  const names = extracted[1]

  console.log(consoleAttributes.FgMagenta + 'OK!' + consoleAttributes.Reset)

  const data = {}

  for (let i = 0; i < links.length; i++) {
    const switchCase = names[i].toLowerCase()
    switch (switchCase.toLowerCase()) {
      case 'calendar':
        data.calendar = await scrapCalendar(links[i], 'available days')
        break
      case 'thecinema!':
        data.movies = await scrapCinema(links[i], 'showtimes')
        break
      case "zeke'sbar!":
        data.dinner = await scrapBar(links[i], names[i])
        break
      default:
        console.log(switchCase)
        break
    }
  }

  return data
}

/**
 * function that extracts all the links from a page
 * @param {String} url - The url to start scraping from
 * @param {String} name - The name of the page
 */
async function extraxt (url, name) {
  process.stdout.write(consoleAttributes.FgCyan + 'Scraping: ' + consoleAttributes.Reset + name + '... ')

  const root = await fetchHtml(url)

  const anchors = root.querySelectorAll('a')

  const links = anchors.map((element) => element.rawAttrs)
  const names = anchors.map((element) => element.textContent)

  for (let i = 0; i < links.length; i++) {
    links[i] = links[i].replace('href="', '')
    links[i] = links[i].replace('"', '')
    names[i] = names[i].split('\n').join('')
    names[i] = names[i].split(' ').join('')
  }

  return [links, names]
}

/**
 * function that fetches the html from a page
 * and parses it into a root html document
 * @param {String} url - The url to fetch the html from
 * @returns {HTMLElement} - The root html document
 */
async function fetchHtml (url) {
  const site = await fetch(url)
  const document = await site.text()
  return parser.parse(document)
}

/**
 * function that scrapes the calendar page
 * @param {String} url - The url to the calendar page
 * @param {String} name - The name of the page
 * @returns {object} with the calendar data
 */
async function scrapCalendar (url, name) {
  const extracted = await extraxt(url, name)
  const links = extracted[0]
  const names = extracted[1]
  console.log(consoleAttributes.FgMagenta + 'OK!' + consoleAttributes.Reset)

  const calender = {}

  for (let i = 0; i < links.length; i++) {
    calender[names[i]] = await getIndevidualCalendar(url + links[i], names[i])
  }

  return calender
}

/**
 * function that scrapes the individual calendar pages
 * @param {String} url - The url to the calendar page
 * @returns {object} an object with the calendar data
 */
async function getIndevidualCalendar (url) {
  const s = await fetch(url)
  const t = await s.text()
  const root = parser.parse(t)
  // console.log("\n")

  const table = root.querySelector('table')

  const heads = table.querySelectorAll('th')

  const days = heads.map((element) => element.textContent)

  const columns = table.querySelectorAll('td').map((element) => element.textContent)

  const calendar = {}
  const regex = /[^a-zA-Z0-9]/g
  for (let i = 0; i < days.length; i++) {
    // console.log(regex.test(columns[i]))
    if (regex.test(columns[i])) { continue }
    calendar[days[i]] = columns[i].toLowerCase()
  }

  return calendar
}

/**
 * function that scrapes the cinema page
 * @param {String} url - The url to the cinema page
 * @returns {object} with the cinema data
 */
async function scrapCinema (url) {
  const data = {}
  const document = await fetchHtml(url)
  process.stdout.write(consoleAttributes.FgCyan + 'Scraping: ' + consoleAttributes.Reset + 'showtimes... ')

  const selects = document.querySelectorAll('select')

  const names = {}
  const ids = {}

  for (let i = 0; i < selects.length; i++) {
    let options = selects[i].querySelectorAll('option')
    options = options.slice(1, options.length)
    names[selects[i].attributes.name] = options.map((element) => element.textContent)
    ids[selects[i].attributes.name] = options.map((element) => element.attributes.value)
  }

  for (let i = 0; i < names.movie.length; i++) {
    for (const j of names.day) {
      const time = await getMovieTime(url, ids.day[names.day.indexOf(j)], ids.movie[i])
      if (time.length === 0) { continue } else {
        if (!data[j]) {
          data[j] = {}
        }
        if (!data[j][names.movie[i]]) {
          data[j][names.movie[i]] = time
        }
      }
    }
  }
  console.log(consoleAttributes.FgMagenta + 'OK!' + consoleAttributes.Reset)

  return data
}

/**
 * function that scrapes the cinema page for the showtimes of a movie
 * @param {String} url - The url to the cinema page
 * @param {String} day - The day to check
 * @param {String} movie - The movie to check
 */
async function getMovieTime (url, day, movie) {
  const res = await fetch(url + '/check?day=' + day + '&movie=' + movie)
  const data = await res.json()

  const retData = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].status === 1) {
      retData.push(data[i].time)
    }
  }

  return retData
}

/**
 * function that scrapes the bar page to get the possible reservations
 * @param {String} url - The url to the bar page
 * @param {String} name - The name of the page
 */
async function scrapBar (url, name) {
  const username = 'zeke'
  const password = 'coys'

  process.stdout.write(consoleAttributes.FgCyan + 'Scraping: ' + consoleAttributes.Reset + 'possible reservations... ')

  const document = await fetchHtml(url)

  let action = document.querySelector('form').attributes.action

  action = url + action.split('./').join('')

  const options = {
    method: 'POST',
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${username}&password=${password}&submit=login`
  }

  const res = await fetch(action, options)
  const link = res.headers.get('location')
  const cookie = res.headers.get('set-cookie')

  const req = await fetch(link, { headers: { Cookie: cookie } })
  const doc = await req.text()
  const root = parser.parse(doc)
  const inputs = root.querySelectorAll('input')

  const values = []
  for (const element of inputs) {
    if (element.attributes.type === 'radio') {
      values.push(element.attributes.value)
    }
  }

  console.log(consoleAttributes.FgMagenta + 'OK!' + consoleAttributes.Reset)

  return fixReservationTime(values)
}

/**
 * function that fixes the reservation time to a readable format
 * @param {object} days - The days to fix wiht the times
*/
function fixReservationTime (days) {
  const data = {}

  for (const i of days) {
    const day = i.substring(0, 3)
    const startTime = i.substring(3, 5) + ':00'
    const endTime = i.substring(5, 7) + ':00'

    switch (day) {
      case 'fri':
        if (data.Friday === undefined) {
          data.Friday = []
          data.Friday.push(startTime + ' - ' + endTime)
        } else {
          data.Friday.push(startTime + ' - ' + endTime)
        }
        break
      case 'sat':
        if (data.Saturday === undefined) {
          data.Saturday = []
          data.Saturday.push(startTime + ' - ' + endTime)
        } else {
          data.Saturday.push(startTime + ' - ' + endTime)
        }
        break
      case 'sun':
        if (data.Sunday === undefined) {
          data.Sunday = []
          data.Sunday.push(startTime + ' - ' + endTime)
        } else {
          data.Sunday.push(startTime + ' - ' + endTime)
        }
        break
      default:
        break
    }
  }

  return data
}

export default startScrap
