import './styles.css'

let amountY = 0

document.addEventListener('wheel', event => {
  event.preventDefault()
  amountY += event.deltaY
  console.log('amountY', amountY)
})
