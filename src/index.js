import './styles.css'
import {fromEvent} from 'most'
import {compose, map} from 'ramda'
import randomColor from 'randomcolor'
import {
  arrayToRgb,
  clamp,
  lerp,
  normalize,
  rgbToArray
} from './utils'

const styles = document.documentElement.style
const TWEEN_DISTANCE = 2000

const clampRgb = clamp(0, 255)
const normalizeTween = normalize(0, TWEEN_DISTANCE)

// Uses randomColor library to create a new rgb color array
const newColor = compose(
  map(parseInt),
  rgbToArray,
  randomColor.bind(null, {format: 'rgb'})
)

// Calculates interpolated color from two rgb arrays
const tweenColors = (c1, c2, val) => c1.map((c, i) =>
  compose(clampRgb, Math.round, lerp(c, c2[i]), normalizeTween)(val)
)

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
    console.log('total', data.total)

    const amount = data.total % TWEEN_DISTANCE
    console.log('amount', amount)
    const colorTop = arrayToRgb(tweenColors(data.color1, data.color2, amount))

    console.log('colorTop', colorTop)
    styles.setProperty('--color-top', colorTop)

    // const colorBottom = arrToRgb(tweenColors(colors[2], colors[3], val))
    // styles.setProperty('--color-bottom', colorBottom)
  })
