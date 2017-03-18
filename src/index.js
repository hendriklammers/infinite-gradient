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

const tweenDistance = 3000
const styles = document.documentElement.style

// Partially applied normalize
const normalizeTween = normalize(0, tweenDistance)

// Uses randomColor library to create a new rgb color array
const newColor = compose(rgbToArray, randomColor.bind(null, {format: 'rgb'}))

// Calculates interpolated color from two rgb arrays
const tweenColors = (c1, c2, val) => c1.map((c, i) =>
  compose(Math.round, lerp(c, c2[i]), normalizeTween)(val)
)
const tweenToRgb = compose(arrayToRgb, tweenColors)

// Stream of mousewheel scroll events
const scroll$ = fromEvent('wheel', document)

// Start of with 4 random colors
const initialColors = {
  colorTop1: newColor(),
  colorTop2: newColor(),
  colorBottom1: newColor(),
  colorBottom2: newColor(),
  total: 0,
  amount: 0
}

// Sets new colors on accumulator when going forward
const forward = acc => {
  acc.colorTop1 = acc.colorTop2
  acc.colorTop2 = acc.colorBottom2
  acc.colorBottom1 = acc.colorBottom2
  acc.colorBottom2 = newColor()
  return acc
}

// Sets new colors on accumulator when going backward
const backward = acc => {
  acc.colorBottom2 = acc.colorBottom1
  acc.colorBottom1 = acc.colorTop1
  acc.colorTop2 = acc.colorTop1
  acc.colorTop1 = newColor()
  return acc
}

scroll$
  .map(event => event.deltaY)
  .scan((acc, val) => {
    // TODO: Solve this in a more functional way
    const prev = Math.floor(acc.total / tweenDistance)
    const current = Math.floor((acc.total + val) / tweenDistance)
    const up = current > prev
    const down = current < prev
    const negative = acc.total < 0

    if (!negative && up) {
      acc = forward(acc)
    } else if (!negative && down && prev !== 0) {
      acc = backward(acc)
    } else if (negative && down) {
      acc = forward(acc)
    } else if (negative && up && prev !== -1) {
      acc = backward(acc)
    }

    acc.total = acc.total + val
    acc.amount = Math.abs(acc.total % tweenDistance)
    return acc
  }, initialColors)
  .map(data => ({
    top: tweenToRgb(data.colorTop1, data.colorTop2, data.amount),
    bottom: tweenToRgb(data.colorBottom1, data.colorBottom2, data.amount)
  }))
  .observe(({top, bottom}) => {
    // Set colors on the CSS variables
    styles.setProperty('--color-top', top)
    styles.setProperty('--color-bottom', bottom)
  })
