import './styles.css'
import {fromEvent} from 'most'

// const styles = document.documentElement.style
// const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'black']
// styles.setProperty('--color-top', 'blue')

// let amountY = 0
//
// const randomColor = () => '#' + ((1<<24) * Math.random() | 0).toString(16)
//
// const handleScroll = event => {
//   event.preventDefault()
//   amountY += event.deltaY
// }
//
// document.addEventListener('wheel', handleScroll)

const add = (a, b) => a + b
const scroll = fromEvent('wheel', document)

scroll.map(event => event.deltaY)
  .scan(add, 0)
  .observe(val => console.log(val))
