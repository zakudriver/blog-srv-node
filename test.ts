// function methodDecoratorFunc(): MethodDecorator {
//   return (target, propertyKey, descriptor) => {
//     console.log(target);
//   };
// }

// function add() {
//   return (target: any) => {
//     // console.log(target)
//     // console.log(name)
//     target.cc = 111;
//   };
// }

// function ed() {
//   return (t: any, name: any) => {
//     console.log('执行了nam');
//     console.log(t[name]);
//   };
// }

// function ch(): MethodDecorator {
//   return (target, propertyKey, descriptor) => {
//     (target as any)[propertyKey] = 'yyy';
//   };
// }
// const aa: MethodDecorator = (target, propertyKey, descriptor) => {
//   console.log(target as any);
// };

// const bb: PropertyDecorator = (target, propertyKey) => {
//   console.log((target as any).prototype);
// };

// class Tes {
//   a: number;
//   constructor() {
//     this.a = 111;
//   }

//   @aa
//   nam() {
//     console.log('zzz');
//   }
// }

// console.log(new Tes().nam);

// console.log(new Tes().nam());

// // console.log(new Tes().nam)
// console.log((Tes as any).cc)

// var b = () => {
//   console.log('b')
// }
// var a: any = () => {
//   console.log('a')
// }
// a = [a]
// a.splice(0, 0, b)

// console.log(a)
// const dosm: any = {
//   get: (target: any, key: any) => {
//     console.log(target);
//     console.log(key);
//     return target[key];
//   },
//   set: (target: any, key: any, val: any) => {
//     console.log(target);
//     console.log(key);
//     console.log(val);
//     target[key] = val;
//     return true;
//   }
// };

// const t: any = new Proxy(
//   {
//     name: 'test',
//     aget: 222
//   },
//   dosm
// );

// console.log(t.name);
// console.log(t);

// class Watch {
//   target: any;
//   todo: any;
//   constructor(value: any) {
//     this.todo = {};
//     this.obj = {};
//     this.target = new Proxy(value, this.todo);
//   }

//   set(func: any) {
//     Object.assign(this.todo, {
//       set: () => {
//         func();
//         return true;
//       }
//     });
//   }
// }

// let t = { name: 'zzz' };
// const a = new Watch(t);
// // console.log(a);

// a.set(() => {
//   console.log('set');
// });

// a.target.name = '11';

// function unzip(): MethodDecorator {
//   return <T>(target, propertyKey, descriptor: TypedPropertyDescriptor<T>) => {
//     // descriptor.value = 222;
//     console.log(222)
//   };
// }

// const t: MethodDecorator = (target, propertyKey, descriptor) => {
//   const method = (descriptor as any).value;
//   (descriptor as any).value = (...args: any[]) => {
//     args[0] += 1;
//     return method.apply(target, args);
//   };
// };

// function tt(t: string): MethodDecorator {
//   return (target, propertyKey, descriptor) => {
//     const method = (descriptor as any).value;
//     (descriptor as any).value = (...args: any[]) => {
//       args[0] += t;
//       return method.apply(target, args);
//     };
//   };
// }

// class Name {
//   @tt('zz')
//   test(name: string) {
//     console.log(name);
//   }
// }

// new Name().test('222');

// console.log(Date.now)
// let num = 1;

// const a: any = new Proxy(
//   { a: 0 },
//   {
//     get: () => {
//       return num++;
//     }
//   }
// );

// const a:any = {
//   num: 0,
//   valueOf: function() {
//     return this.num += 1
//   }
// };

// console.log(a.a == 1 && a.a == 2 && a.a == 3);

// (a == 1 && a == 2 && a == 3)
import { performance } from 'perf_hooks';

// console.time('start');
const a = performance.now();

let arr = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
let obj = { a: 1, b: 2, c: 3 };

for (let i = 0; i < 10000000; i++) {
  // let test = { ...obj };
  let test = Object.assign(obj,{});
  // let test = arr.concat();
}

console.log(performance.now() - a);


