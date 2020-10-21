

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}



test('Fahrenheit to Celsius', () => {
    const c = fahrenheitToCelsius(32)
    expect(c).toBe(0)

})

test('Celsius to Fahrenheit', () => {

    const c = celsiusToFahrenheit(0)
    expect(c).toBe(32)

})

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })
