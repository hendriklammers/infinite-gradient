import {rgbToArray} from './utils'

test('Turns rgb(123, 200, 83) into [123, 200, 83]', () => {
  expect(rgbToArray('rgb(123, 200, 83)')).toBe([123, 200, 83])
})
