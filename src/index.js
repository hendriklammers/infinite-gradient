import './styles.css'
import {fromEvent} from 'most'
import {compose, curry, map} from 'ramda'
import randomColor from 'randomcolor'

const styles = document.documentElement.style
const TWEEN_DISTANCE = 2000

// Default curried clamp function
const clamp = curry((min, max, n) => Math.min(Math.max(n, min), max))
const clampRgb = clamp(0, 255)

// Default curried normalize function
const normalize = curry((min, max, n) => (n - min) / (max - min))
const normalizeTween = normalize(0, TWEEN_DISTANCE)

// Default curried linear interpolation function
const lerp = curry((min, max, n) => (max - min) * n + min)

// RGB string to array: rgb(255,255,255) -> [255,255,255]
const rgbToArr = str => str.replace(/[^\d,]/g, '').split(',')

// RGB array to string: [255,255,255] -> rgb(255,255,255)
const arrToRgb = arr => `rgb(${arr[0]},${arr[1]},${arr[2]})`

// Uses randomColor library to create a new rgb color array
const newColor = compose(
  map(parseInt),
  rgbToArr,
  randomColor.bind(null, {format: 'rgb'})
)

// Calculates interpolated color from two rgb arrays
const tweenColors = (c1, c2, val) => c1.map((c, i) =>
  compose(clampRgb, Math.round, lerp(c, c2[i]), normalizeTween)(val)
)
  // clampRgb(Math.round(lerp(c, c2[i], normalize(0, TWEEN_DISTANCE, val)))))

// Stream of mousewheel scroll events
const scroll$ = fromEvent('wheel', document)

// Stream of touchmove events, wheel event not available on touch devices

scroll$
  .map(event => event.deltaY)
  .scan((acc, val) => {
    const prev = Math.floor(acc.total / TWEEN_DISTANCE)
    const current = Math.floor((acc.total + val) / TWEEN_DISTANCE)
    if (current > prev) {
      acc.color1 = acc.color2
      acc.color2 = newColor()
    } else if (current < prev) {
      acc.color2 = acc.color1
      acc.color1 = newColor()
    }
    acc.total = acc.total + val
    return acc
  }, {
    color1: newColor(),
    color2: newColor(),
    total: 0
  })
  .observe(data => {
    // console.log('data', data)
    // val = val % TWEEN_DISTANCE
    const colorTop = arrToRgb(tweenColors(data.color1, data.color2, data.total % TWEEN_DISTANCE))
    styles.setProperty('--color-top', colorTop)

    // const colorBottom = arrToRgb(tweenColors(colors[2], colors[3], val))
    // styles.setProperty('--color-bottom', colorBottom)
  })
