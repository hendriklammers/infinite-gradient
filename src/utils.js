import {curry, compose, map} from 'ramda'

// Default curried clamp function
const clamp = curry((min, max, n) => Math.min(Math.max(n, min), max))

// Default curried linear interpolation function
const lerp = curry((min, max, n) => (max - min) * n + min)

// Default curried normalize function
const normalize = curry((min, max, n) => (n - min) / (max - min))

// Splits rgb string into array with strings
const splitRgb = str => str.replace(/[^\d,]/g, '').split(',')

// RGB string to array: rgb(255,255,255) -> [255,255,255]
const rgbToArray = compose(map(parseInt), splitRgb)

const clampRgb = clamp(0, 255)

// RGB array to string: [255,255,255] -> rgb(255,255,255)
const arrayToRgb = arr =>
  `rgb(${clampRgb(arr[0])},${clampRgb(arr[1])},${clampRgb(arr[2])})`

export {
  arrayToRgb,
  clamp,
  lerp,
  normalize,
  rgbToArray
}
