import './styles.css'
import {fromEvent} from 'most'
import randomColor from 'randomcolor'

const styles = document.documentElement.style
const add = (a, b) => a + b
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
const lerp = (n, min, max) => (max - min) * n + min
const normalize = (n, min, max) => (n - min) / (max - min)
const rgbToArr = str =>
  str.replace(/[^\d,]/g, '').split(',').map(n => parseInt(n))
const colors = randomColor({format: 'rgb', count: 3}).map(rgbToArr)
const arrToRgb = arr => `rgb(${arr[0]},${arr[1]},${arr[2]})`
const scroll$ = fromEvent('wheel', document)
const tweenColor = (c1, c2, val) => c1.map((c, i) =>
  clamp(Math.round(lerp(normalize(val, 0, 1000), c, c2[i])), 0, 255))

styles.setProperty('--color-top', arrToRgb(colors[1]))

scroll$.map(event => event.deltaY)
  .scan(add, 0)
  .observe(val => {
    val = val % 1000
    const color = arrToRgb(tweenColor(colors[1], colors[2], val))
    console.log('color', color)
    styles.setProperty('--color-top', color)

  })
