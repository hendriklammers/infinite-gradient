import './styles.css'
import {fromEvent} from 'most'
import {compose} from 'ramda'
import randomColor from 'randomcolor'
import {
  arrayToRgb,
  lerp,
  normalize,
  rgbToArray
} from './utils'

const styles = document.documentElement.style
const TWEEN_DISTANCE = 2000

const normalizeTween = normalize(0, TWEEN_DISTANCE)

// Uses randomColor library to create a new rgb color array
const color = compose(rgbToArray, randomColor.bind(null, {format: 'rgb'}))

// Calculates interpolated color from two rgb arrays
const tweenColors = (c1, c2, val) => c1.map((c, i) =>
  compose(Math.round, lerp(c, c2[i]), normalizeTween)(val)
)

// Stream of mousewheel scroll events
const scroll$ = fromEvent('wheel', document)

// Start of with 4 random colors
const initialColors = {
  colorTop1: color(),
  colorTop2: color(),
  colorBottom1: color(),
  colorBottom2: color(),
  total: 0
}

// TODO: Stream of touchmove events, wheel event not available on touch devices

scroll$
  .map(event => event.deltaY)
  .scan((acc, val) => {
    const prev = Math.floor(acc.total / TWEEN_DISTANCE)
    // console.log('prev', prev)
    const current = Math.floor((acc.total + val) / TWEEN_DISTANCE)
    // console.log('current', current)
    if (acc.total >= 0) {
      if (current > prev) {
        acc.colorTop1 = acc.colorTop2
        acc.colorTop2 = acc.colorBottom2
        acc.colorBottom1 = acc.colorBottom2
        acc.colorBottom2 = color()
      } else if (current < prev && prev !== 0) {
        acc.colorBottom2 = acc.colorBottom1
        acc.colorBottom1 = acc.colorTop1
        acc.colorTop2 = acc.colorTop1
        acc.colorTop1 = color()
      }
    } else {
      if (current < prev) {
        acc.colorTop1 = acc.colorTop2
        acc.colorTop2 = acc.colorBottom2
        acc.colorBottom1 = acc.colorBottom2
        acc.colorBottom2 = color()
      } else if (current > prev && prev !== -1) {
        acc.colorBottom2 = acc.colorBottom1
        acc.colorBottom1 = acc.colorTop1
        acc.colorTop2 = acc.colorTop1
        acc.colorTop1 = color()
      }
    }
    acc.total = acc.total + val
    return acc
  }, initialColors)
  .observe(data => {
    // console.log('total', data.total)

    const amount = Math.abs(data.total % TWEEN_DISTANCE)
    // console.log('amount', amount)
    const colorTop = arrayToRgb(tweenColors(data.colorTop1, data.colorTop2, amount))

    // console.log('colorTop', colorTop)
    styles.setProperty('--color-top', colorTop)

    const colorBottom = arrayToRgb(tweenColors(data.colorBottom1, data.colorBottom2, amount))
    styles.setProperty('--color-bottom', colorBottom)
  })
