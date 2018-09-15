// function add(val: any) {
//   return (target: any) => {
//     // console.log(target)
//     // console.log(name)
//     target.cc = val
//   }
// }

// function ed(val: any) {
//   return (t: any, name: any) => {
//     console.log('执行了nam')
//     console.log(t[name])
//   }
// }

// @add('11')
// class Tes {
//   @ed('111')
//   nam (){
//     console.log('nam')
//   }
// }

// // console.log(new Tes().nam)
// console.log((Tes as any).cc)

var b = () => {
  console.log('b')
}
var a: any = () => {
  console.log('a')
}
a = [a]
a.splice(0, 0, b)


console.log(a)


