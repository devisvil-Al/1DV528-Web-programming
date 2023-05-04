import startScrape from './scraper.mjs'

import findReservations from './reservation.js'

const startUrl = process.argv[2]

// the program starts here
findReservations(await startScrape(startUrl))
