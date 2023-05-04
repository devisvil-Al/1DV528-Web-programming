import consoleAttributes from './consoleAttr.mjs'

/**
 * function to combaine all data goten from scraping and find
 * the best reservations if there are any
 *
 * @param {object} data - The data object
 */
export default function findReservations (data) {
  console.log()
  console.log()

  console.log(consoleAttributes.FgCyan + 'Recomendarions: ' + consoleAttributes.Reset)
  console.log('================')

  const days = {}

  const calendar = data.calendar

  for (const i in calendar) {
    for (const j in calendar[i]) {
      if (days[j] === undefined) {
        days[j] = 1
      } else {
        days[j] += 1
      }
    }
  }

  const dys = []
  // console.log(days)

  for (const i in days) {
    if (days[i] === 3) {
      dys.push(i)
    }
  }

  if (dys.length === 0) {
    console.log(consoleAttributes.FgRed + 'No reservations found' + consoleAttributes.Reset)
  } else {
    for (const day of dys) {
      let possible = true

      const movies = {}

      const dinner = []

      if (data.movies[day] === undefined) {
        possible = false
      } else {
        for (const i in data.movies[day]) {
          movies[i] = data.movies[day][i]
        }
      }

      if (data.dinner[day] === undefined) {
        possible = false
      } else {
        for (const i in data.dinner[day]) {
          dinner.push(data.dinner[day][i])
        }
      }

      const possibleReservations = []

      for (const movie in movies) {
        for (let i = 0; i < movies[movie].length; i++) {
          const movieTime = parseInt(movies[movie][i].split(':')[0])

          for (let j = 0; j < dinner.length; j++) {
            const dinnerTime = dinner[j].split(':')[0]

            if (dinnerTime - movieTime >= 2) {
              possibleReservations.push([movie, movies[movie][i], dinner[j]])
            }
          }
        }
      }

      if (possibleReservations.length === 0) {
        possible = false
      }

      if (possible === false) {
        console.log(consoleAttributes.FgRed + 'No reservations found on ' + day + consoleAttributes.Reset)
      } else {
        for (let i = 0; i < possibleReservations.length; i++) {
          console.log(consoleAttributes.FgCyan + 'On ' + day + consoleAttributes.Reset +
          ' the movie ' + consoleAttributes.FgYellow + '"' + possibleReservations[i][0] + '"' +
          consoleAttributes.Reset + ' starts at ' + consoleAttributes.FgMagenta + possibleReservations[i][1] +
          consoleAttributes.Reset + ' and there is a free table between ' + consoleAttributes.FgMagenta +
          possibleReservations[i][2].split(' ').join(''))
        }
      }
    }
  }
}
