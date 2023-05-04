/**
 * To check that the tools are working.
 */
'use strict'

/**
 * Return a hello message.
 *
 * @returns {string} with hello message
 */
function helloWorld () {
  return 'Hello World'
}

/**
 * Calculates the sum of the parameters.
 *
 * @param {number} x - Operand.
 * @param {number} y - Operand.
 * @returns {number} The sum of the operands.
 */
function add (x, y) {
  return x + y
}

console.log(helloWorld() + add(1, 1))
