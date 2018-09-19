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
const aa: MethodDecorator = (target, propertyKey, descriptor) => {
  console.log(target);
};

class Tes {
  @aa
  nam() {
    console.log('zzz');
  }
}

console.log(new Tes().nam());

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
