// function test() {
//   return new Promise((res) => {
//     setTimeout(() => {
//       res(1)
//     }, 3000)
//   })
// }

// async function exec() {
//   const res = await test()
//   console.log(res)
// }

// exec()

const a = [5, [[4, 3], 2, 1]]

function calc(arr = []) {
  return arr.reduce((a, b) => {
    if (Array.isArray(a)) {
      a = calc(a)
    }
    if (Array.isArray(b)) {
      b = calc(b)
    }
    return a - b
  })
}

console.log(calc(a))
