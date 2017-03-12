import './styles.css'
import {fromEvent} from 'most'
import {compose, curry, map} from 'ramda'
import randomColor from 'randomcolor'

const styles = document.documentElement.style
const tweenDuration = 2000

const clamp = curry((min, max, n) => Math.min(Math.max(n, min), max))
const clampRgb = clamp(0, 255)

const lerp = (n, min, max) => (max - min) * n + min
const normalize = (n, min, max) => (n - min) / (max - min)
const rgbToArr = str => str.replace(/[^\d,]/g, '').split(',')
const arrToRgb = arr => `rgb(${arr[0]},${arr[1]},${arr[2]})`

// Uses randomColor library to create a new rgb color array
const newColor = compose(
  map(parseInt),
  rgbToArr,
  randomColor.bind(null, {format: 'rgb'})
)

// Calculates interpolated color from two rgb arrays
const tweenColor = (c1, c2, val) => c1.map((c, i) =>
  clampRgb(Math.round(lerp(normalize(val, 0, tweenDuration), c, c2[i]))))

// Stream of mousewheel scroll events
const scroll$ = fromEvent('wheel', document)

// Stream of touchmove events, wheel event not available on touch devices

scroll$
  .map(event => event.deltaY)
  .scan((acc, val) => {
    const prev = Math.floor(acc.total / tweenDuration)
    const current = Math.floor((acc.total + val) / tweenDuration)
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
    // val = val % tweenDuration
    const colorTop = arrToRgb(tweenColor(data.color1, data.color2, data.total % tweenDuration))
    styles.setProperty('--color-top', colorTop)

    // const colorBottom = arrToRgb(tweenColor(colors[2], colors[3], val))
    // styles.setProperty('--color-bottom', colorBottom)
  })
