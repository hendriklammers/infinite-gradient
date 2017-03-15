import {
  arrayToRgb,
  clamp,
  lerp,
  normalize,
  rgbToArray
} from './utils'

describe('arrayToRgb', () => {
  it('Converts array to rgb string', () => {
    expect(arrayToRgb([123, 200, 83])).toEqual('rgb(123,200,83)')
  })

  it('limits color values to range 0-255', () => {
    expect(arrayToRgb([-29, 284, 83])).toEqual('rgb(0,255,83)')
  })
})

describe('rgbToArray', () => {
  it('Converts rgb string to array', () => {
    expect(rgbToArray('rgb(123, 200, 83)')).toEqual([123, 200, 83])
  })
})

describe('clamp', () => {
  it('returns max when value is larger', () => {
    expect(clamp(15, 75, 96)).toEqual(75)
  })

  it('returns min when value is smaller', () => {
    expect(clamp(15, 75, 6)).toEqual(15)
  })

  it('returns value when it falls in range', () => {
    expect(clamp(15, 75, 48)).toEqual(48)
  })
})

describe('normalize', () => {
  it('scales number to 0-1 range', () => {
    expect(normalize(100, 200, 150)).toEqual(0.5)
  })
})

describe('lerp', () => {
  it('maps normalized value in min-max range', () => {
    expect(lerp(100, 200, 0.5)).toEqual(150)
  })
})
