const add = (a: number, b: number): Promise<number> => {
  return new Promise((resolve, reject): void => {
    setTimeout(() => {
      if (a < 0 || b < 0) reject(new Error('Numbers must be > 0'))
      resolve(a + b)
    }, 2000)
  })
}

test('should add 2 numbers', async () => {
  const sum = await add(2, 3)
  expect(sum).toBe(5)
})
