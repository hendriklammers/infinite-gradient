import './styles.css'
import {fromEvent} from 'most'
import randomColor from 'randomcolor'

const styles = document.documentElement.style
const add = (a, b) => a + b
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
const lerp = (n, min, max) => (max - min) * n + min
const normalize = (n, min, max) => (n - min) / (max - min)
const rgbToArr = str => str.replace(/[^\d,]/g, '').split(',').map(n => parseInt(n))
const colors = randomColor({format: 'rgb', count: 3}).map(rgbToArr)
const arrToRgb = arr => `rgb(${arr[0]},${arr[1]},${arr[2]})`
const scroll$ = fromEvent('wheel', document)

styles.setProperty('--color-top', arrToRgb(colors[1]))

scroll$.map(event => event.deltaY)
  .scan(add, 0)
  .observe(val => {
    const color = colors[1].map((c, i) => {
      return clamp(Math.round(lerp(normalize(val, 0, 1000), c, colors[2][i])), 0, 255)
    })
    console.log('color', arrToRgb(color))
    styles.setProperty('--color-top', arrToRgb(color))

  })
