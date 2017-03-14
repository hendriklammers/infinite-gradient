import {curry} from 'ramda'

// Default curried clamp function
const clamp = curry((min, max, n) => Math.min(Math.max(n, min), max))

// Default curried linear interpolation function
const lerp = curry((min, max, n) => (max - min) * n + min)

// Default curried normalize function
const normalize = curry((min, max, n) => (n - min) / (max - min))

// RGB string to array: rgb(255,255,255) -> [255,255,255]
const rgbToArray = str => str.replace(/[^\d,]/g, '').split(',')

// RGB array to string: [255,255,255] -> rgb(255,255,255)
const arrayToRgb = arr => `rgb(${arr[0]},${arr[1]},${arr[2]})`

export {
  arrayToRgb,
  clamp,
  lerp,
  normalize,
  rgbToArray
}
