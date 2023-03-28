# ts入门

## 安装和使用
``` bash
# 全局安装ts
pnpm add typescript -g

# 全局安装ts-node，可以在node环境下直接执行ts文件，不用先转换为js，然后再执行js
pnpm add ts-node -g

# 生成tsconfig.json
tsc --init
```
``` ts
// index.ts
const a: string = 'zs'
console.log(a)

// 转为js文件
tsc index.ts   // 出现一个index.js
node index.js   // 打印出zs

// 使用ts-node
ts-node index.ts    // 打印出zs
```
> `tsc -w index.ts`可以检测index.ts的变化，自动编译 

## 基础
js数据类型分为**原始数据类型**和**对象类型**
原始数据类型：`boolean` `string` `number` `null` `undefined` `symbol(ES6)` `bigInt(ES10)`

- boolan
``` ts
const a: boolean = true
```

- number
``` ts
const decLiteral: number = 6
// 十六进制
const hexLiteral: number = 0xf00d
// 二进制
const binaryLiteral: number = 0b1010
// 八进制
let octalLiteral: number = 0o744;
```

- string
``` ts
const s: string = 'bob'
```

- symbol
``` ts
const sym: symbol = Symbol()
```

- null、undefined
    - `null`：空对象，尚未创建对象
    - `undefined`：未定义值，尚未被赋值
    - 默认情况下`null`和`undefined`是所有类型的子类型
    - 当指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给它们各自，`undefined`还能赋值给`void`
    - 默认开启`--strict`，其包含以下检查项
        * `--alwaysStrict`
        * `--noImplicitAny`
        * `--noImplicitThis`
        * `--strictNullChecks`
        * `--strictPropertyInitialization`
        * `--strictFunctionTypes`
        * `--strictBindCallApply`
``` ts
let a 
console.log(a) // undefined

console.log(typeof null)        // object
console.log(typeof undefined)   // undefined

console.log(Number(null))       // 0
console.log(Number(undefined))  // NaN

// tsc --strict
let isUndefined: undefined = undefined
let isNull: null = null
```

- void
    - 无类型，通常用来表示函数没有返回值
    - 声明一个`void`类型的变量没有什么大用，因为只能为它赋予`undefined`和`null`（`--strict`模式下，只能赋予`undefined`

- object
`object`表示非原始类型，也就是除`number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型
``` ts
let obj: object
obj = { prop: 0 } // OK
obj = 1234        // Error
obj = 'string'    // Error
obj = true        // Error
obj = sym1        // Error
obj = null        // Error
obj = undefined   // Error
obj = isVoid      // Error
obj = isNever     // OK
obj = () => 1     // OK
obj = [1, 2]      // OK
```

### 数组
``` ts
const arr1: number[] = [11, 22]
// 泛型
const arr2: Array<string> = ['11', '22'] 
```

### tulp元祖
``` ts
const tup: [number, string, boolean] = [11, 'url', true]
typeof tup[0]   // number
tup[3]          // Error:访问越界 undefined
```

### enum枚举
通过枚举的属性来访问枚举成员，通过枚举的名字来访问枚举类型
- 数字枚举
``` ts
enum Color {
    Red,
    Green = 10,
    Blue
}
let colorValue: Color = Color['Blue']       // 11
let colorName: string = Color[colorValue]   // Blue
console.log(Color)                        
// {0: "Red", 10: "Green", 11: "Blue", Red: 0, Green: 10, Blue: 11}

// 编译后
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 10] = "Green";
    Color[Color["Blue"] = 11] = "Blue";
})(Color || (Color = {}));
var colorValue = Color['Blue'];
var colorName = Color[colorValue];
```

- 字符串枚举
> 字符串枚举成员不能value访问枚举的key
``` ts
enum Direction {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right'
}
// {Up: "up", Down: "down", Left: "left", Right: "right"}
console.log(Direction)  

// 编译后
var Direction;
(function (Direction) {
    Direction["Up"] = "up";
    Direction["Down"] = "down";
    Direction["Left"] = "left";
    Direction["Right"] = "right";
})(Direction || (Direction = {}));
```

- 联合枚举
当所有成员都拥有字面量枚举值时，它就拥有一种特殊的语义
``` ts
enum ShapeKind {
  Circle,
  Square = 3,
  Triangle = -1,
  Arrow = 'ARROW'
}
// {0: "Circle", 3: "Square", Circle: 0, Square: 3, Triangle: -1, -1: "Triangle", Arrow: "ARROW"}
console.log(ShapeKind)  

interface Circle {
    kind: ShapeKind.Circle // 类型为0
    radius: number
}
const temp: Circle = {
    kind: 30,   // Error
    radius: 40
}
```

- const枚举
使用常量枚举表达式（不能包含计算成员），并且在编译阶段会被删除
``` ts
const enum Direction {
    Up = 1,
    // 1转为二进制还是1 1左移得到的二进制位100 转为十进制就是4
    Down = Up << 2,
    // 1转为二进制是1， 4转为二进制位100 通过位运算符得到的二进制位101 转为十进制就是5
    Left = Up | Down, 
    Right
}
const directions: any[] = [Direction.Up, Direction.Down, Direction.Left, Direction.Right]

// 编译后
const directions = [1 /* Direction.Up */, 4 /* Direction.Down */, 5 /* Direction.Left */, 6 /* Direction.Right */]
```

- 外部枚举
    - 外部枚举用来描述已经存在的枚举类型的形状
    - 非常量的外部枚举，枚举成员会被当做需要经过计算的
``` ts
declare enum Direction {
    Up = 1,
    Down = 3,
    Left,
    Right
}
let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right]

// 编译结果
var directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
```

### function函数
- 函数类型
``` ts
function add (x: number, y: number): number {
    return x + y
}

// 完整函数类型写法（参数类型匹配即可，而不在乎参数名）
const myAdd: (first: number, second: number) => number = (x: number, y: number) => x + y

// 简写（使用到类型推断）
const newAdd = (x: number, y: number): number => x + y
```

- 可选参数和默认参数
    - 可选参数必须放在必选参数后面
    - 带有默认值的参数可以放在必选参数前面，但是必须明确的传入`undefined`来获取默认值
    - 带默认值的参数是可选的，与可选参数一样，在调用时可以省略
``` ts
const buildName1: (firstName: string, lastName?: string) => string = 
    (x: string, y?: string): string => `${x} ${y}`

const buildName2: (firstName: string, lastName?: string) => void = 
    (x: string, y = 'smith') => { console.info(`${x} ${y}`) }

const buildName3 = (firstName: string = 'will', lastName: string): void => { console.info(`${firstName} ${lastName}`) } 

buildName1('will', 'smith')     // will smith
buildName1('will')              // will undefined
buildName2('will', 'bob')       // will bob
buildName2('will')              // will smith  
buildName3('bob', 'alen')       // bob alen
buildName3(undefined, 'alex')   // will alex    
```

- 剩余参数
剩余参数会被当做个数不限的可选参数
``` ts
const buildName = (first: string, ...rest: string[]): string => 
    first + ' ' + rest.join(' ')

buildName('will', 'smith', 'test')
```

### this参数
- 指定函数中`this`类型
- 为函数提供一个显式的`this`参数。`this`参数是伪参数，它出现在参数列表的最前面

```typescript
interface Deck {
    suits: string[]
    createPicker(this: Deck): () => void
}
let deck: Deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    createPicker(this: Deck) {
        return () => {
            console.log(this.suits)
        }
    }
}
```

### 函数重载
- 函数名相同，参数和返回值的类型不同
- 一定要把最精确的函数放在最前面
``` ts
function reverse(x: number): number // 重载列表项1
function reverse(x: string): string // 重载列表项2
function reverse(x: number | string): number | string | undefined { // 重载实现
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''))
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('')
    }
}

console.log(reverse(1234))      // 4321
console.log(reverse('abcd'))    // dcba
```

## 类
封装（`private`, `protected`, `public`）、继承
`extends`、多态`new`

### 继承extends
``` ts
class Person {
    run (): void {
        console.log('人在跑步')
    }
    read (): void {
        console.log('人在阅读')
    }
}

class Programmer extends Person {
    // 实例化的时候，会调用构造函数
    constructor () {
        super()
    }
    work (): void {
        console.log('程序员在敲代码')
    }
    // 多态 继承于父类，并重写了父类的实例方法
    run (): void {
        console.log('程序员跑步的时候都想着敲代码')
    }
}

const per = new Programmer()
per.work()
per.run()
per.read()
```

### 修饰符
- `public`, `protected`, `private`
- `static`使用`类名.`代替`this.`访问静态属性
- `readonly`只读属性必须的在声明时或构造函数里初始化
``` ts
class Person {
    static sex: string = 'male'
    static get (): void {
        console.log(Person.sex)
    }
    public name: string;
    protected age: number;
    constructor (name: string , age: number) {
        this.name = name
        this.age = age
    }
    public set (name: string): void {
        this.setName(name)
        console.log(this.name)
    }
    private setName (name: string): void {
        this.name = name
    }
}
const per = new Person('张三', 20)
per.set('李四')
```
``` ts
class Animal {
    // 静态属性和方法
    static num: number = 100
    static isAnimal(a: any): boolean {
        return a instanceof Animal
    }
    // 参数属性：构造函数参数添加访问限制符
    constructor(protected name: string) { }
    print() {
        console.log(`print: ${this.nickName}`)
    }
    // 存取器es5以上才支持 tsc --target es5
    get nickName(): string {
        return `Little ${this.name}`
    }
    set nickName(value: string) {
        this.name = value
    }
}

class Snake extends Animal {
    constructor(name: string, private _age: number = 1) {
        // 子类构造函数必须调用 super() ，且在访问 this 属性之前
        super(name)
        this.name = `Snake - ${name} - ${this._age}`
    }
}

class Horse extends Animal {
    private _age: number = 2
    readonly legs: number = 4
    // 子类可以重写父类的方法
    print() {
        console.log(`print: Horse - ${this.name} - ${this._age} - ${this.legs}`)
        super.print()
    }
}

const sam: Animal = new Snake('sam', 3)
const tom = new Horse('tom')
sam.print()                         // print: Little Snake - sam - 3
tom.print()                         // print: Horse - tom - 2 - 4 \n print: Little tom
sam.nickName = 'xyz'
sam.print()                         // print: Little xyz
console.log(Animal.num)             // 100
console.log(Animal.isAnimal(sam))   // true
```

### 单例模式
``` ts
class Singleton {
    private static _instance: Singleton
    private constructor() {}
    static getInstance(): Singleton {
        if (!Singleton._instance) {
            Singleton._instance = new Singleton()
        }
        return Singleton._instance
    }
}
const sgn = Singleton.getInstance()
```
``` ts
class Singleton {
    static readonly instance: Singleton = new Singleton()
    private constructor() {}
}
const sgn = Singleton.instance
```

### 抽象类
- 抽象类不能被实例化
- 抽象方法只能出现在抽象类中
- 抽象方法必须在派生类中实现
- 抽象类可以包含方法实现
``` ts
abstract class Animal {
    abstract eat (food: string): void;
    print (): void {
        console.log('抽象类的打印')
    }
}

interface config {
    name: string;
    body?: string;
    run (): string;
}

class Dog extends Animal implements config {
    public name: string;
    static body: string = '身体很强壮';
    constructor (name: string) {
        super()
        this.name = name
    }
    // 实现抽象方法
    eat (food: string) {
        console.log(`${this.name}吃${food}`)
    }

    run () {
        return `${this.name}`
    } 
}
const dog = new Dog('小狗')
dog.print()
```

### 构造函数
- 类具有 **实例部分** 与 **静态部分** 这两个部分
    * 静态部分包括类的静态属性和构造函数
``` ts
class Greeter {
    static standardGreeting: string = 'Hello, there!'
    greeting: string = ''
    greet() {
        if (this.greeting) {
            console.log(`Hello, ${this.greeting}`)
        } else {
            console.log(Greeter.standardGreeting)
        }
    }
}
// 1) 声明 Greeter 类的实例的类型是 Greeter
// 2) 创建了一个叫做构造函数的值（包含了类的所有静态属性）
// 创建类的实例，调用构造函数
const greeter1: Greeter = new Greeter()
greeter1.greet()    // Hello, there!

// typeof Greeter ==> 取 Greeter 类的类型（而不是实例的类型） | Greeter 标识符的类型 | 构造函数的类型
let greeterMaker: typeof Greeter = Greeter

// 这个类型包含了类的所有静态成员和构造函数
greeterMaker.standardGreeting = 'Hey there!'
const greeter2: Greeter = new greeterMaker()
greeter2.greet()    // Hey there!

console.log(greeterMaker === Greeter)   //true
```

### 类当接口
``` ts
class Point {
    x: number | undefined;
    y: number | undefined;
}
interface Point3d extends Point {
    z: number
}
let point3d: Point3d = { x: 1, y: 2, z: 3 }
```

### 混入类implements
``` ts
// Disposable Mixin
class Disposable {
    isDisposed: boolean = false
    dispose() {
        this.isDisposed = true
    }
}

// Activatable Mixin
class Activatable {
    isActive: boolean = false
    activate() {
        this.isActive = true
    }
    deactivate() {
        this.isActive = false
    }
}

// 混入（把类当成接口使用，仅使用其类型而非实现）
class SmartObject implements Disposable, Activatable {
    constructor() {
        setInterval(() => 
            console.log(`${this.isActive} : ${this.isDisposed}`), 5e2
        )
    }
    interact() {
        this.activate()
    }
    // 以下为占位属性
    // Disposable
    isDisposed: boolean = false
    dispose!: () => void
    // Activatable
    isActive: boolean = false
    activate!: () => void
    deactivate!: () => void
}

// 帮助函数
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            // 遍历 mixins 上的所有属性，并复制到目标上去。把占位属性替换成真正的实现代码
            derivedCtor.prototype[name] = baseCtor.prototype[name]
        })
    })
}
applyMixins(SmartObject, [Disposable, Activatable])
const smartObj = new SmartObject()
setTimeout(() => smartObj.interact(), 1e3) // >>> false: false >>> true: false >>> ...
```

### 类类型兼容
``` ts
class Animal {
    constructor(public name: string) { }
}

class Rhino extends Animal {
    constructor() { super('Rhino') }
}

class Employee {
    constructor(public name: string) { }
}

let animal = new Animal('Goat');
let rhino = new Rhino();
let employee = new Employee('Bob');
animal = rhino   // OK
// TypeScript使用的是结构性类型系统。
// 当比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的
animal = employee  // OK
```
``` ts
class Animal {
    constructor(private name: string) { }
}

class Rhino extends Animal {
    constructor() { super('Rhino') }
}

class Employee {
    constructor(private name: string) { }
}

let animal = new Animal('Goat');
let rhino = new Rhino();
let employee = new Employee('Bob');
animal = rhino
// 然而，当比较带有 private 或 protected 成员的类型的时候，情况就不同了。
// 如果其中一个类型里包含一个 private 或 protected 成员，那么只有当另外一个类型中也存在这样一个private 成员，
// 并且它们都是来自同一处声明时，才认为这两个类型是兼容的。
// error: 不能将类型“Employee”分配给类型“Animal”。类型具有私有属性“name”的单独声明
animal = employee // error
```

## 接口
- 关注数据的结构（值的外形）
- 方便数据结构的类型检查
- 为类型命名和为代码定义契约

### 变量声明
- 可选属性 `?`
- 只读属性 `readonly`
- 额外的属性检查
    * 将对象字面量赋值给变量或作为参数传递的时候，会经过*额外的属性检查*
    * 如果一个对象字面量存在任何“目标类型”不包含的属性时，都会得到一个错误
    * 绕开检查的方法：
        + 类型断言
        + 字符串索引签名
        + 将这个对象赋值给另一个变量

### 字面量接口
``` ts
interface Person {
  name: string
  age?: number          // 可选属性
  readonly id: number   // 只读属性，对象创建的时候赋值
}

function fn(p: Person) {
    console.log(p.name)
}

const tom: Person = { name: 'Tom', id: 1 }
// 对象字面量赋值给一个变量，不会经过额外的属性检查
let will = { name: 'Will', id: 2, sex: 'male' }
fn(tom)
fn(will)

// 对象字面量会被特殊对待且会经过额外的属性检查，使用类型断言绕开这些检查（或者在接口中添加字符串索引签名）
fn({ name: 'Jack', id: 3, sex: 'male' } as Person)
```

### 函数类型接口
``` ts
interface SearchFunc {
    (source: string, subString: string): boolean
}
let mySearch: SearchFunc
// 函数类型的类型检查，函数的参数名不需要与接口里定义的名字相匹配
mySearch = (src: string, sub: string): boolean => {
    return src.search(sub) !== -1
}
console.log(mySearch('xyz', 'y'))
```

### 可索引接口
- 支持两种索引签名，字符串和数字
- 可以同时使用这两种类型的索引，但是数字索引的返回值必须是字符串索引返回值的子类型
- 当使用number去索引时，js会将其转换为string然后再去索引其返回值，也就是说用100(number) 去索引等同于使用'100'(string)去索引，number索引的返回值必须是string类型的子类型
``` ts
interface ArrayIndex {
    [index: number]: string
}
const arr = ['11', '22']

class Animal { }
class Dog extends Animal { }
interface AnimalDictionary {
    a: Animal
    d?: Dog // 一旦定义了可索引类型，那么确定属性和可选属性的类型都必须是其返回值类型的子类型
    readonly [x: string]: Animal | undefined // 将索引签名设置为只读，防止给索引赋值
}
```

### 类实现接口
``` ts
interface ClockInterface {
    currentTime: Date
    setTime (d: Date): void
}
class Clock implements ClockInterface {
    currentTime: Date = new Date()
    setTime (d: Date): void {
        this.currentTime = d
    }
}
const c: Clock = new Clock()
// 2019/12/18 下午11:07:16
console.log(c.currentTime.toLocaleString())
setTimeout(() => {
    c.setTime(new Date())
    // 2019/12/18 下午11:07:17
    console.log(c.currentTime.toLocaleString())
}, 1e3)
```

### 检查类的构造函数
- 当一个类实现一个接口时，只对其实例部分进行类型检查
- 构造函数属于类的静态部分，不在检查的范围之内
- 使用函数工厂操作类的静态部分
``` ts
interface ClockInterface {
    tick () : void
}

interface ClockConstructor {
    new(h: number, m: number): ClockInterface 
}

class DigitalClock implements ClockInterface {
    constructor (h: number, m: number) {}
    tick (): void {
        console.log('beep beep')
    }
}

class AnalogClock implements ClockInterface {
    constructor (h: number, m: number) {}
    tick () : void {
        console.log('analog analog')
    }
}

const creatFun = (ctor:  ClockConstructor, h: number, m: number ): ClockInterface => new ctor(h, m) 
const digital = creatFun(DigitalClock, 12, 17)
const analog = creatFun(AnalogClock, 13, 14)
digital.tick()  // beep beep
analog.tick()   // analog analog
```

### 接口继承类
- 当接口继承了一个类类型时，它会继承类的成员但不包括其实现
- 当一个接口继承了拥有私有或受保护的成员的类，这个接口类型只能被这个类或子类实现
``` ts
class Control {
    private state: any
}
interface SelectableControl extends Control {
    select(): void
}
class Button extends Control implements SelectableControl {
    select() { }
}
class TextBox extends Control {
    select() { }
}
// error: 类“Images”错误实现接口“SelectableControl”。类型具有私有属性“state”的单独声明
class Images implements SelectableControl {
    private state: any
    select() { }
}
// 只有 Control 的子类才拥有一个声明于 Control 的私有成员 state ，这对私有成员的兼容性是必需的
// 实际上， SelectableControl 接口和拥有 select 方法的 Control 类是一样的（相当于混入带私有或受保护成员的类）
```

### 接口继承接口
``` ts
interface Shape {
    color: string
}
interface PenStroke {
    penWidth: number
}
interface Square extends Shape, PenStroke {
    sideLength: number
}
// const square: Square = {
//     color: 'blue',
//     sideLength: 10,
//     penWidth: 5
// }
let square = <Square>{} // {} as Square
square.color = 'blue'
square.sideLength = 10
square.penWidth = 5
// { color: 'blue', sideLength: 10, penWidth: 5 }
console.log(square)
```

### 混合类型
``` ts
interface Counter {
    (start: number): string
    interval: number
    reset(): void
}
function getCounter(): Counter {
    let counter = <Counter>function (start: number) {
        console.log(start)
    }
    counter.interval = 123
    counter.reset = function () {
        console.log('reset')
    }
    return counter
}
let c = getCounter()
c(10)
c.reset()
c.interval = 5
```

## 泛型`<T>`
- 类型变量（只用于表示类型而不是值）
- 可以把泛型变量看作任意或所有类型来使用

### 泛型变量
``` ts
function identity<T> (arg: T): T {
    return arg
}
const add = <T>(arg: T): T => arg
// 明确传入类型
const output = identity<string>('张三')
// 利用类型推论简写
const output2 = identity('李四')
const output3 = add<number>(33)
const output4 = add('44')
console.log(output, output2, output3, output4)
```

### 泛型类型

```typescript
function identity<T>(arg: T): T {
    return arg
}
// 泛型参数在数量上和使用方式上能对应即可（比函数声明的前面多一个类型参数）
let myIdentity1: <U>(arg: U) => U = identity
// 还可以使用带有调用签名的对象字面量来定义
let myIdentity2: { <U>(arg: U): U } = identity
console.log(myIdentity1<string>('myString')) // >>> myString
console.log(myIdentity2<string>('myString')) // >>> myString
```

### 泛型接口
```ts
interface GenericIdentityFn {
    <T>(arg: T): T
}
function identity<T>(arg: T): T {
    return arg
}
let myIdentity: GenericIdentityFn = identity
myIdentity<string>('myString')
```
```ts
interface GenericIdentityFn<T> {
    (arg: T): T
}
function identity<T>(arg: T): T {
    return arg
}
let myIdentity: GenericIdentityFn<string> = identity
myIdentity('myString')
```

### 泛型类
- 泛型类是实例部分的类型，所以类的静态属性不能使用泛型类型
``` ts
class GenericNumber<T> {
    zeroVal!: T
    add!: (x: T, y: T) => T
}
const myNumber = new GenericNumber<number>()
myNumber.zeroVal = 0
myNumber.add(myNumber.zeroVal, 1)
```

### 泛型约束
- 定义一个接口来约束泛型
``` ts
interface LengthSize {
    length: number
}
const loggingIdentity = <T extends LengthSize>(arg: T): T => arg
function loggingIdentity1<T extends LengthSize> (arg: T): T {
    return arg
}
const val = {value: 'test', length: 10}
console.log( loggingIdentity(val as LengthSize) )
console.log(loggingIdentity({ value: 'test11', length: 2}))
```

- 在泛型中使用类类型
``` ts
class Animal {
    print() { 
        console.log('打印')
    }
}
// 使用泛型创建工厂函数时，需要引用构造函数的类类型
function create<T>(c: { new(): T }): T {
    return new c()
}
create(Animal).print()
```
``` ts
class BeeKeeper {
    hasMask: boolean = true
}
class ZooKeeper {
    nametag: string = 'xxx'
}
class Animal {
    numLegs: number = 4
}
class Bee extends Animal {
    keeper: BeeKeeper = new BeeKeeper()
}
class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper()
}
// 使用原型属性推断并约束构造函数与类实例的关系
function createInstance<T extends Animal>(c: new () => T): T {
    return new c()
}
console.log( createInstance(Lion).keeper.nametag )
console.log( createInstance(Bee).keeper.hasMask )
```

## 类型兼容性
### 比较对象
``` ts
interface Named {
    name: string
}
class Person {
    name: string = 'xx'
}

let p: Named
p = new Person()
console.log(p) // Person { name: 'xx' }

let x: Named
let y = { name: 'Alice', location: 'Seattle' }
x = y
console.log(x) // { name: 'Alice', location: 'Seattle' }

// 如果x要兼容y，那么y至少具有与x相同的属性（结构上：y>=x）
function greet(x: Named) {
    console.log(x)
}
greet(y)       // { name: 'Alice', location: 'Seattle' }
```

### 比较函数
- 比较参数
> x的每个参数必须在y中找到对应类型的参数，x才能赋值给y
``` ts
let x = (a: number) => 0
let y = (b: number, s: string) => 0
y = x   // ok
x = y   // error
```

- 比较返回值
> y的返回值至少具有与x相同的属性，y才能赋值给x
``` ts
let x = () => ({name: 'Alice'})
let y = () => ({name: 'Alice', age: 20})
x = y   // ok 
y = x   // error
```

### 函数参数双向协变
当比较函数参数类型时，只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功能够实现很多JavaScript里的常见模式
``` ts
enum EventType {
    Mouse,
    Keyboard
}
interface Event {
    timestamp: number
}
interface MoseEvent extends Event {
    x: number
    y: number
}
interface KeyEvent extends Event {
    keyCode: number
}
function listenEvent(eventType: EventType, handler: (e: Event) => void) {
}
// listenEvent(EventType.Mouse, (e: MoseEvent) => console.log(e.x + ', ' + e.y)) error
listenEvent(EventType.Mouse, 
    (e: Event) => console.log((<MoseEvent>e).x + ', ' + (<MoseEvent>e).y)
)
listenEvent(EventType.Mouse, 
    <(e: Event) => void> (
        (e: MoseEvent) => console.log(e.x + ', ' + e.y)
    )
)
```

### 可选参数和剩余参数
``` ts
let x1 = (a: number) => 0
let y1 = (a: number, s?: string) => 0
x1 = y1

let x2 = (a: number, s?: string) => 0
let y2 = (a: number) => 0
x2 = y2

function invokeLater(args: any[], callback: (...args: any[]) => void) {
    callback.apply(null, [...args])
}
invokeLater([1, 2], (x, y) => console.log(x + ', ' + y))
invokeLater([1, 2, 3], (x?, y?, z?) => console.log(x + ', ' + y + ',' + z))
```

### 枚举比较
枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的。
``` ts
enum Color {
    Red,
    Green
}
enum BgColor {
    Red
}
let c = Color.Red
c = Color.Green // 1
c = BgColor.Red // error 不能将类型BgColor分配给类型Color
```

### 类比较
比较两个类类型时，只有实例的成员会被比较，静态成员和构造函数不在比较范围内
``` ts
class Animal {
    feet: number
    constructor(name: string, numFeet: number) { }
}
class Size {
    feet: number
    constructor(numFeet: number) { }
}
let a: Animal
let s: Size
a = s // ok
s = a // ok
```

- 类的私有成员和受保护成员会影响兼容性
- 当检查类实例的兼容性时，如果目标类型包含一个私有成员（受保护成员），那么源类型必须包含来自同一个类的这个私有成员（受保护成员）
- 这允许子类赋值给父类，但是不能赋值给其他有同样拥有私有成员（受保护成员）的类
``` ts
class Animal {
    private feet!: number
    numFeet: string | undefined
}
class Dog extends Animal {
}
class Size {
    private feet!: number
    numFeet!: string
}
let a: Animal = new Animal()
let d: Dog = new Dog()
let s: Size
a = d   // ok
d = a   // ok
s = d   //error 不能将类型'Dog'分配给类型'Size'。类型具有私有属性“feet”的单独声明
```

### 泛型比较
``` ts
interface Empty<T> {}
let x1: Empty<string> = 'test'
let y1: Empty<number> = 2
x1 = y1 // ok
y1 = x1 // ok

interface NotEmpty<T> {
    data: T
}
let x2: NotEmpty<string> = { data: 'test' }
let y2: NotEmpty<number> = { data: 2 }
// 不能将类型'NotEmpty<string>'分配给类型'NotEmpty<number>'。不能将类型'string'分配给类型'number'
y2 = x2 // error
x2 = y2 // error


let identity = <T>(x: T): T => x
let reverse = <U>(y: U): U => y
identity = reverse  // ok
reverse = identity  // ok
```

## 高级类型
### 交叉类型A & B
``` ts
const extend = <T, U>(first: T, second: U): T & U => {
    let result = <T & U>{}
    for(let key in first) {
        (result as any)[key] = (first as any)[key]
    }
    for(let key in second) {
        // if (!result.hasOwnProperty(key)) {
            (<any>result)[key] = (<any>second)[key]
        // }
    }
    return result
}

class Person {
    constructor(public name: string){}
}

interface Loggable {
    log(): void
}

class ConsoleLogger implements Loggable {
    log () {
        console.log('ConsoleLogger')
    }
}
const jim = extend(new Person('Jim'), new ConsoleLogger())
console.log(jim) // {log: () => {}, name: 'Jim'}
```

### 联合类型A | B
``` ts
const padLeft = (val: string, padding: string | number) => {
    if (typeof padding === 'number') {
        return Array(padding + 1).join(' ') + val
    }
    if (typeof padding === 'string') {
        return padding + val
    }
    throw new Error(`Expected string or number, got ${padding}.`)
}
console.log(padLeft('abc', 4).length) // 7 ‘     abc’
console.log(padLeft('abc', 'xxxx'))   // xxxxabc
// Error: Expected string or number, got undefined
console.log(padLeft('abc', undefined))
```

- 如果一个值是联合类型，我们只能访问联合类型共有的成员
``` ts
interface Bird {
    fly():void
    layEggs(): void
}

interface Fish {
    swim(): boolean
    layEggs(): void
}

const getSmallPet = (): Fish | Bird => {
    return {
        fly(): void {
            console.log('fly')
        },
        layEggs():void {
            console.log('layEggs')
        }
    }
}

const pet = getSmallPet()
console.log(pet)    // {fly: () => {}, layEggs: () => {}}
// 类型断言
if ((<Fish>pet).swim) {
    (<Fish>pet).swim()
} else {
    (pet as Bird).fly() // fly
}
```

### 类型别名 type

- 不会新建一个类型 - 创建了一个新名字来引用那个类型
- 不能`extends`和`implements`
- 应该尽量去使用接口代替类型别名

``` ts
type Name = string
type NameResolver = () => string
type NameOfResolver = Name | NameResolver
function getName(n: NameOfResolver): Name {
    if (typeof n === 'string') {
        return n
    } else {
        return n()
    }
}

// 泛型
type Container<T> = { value: T }
type Tree<T> = {
    value: T
    left: Tree<T>
    right: Tree<T>
}

// 交叉类型
type LinkedList<T> = T & { next: LinkedList<T> }
interface Person { name: string }
let p1 = {} as LinkedList<Person>
let p2 = {} as LinkedList<Person>
p1.name = 'p1'
p2.name = 'p2'
p1.next = p2
console.log(p1.name, p1.next.name) // >>> p1 p2
```

### 字符串字面量类型

``` ts
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out'
class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
        if (easing === 'ease-in') {
        } else if (easing === 'ease-out') {
        } else if (easing === 'ease-in-out') {
        } else {
        }
    }
}
let button = new UIElement()
button.animate(0, 0, 'ease-in')
```
``` ts
// 用于区分函数重载
function createElement(tagName: 'img'): HTMLImageElement
function createElement(tagName: 'input'): HTMLInputElement
// ...
function createElement(tagName: string): Element {
    // ...
}
const el: HTMLImageElement = createElement('img')
```

### 数字字面量类型

```typescript
function foo(x: 1 | 2): 2 | 3 {
    if (x !== 1) {
        return 2
    } else {
        return 3
    }
}
```

### 可辨识联合

- 合并单例类型，联合类型，类型保护和类型别名来创建一个叫做 **可辨识联合的高级模式**，它也称做 **标签联合** 或 **代数数据类型**
- “单例类型”多数是指 枚举成员类型 和 数字/字符串字面量类型

``` ts
interface Square {
    kind: 'square' // 字符串字面量类型 -> 可辨识的特征或标签
    size: number
}
interface Rectangle {
    kind: 'rectangle'
    width: number
    height: number
}
interface Circle {
    kind: 'circle'
    radius: number
}
type Shape = Square | Rectangle | Circle // 联合类型 + 类型别名
// 使用 never 类型，来进行完整性检查
function assertNever(x: never): never {
    throw new Error('Unexpected object: ' + x)
}
function area(s: Shape): number {
    switch (s.kind) {
        case 'square': return s.size ** 2 // 类型保护
        case 'rectangle': return s.width * s.height
        case 'circle': return Math.PI * s.radius ** 2
        // 如果 case 没有包含所有场景：
        // 1. 编译器会认为函数可能会返回 undefined，这和函数返回值 number 不符，从而产生提示
        // 2. assertNever 函数参数 s 会具有一个真实的类型，从而得到一个错误提示
        default: return assertNever(s)
    }
}
console.log(area({ kind: 'square', size: 4 })) // >>> 16
```

### 多态的 this 类型

```typescript
class BasicCalculator {
    constructor(protected value: number = 0) { }
    currentValue() {
        return this.value
    }
    add(operand: number): this {
        this.value += operand
        return this
    }
    multiply(operand: number): this {
        this.value *= operand
        return this
    }
}
console.log(
    new BasicCalculator(2)
        .multiply(5)
        .add(1)
        .currentValue()
) // >>> 111
class ScientificCalculator extends BasicCalculator {
    constructor(value = 0) {
        super(value)
    }
    sin() {
        this.value = Math.sin(this.value)
        return this
    }
}
console.log(
    new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue()
) // >>> 0.4559788891106302
```

### 索引类型 extends keyof T

> 检查使用了动态属性名的代码

``` ts
// 1. keyof T 是索引类型查询操作符，对于任何类型 T， keyof T 的结果为 T 上已知的公共属性名的联合。
// 2. T[K] 是索引访问操作符 
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map(n => o[n])
}
interface Person {
    name: string
    age: number
}
const p: Person = {
    name: 'Jarid',
    age: 35
}
console.log(pluck(p, ['name'])) // >>> ['Jarid']
```

``` ts
// 等价写法 keyof Person 是 Person 上公共属性的联合
let personProps1: keyof Person
let personProps2: 'name' | 'age'
```

```ts
function getProperty<T, K extends keyof T>(o: T, n: K): T[K] {
    return o[n]
}
```

``` ts
// 索引类型和字符串索引签名
// keyof T 是 string， T[string] 是索引签名的类型
interface IMap<T> {
    [key: string]: T
}
let keys: keyof IMap<number>   // string | number
let value: IMap<number>['foo'] // number
```

### 映射类型 in keyof T

``` ts
interface Person {
    name: string
    age: number
}
type TReadonly<T> = {
    readonly [P in keyof T]: T[P]
}
type TPartial<T> = {
    [P in keyof T]?: T[P]
}
type ReadonlyPerson = TReadonly<Person>
type PersonPartial = TPartial<Person>
/*
type ReadonlyPerson = {
    readonly name: string;
    readonly age: number;
}
type PersonPartial = {
    name?: string | undefined;
    age?: number | undefined;
}
 */
```

``` ts
type Keys = 'option1' | 'option2' // 要迭代的属性名的集合
type Flags = { [K in Keys]: boolean } // 类型变量 K 会依次绑定到每个属性
/*
type Flags = {
    option1: boolean;
    option2: boolean;
}
 */
```

``` ts
type Proxy<T> = {
    get(): T
    set(value: T): void
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>
}
// 包装
function proxify<T>(o: T): Proxify<T> {
    let result = {} as Proxify<T>
    // ...
    return result
}
let props = { a: 1 }
let proxyProps = proxify(props)
// 拆包（这个拆包推断只适用于同态的映射类型）
function unproxify<T>(t: Proxify<T>): T {
    let result = {} as T
    for (const k in t) {
        result[k] = t[k].get()
    }
    return result
}
let originalProps = unproxify(proxyProps)
```

- **预定义的有条件类型**
    * `Exclude<T, U>`   -- 从 `T` 中剔除可以赋值给 `U` 的类型
    * `Extract<T, U>`   -- 提取 `T` 中可以赋值给 `U` 的类型
    * `NonNullable<T>`  -- 从 `T` 中剔除 `null` 和 `undefined`
    * `ReturnType<T>`   -- 获取函数返回值类型
    * `InstanceType<T>` -- 获取构造函数类型的实例类型

```ts
type T00 = Exclude<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>           // 'b' | 'd'
type T01 = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>           // 'a' | 'c'
type T02 = Exclude<string | number | (() => void), Function>         // string | number
type T03 = Extract<string | number | (() => void), Function>         // () => void
type T04 = NonNullable<string | number | undefined>                  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined> // (() => string) | string[]

function f1(s: string) {
    return { a: 1, b: s }
}
class C {
    x = 0
    y = 0
}
type T10 = ReturnType<() => string>                               // string
type T11 = ReturnType<(s: string) => void>                        // void
type T12 = ReturnType<(<T>() => T)>                               // unknown
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)> // number[]
type T14 = ReturnType<typeof f1>                                  // { a: number, b: string }
type T15 = ReturnType<any>                                        // any
type T16 = ReturnType<never>                                      // never
type T17 = ReturnType<string>   // Error
type T18 = ReturnType<Function> // Error

type T20 = InstanceType<typeof C> // C
type T21 = InstanceType<any>      // any
type T22 = InstanceType<never>    // never
type T23 = InstanceType<string>   // Error
type T24 = InstanceType<Function> // Error
```

### 类型保护与区分类型
- 用户自定义的类型保护
``` ts
interface Bird {
    fly():string
    layEggs(): void
}

interface Fish {
    swim(): string
    layEggs(): void
}
// pet is Fish是类型谓词 pet必须是来自当前函数的一个参数名
const isFish = (pet: Fish | Bird): pet is Fish => {
    return (<Fish>pet).swim !== undefined
}
const params: Fish = {
    swim() {
        return 'swim'
    },
    layEggs() {}
}
console.log(isFish(params)) // true

const getSmallPet = (): Fish | Bird => {
    return {
        fly(): string {
           return 'fly'
        },
        layEggs():void {
            console.log('layEggs')
        }
    }
}
const pet = getSmallPet() // Bird接口
if (isFish(pet)) {
    console.log( pet.swim() )
} else {
    console.log( pet.fly() ) // fly
}
```

- typeof 类型保护

``` ts
function isNumber(x: any): x is number {
    return typeof x === 'number'
}
function isString(x: any): x is string {
    return typeof x === 'string'
}
function padLeft(value: string, padding: string | number) {
    if (isNumber(padding)) {
        return Array(padding + 1).join(' ') + value
    }
    if (isString(padding)) {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`)
}
```
> 不必将 `typeof x === 'number'` 抽象成一个函数，因为 TypeScript 可以将它识别为一个类型保护。  
也就是说我们可以直接在代码里检查类型。

- instanceof类型保护
> `instanceof` 类型保护是通过构造函数来细化类型的一种方式
``` ts
interface Padder {
    getPaddingString(): string
}

class SpaceRepeatingPadder implements Padder {
    constructor(private numSpaces: number) { }
    getPaddingString() {
        return Array(this.numSpaces + 1).join(' ')
    }
}

class StringPadder implements Padder {
    constructor(private value: string) { }
    getPaddingString() {
        return this.value
    }
}

function getRandomPadder() {
    return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder('ssss')
}

// 类型为 SpaceRepeatingPadder | StringPadder
let padder: Padder = getRandomPadder()
if (padder instanceof SpaceRepeatingPadder) {
    // 类型细化为 'SpaceRepeatingPadder'
    console.log(padder.getPaddingString() + 'Hello!') // >>>     Hello!
} else if (padder instanceof StringPadder) {
    // 类型细化为 'StringPadder'
    console.log(padder.getPaddingString() + 'Hello!') // >>> ssssHello!
}
```

### 可以为null的类型保护

- 可选参数和可选属性
> 使用了 `--strictNullChecks`，可选参数会被自动地加上 `| undefined`
``` ts
// y: number | undefined
const f = (x: number, y?: number) => {
    return x + (y || 0) 
}
console.log(f(1, 2))          // 3
console.log(f(1))            // 1
console.log(f(4, undefined)) // 4
// console.log(f(6, null)) // 类型null的参数不能赋值给类型number|undefined的参数
```

- 类型保护和类型断言
``` ts
const h = (sn: string | null): string => {
    if (sn === null) {
        return 'default'
    }
    return sn
}
const f = (sn: string | null): string => {
    return sn || 'default'
}
```

> 如果编译器不能够去除 `null` 或 `undefined`，可以使用类型断言手动去除。语法是添加 `!` 后缀： `identifier!` 从 `identifier` 的类型里去除了 `null` 和 `undefined`

``` ts
function broken(name: string | null): string {
    function postfix(epithet: string) {
        return name.charAt(0) + '. the' + epithet // >>> error: 对象可能为 null
    }
    name = name || 'Bob'
    return postfix('great')
}
function fixed(name: string | null): string {
    function postfix(epithet: string) {
        return name!.charAt(0) + '. the' + epithet // *name!.charAt(0)*
    }
    name = name || 'Bob'
    return postfix('great')
}
```

### 类型断言

- `<>` 和 `as`
- `!`
- `as const`

## 模块
外部模块简称模块，内部模块简称命名空间

### 导出
- 导出声明： 任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加export关键字来导出
- 导出语句： 可以对导出的部分重命名
- 重新导出： 不会在当前模块导入那个模块或定义一个新的局部变量
    * 扩展其它模块，并且只导出那个模块的部分内容
    * 一个模块可以包裹多个模块，并把他们导出的内容联合在一起通过语法`export * from 'module'`

``` ts
const numberReg = /^[0-9]+$/
class ZipCodeValidator {
    isAcceptable(s: string): boolean {
        return s.length === 5 && numberReg.test(s)
    }
}
export { ZipCodeValidator }
export { ZipCodeValidator as MainValidator }

// 重新导出 需要先引入，之后再重新导出
export { ZipCodeValidator as RegZipCodeValidator } from './ZipCodeValidator'
```

### 导入

- 导入一个模块中的某个导出内容
    * 可以对导入内容重命名
- 将整个模块导入到一个变量，并通过它来访问模块的导出部分
- 具有副作用的导入模块
    * 一些模块会设置一些全局状态供其它模块使用`import 'module'`
``` ts
import { ZipCodeValidator } from './ZipCodeValidator'
const myValidator = new ZipCodeValidator()
// 对导入的内容重命名
import { ZipCodeValidator as ZCV } from './ZipCodeValidator'
const myValidator2 = new ZCV()
// 将整个模块导入到一个变量，并通过它来访问模块的导出部分
import * as validator from './ZipCodeValidator'
const myValidator3 = new validator.ZipCodeValidator()
// 具有副作用的导入模块
import './module.js'
```

### 默认导出
- 每个模块都可以有一个`default`导出
- 默认导出使用`default`关键字标记；并且一个模块只能够有一个`default`导出
- 类和函数声明可以直接被标记为默认导出
- 标记为默认导出的类和函数的名字是可以省略的
- `default` 导出也可以是一个值
``` ts
// ZipCodeValidator.js
export default class ZipCodeValidator {
    static numberReg = /^[0-9]+$/
    isAcceptable(s: string): boolean {
        return s.length === 5 && ZipCodeValidator.numberReg.test(s)
    }
}

// Test.js
import Validator from './ZipCodeValidator'
const myValidator = new Validator()

// 导出一个值
export default '123'
```

### export = 和 import = require()
- 为了支持CommonJs和AMD的exports，ts提供了export =
- `export =`兼容`export default`和`exports`
- 若使用`export =`导出一个模块，则必须使用TypeScript的特定语法`import module = require('module')`来导入此模块。

``` ts
// ZipCodeValidator.js
const numberReg = /^[0-9]+$/
class ZipCodeValidator {
    isAcceptable(s: string): boolean {
        return s.length === 5 && numberReg.test(s)
    }
}
export = ZipCodeValidator

// Test.js
import zip = require('./ZipCodeValidator')
```

``` ts
// 简单示例
// validator.ts
export interface StirngValidator {
    isAcceptable(s: string): boolean
}

// LetterOnlyValidator.ts
import { StringValidator } from './validator' 
const letterReg = /^[A-Za-z]+$/
export class LettersOnlyValidator implements StirngValidator {
    isAcceptable(s: string) {
        return letterReg.test(s)
    }
}

// ZipCodeValidator.ts
import { StringValidator } from './validator'
const numberReg = /^[0-9]+$/
export class ZipCodeValidator implements StirngValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberReg.test(s)
    }
}

// Test.ts
import { StringValidator } from './validator' 
import { LetterOnlyValidator } from './LetterOnlyValidator'
import { ZipCodeValidator } from './ZipCodeValidator'

const strArr = ['hello', '98052', '101']
let validators: { [s: string]: StirngValidator } = {}
validators['ZIP code'] = new LetterOnlyValidator()
validators['Letters only'] = new ZipCodeValidator() 
```

### 使用其他的js库(外部模块)
> 需要声明类库所暴露出的 API

- 外部模块

``` ts
declare module 'path' {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export let sep: string;
}
```

- 外部模块简写（简写模块里所有导出的类型将是`any`）
``` ts
declare module 'qs'
```

- 模块声明通配符 `*`
``` ts
// shims-vue.d.ts
declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}
```

- UMD模块
> 模块被设计成兼容多个模块加载器，或不使用模块加载器（全局变量），这些库可以以导入或全局变量的形式访问
``` ts
// math-lib.d.ts
export function isPrime(x: number): boolean
export as namespace mathhLib

import { isPrime } from 'math-lib'
isPrime(2)          // ok
mathLib.isPrime(2)  // Error 不能在模块内使用全局定义

// 以全局变量的形式使用，只能在不带有模块导入或导出的脚本中使用
mathLib.isPrime(2) 
```

### 创建模块结构指导

- 尽可能地在顶层导出
- 如果仅导出单个`class`或`function`，使用`export default`
- 如果要导出多个对象，把它们放在顶层里导出
    * 当导入的时候：明确地列出导入的名字
    * 当有大量导出内容的时候：使用命名空间导入模式
- 使用重新导出进行扩展
- 模块里不要使用命名空间

> *模块结构上的危险信号*   
>> 1. 文件的顶层声明是`export namespace Foo { ... }`（删除`namespace Foo`并把所有内容向上层移动一层）   
>> 2. 文件只有一个`export class`或`export function`（考虑使用`export default`）   
>> 3. 多个文件的顶层具有同样的`export namespace Foo {`（不要以为这些会合并到一个`namespace Foo`中！）


## 命名空间

### 分离到多个文件
- 加入引用标签来告诉编译器文件之间的关联`/// <reference path='Validation.ts' />`
- 当涉及到多文件时，我们必须确保所有编译后的代码都被加载了
    * 第一种方式：把所有的输入文件编译为一个输出文件，需要使用`--outFile`标记
    * 第二种方式：在页面上通过`<script>`标签把所有生成的JS文件按正确的顺序引进来
``` ts
// 使用命名空间的验证器，在同一个文件内
namespace Validator {
    export interface StringValidator {
        isAcceptable(s: string): boolean
    }

    const letterReg = /^[A-Za-z]+$/
    const numberReg = /^[0-9]+$/

    export class LetterOnlyValidators implements StringValidator {
        isAcceptable(s: string) {
            return letterReg.test(s)
        }
    }

    export class ZipCodeValidators implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberReg.test(s)
        }
    }
}

const validators = new Validator.LetterOnlyValidators()
console.log(validators.isAcceptable('test')) // true
```

``` ts
// Validator.ts
namespace Validator {
    export interface StringValidator {
        isAcceptable(s: string): boolean
    }
}

// LetterValidator.ts
/// <reference path='./Validator.ts' />
namespace Validator {
    const letterReg = /^[A-Za-z]+$/
    export class LetterValidator implements StringValidator {
        isAcceptable(s: string): boolean {
            return letterReg.test(s)
        }
    }
}

// NumberValidator.ts
/// <reference path='./Validator.ts' />
namespace Validator {
    const numberReg = /^[0-9]+$/
    export class NumberValidator implements StringValidator {
        isAcceptable(s: string): boolean {
            return s.length === 5 && numberReg.test(s)
        }
    }
}

// index.ts
/// <reference path='./Validator.ts' />
/// <reference path='./LetterValidator.ts' />
/// <reference path='./NumberValidator.ts' />
const validators: { [s: string]: Validator.StringValidator } = {}
validators["letter"] = new Validator.LetterValidator()
console.log(validators)
```
执行命令输入js文件`tsc --outFile index.js index.ts`

### 使用其它的 JavaScript 库
- 外部命名空间

``` ts
// D3.d.ts (部分摘录)
declare namespace D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection
            (element: EventTarget): Selection
        }
    }
    export interface Event {
        x: number
        y: number
    }
    export interface Base extends Selectors {
        event: Event
    }
}
declare var d3: D3.Base
```

## 命名空间和模块

### 使用命名空间

- 命名空间是位于全局命名空间下的一个普通的带有名字的 JavaScript 对象

### 使用模块

- 像命名空间一样，模块可以包含代码和声明。 不同的是模块可以 声明它的依赖

### 命名空间和模块的陷阱

- 对模块使用 `/// <reference>`
- 不必要的命名空间

## 模块解析
### 相对和非相对模块导入

- 相对导入是以 `/` ， `./` 或 `../` 开头的
    * 使用相对路径导入自己写的模块
- 所有其它形式的导入被当作非相对的
    * 使用非相对路径来导入外部依赖

### 模块解析策略

> 共有两种可用的模块解析策略： Node 和 Classic

- Classic
    * 相对导入的模块是相对于导入它的文件进行解析的
    * 对于非相对模块的导入，编译器则会从包含导入文件的目录开始依次向上级目录遍历，尝试定位匹配的声明文件。
- Node
    * 在运行时模仿 Node.js 模块解析机制

### 附加的模块解析标记

> TypeScript编译器有一些额外的标记用来通知编译器在源码编译成最终输出的过程中都发生了哪个转换。  
注意：编译器不会进行这些转换操作；它只是利用这些信息来指导模块的导入。

- **baseUrl**
    * `tsconfig.json` 里的 `baseUrl` 属性（或者命令行中的 `baseUrl` 值）
    * 所有非相对模块导入都会被当做相对于 `baseUrl`
    * 相对模块的导入不会被设置的 `baseUrl` 所影响，因为它们总是相对于导入它们的文件
- **路径映射**
    * `tsconfig.json` 里的 `paths` 来支持这样的声明映射
    * 注意 `paths` 是相对于 `baseUrl` 进行解析的
- **利用 rootDirs 指定虚拟目录**

### 跟踪模块解析

- 通过 `--traceResolution` 启用编译器的模块解析跟踪

### 使用 --noResolve

- `--noResolve` 编译选项告诉编译器不要添加任何不是在命令行上传入的文件到编译列表。
- 编译器仍然会尝试解析模块，但是只要没有指定这个文件，那么它就不会被包含在内。


### 为什么在 exclude 列表里的模块还会被编译器使用

- 要从编译列表中排除一个文件，需要在排除它的同时，还要排除所有对它进行import或使用了 `/// <reference path='...' />` 指令的文件   
（如果编译器识别出一个文件是模块导入目标，它就会加到编译列表里，不管它是否被排除了）
- `tsconfig.json` 将文件夹转变一个“工程”，如果不指定任何 `exclude` 或 `files`，   
文件夹里的所有文件包括 `tsconfig.json` 和所有的子目录都会在编译列表里。   
如果想利用 `exclude` 排除某些文件，甚至想指定所有要编译的文件列表，请使用 `files`。

## 声明合并
- TypeScript中的声明会创建以下三种实体之一：命名空间，类型或值。 

| Declaration Type | Namespace | Type | Value |
| :--------------: | :-------: | :--: | :---: |
| Namespace        | X         |      | X     |
| Class            |           | X    | X     |
| Enum             |           | X    | X     |
| Interface        |           | X    |       |
| Type Alias       |           | X    |       |
| Function         |           |      | X     |
| Variable         |           |      | X     |

### 合并接口

```ts
// 非函数的成员
interface Box {
    height: number
    width: number
    color: string
}
interface Box {
    scale: number
    color: string // 重复成员的类型要一致
}
const box: Box = { height: 5, width: 6, scale: 10, color: 'red' }
```
```ts
// 函数成员
// 每个同名函数声明都会被当成这个函数的一个重载，且后面的接口具有更高的优先级
interface Document {
    createElement(tagName: any): Element
}
interface Document {
    createElement(tagName: 'div'): HTMLDivElement
    createElement(tagName: 'span'): HTMLSpanElement
}
interface Document {
    createElement(tagName: string): HTMLElement
    createElement(tagName: 'canvas'): HTMLCanvasElement
}
/* 
interface Document {
    createElement(tagName: 'canvas'): HTMLCanvasElement
    createElement(tagName: 'div'): HTMLDivElement
    createElement(tagName: 'span'): HTMLSpanElement
    createElement(tagName: string): HTMLElement
    createElement(tagName: any): Element
}
 */
```

### 合并命名空间

```ts
// 命名空间会创建出命名空间和值
namespace Animals {
    let haveMuscles = true
    export interface Legged { feet: string }
    export class Zebra { }
    export function animalsHaveMuscles() {
        let leg: Legged = {
            feet: 'feet10', 
            numOfLegs: 10
        }
        let dog = new Dog()
        return haveMuscles // 非导出成员仅在其原有的（合并前的）命名空间内可见
    }
}
namespace Animals {
    export interface Legged { numOfLegs: number }
    export class Dog { }
    export function doAnimalsHaveMuscles() {
        let leg: Legged = {
            feet: 'feet10',
            numOfLegs: 10
        }
        let zebra = new Zebra()
        // return haveMuscles // error: 找不到名称“haveMuscles”
    }
}
let leg: Animals.Legged = {
    numOfLegs: 1,
    feet: 'feet'
}
let zebra: Animals.Zebra = new Animals.Zebra()
let dog: Animals.Dog = new Animals.Dog()
```

### 命名空间与类和函数和枚举类型合并

- 命名空间可以与其它类型的声明进行合并
- 只要命名空间的定义符合将要合并类型的定义
- 合并结果包含两者的声明类型
- TypeScript 使用这个功能去实现一些 JavaScript 里的设计模式

#### 合并命名空间和类

- 给类添加内部类

```ts
class Album {
    label = Album.AlbumLabel // 内部类（合并后）
    print() {
        console.log('Album print')
    }
}
namespace Album {
    // 必须导出 AlbumLabel 类，好让合并的类能访问
    export class AlbumLabel {
        print() {
            console.log('Album.AlbumLabel print')
        }
    }
}
let a = new Album()
let l = new a.label()
a.print() // >>> Album print
l.print() // >>> Album.AlbumLabel print
```

#### 合并命名空间和函数

- 给函数添加属性

```ts
function buildLabel(name: string): string {
    return buildLabel.prefix + name + buildLabel.suffix
}
namespace buildLabel {
    export let suffix = '!'
    export let prefix = 'Hello, '
}
console.log(buildLabel('world')) // >>> Hello, world!
```

#### 合并命名空间和枚举类型

- 给枚举添加枚举项

```ts
enum Color {
    red = 1,
    green = 2,
    blue = 4
}
namespace Color {
    export function mixColor(colorName: string): number {
        switch (colorName) {
            case 'yellow': return Color.red + Color.green
            case 'white': return Color.red + Color.green + Color.blue
            case 'magenta': return Color.red + Color.blue
            case 'cyan': return Color.green + Color.blue
            default: return Color.red
        }
    }
}
let c1: Color = Color.red
let c2: Color = Color.mixColor('magenta')
console.log(c1, c2) // >>> 1 5
```

### 模块扩展

```ts
/* observable.ts */
export class Observable<T> { }
// 全局扩展
declare global {
    interface Array<T> {
        // 在模块内部添加声明到全局作用域中
        // 全局扩展与模块扩展的行为和限制是相同的
        toObservable(): Observable<T>
    }
}
Array.prototype.toObservable = function <T>() {
    return this as Observable<T>
}

/* map.ts */
import { Observable } from './observable'
// 模块扩展
declare module './observable' {
    // 当这些声明在扩展中合并时，就好像在原始位置被声明了一样。
    // 但是，不能在扩展中声明新的顶级声明（仅可以扩展模块中已经存在的声明）。
    interface Observable<T> {
        map<U>(f: (x: T) => U): Observable<U>
    }
}
Observable.prototype.map = function <U>(f: <T>(x: T) => U): Observable<U> {
    let result = {} as Observable<U>
    return result
}

/* consumer.ts */
import { Observable } from './observable'
import './map'

let o: Observable<number> = [1.1, 2.2, 3.3]
console.log(o.map(v => v.toFixed())) // >>> ['1', '2', '3']

let a: number[] = [4, 5, 6]
let t = a.toObservable()
console.log(t.map(v => v.toFixed())) // >>> ['4', '5', '6']
```

## 装饰器
> 若启用装饰器特性，必须在命令行`或`tsconfig.json里启用experimentalDecorators编译器选项
命令行 `tsc --target ES5 --experimentalDecorators`或
tsconfig.json `experimentalDecorators: true`

### 类装饰器
- 类装饰器可以扩展类的属性和方法
``` ts
const logClass = (target: any) => {
    // target就是构造函数原型对象 HttpClient() {}
    console.log(target)
    // 不需要创建实例，装饰器就会被调用
    console.log('logClass called')
    target.prototype.name = 'http://www.baidu.com'
    target.prototype.run = () => {
        console.log('run')
    }
}

@logClass
class HttpClient {
    name: string | undefined
    constructor () {
    }
}

const http: any = new HttpClient()

// 实例对象的_proto_指向其构造函数的原型对象 {name: 'xxx', run : () => {}}
console.log(http)
```

### 装饰器工厂
- 装饰器工厂可以用来传递参数
``` ts
const logClass = (params: any) => {
    return (target: any) => {
        target.prototype.name = params
    }
}

@logClass('http://www.baidu.com')
class HTTPClient {
    name: string | undefined
    constructor () {
    }
    getData () {
        console.log('getData')
    }
}

const http: any = new HTTPClient()
// {name: 'http://www.baidu.com', getData: () => {}}
console.log(http) 
```

### 装饰器组合
- 多个装饰器应用在一个声明上时会进行如下步骤
    - 由上至下依次对装饰器表达式求值
    - 求值的结果会被当做函数，由下至上依次调用
``` ts
const f = () => {
    console.log('f():evaluated')
    return (target: any, methodName: string, des: any) => {
        console.log('f():called')
    }
}

const g = () => {
    console.log('g():evaluated')
    return (target: any, methodName: string, des: any) => {
        console.log('g():called')
    }
}

class HttpClient {
    name: string | undefined
    constructor () {
    }
    @f()
    @g()
    getData () {}
}

// f(): evaluated
// g(): evaluated
// g(): called
// f(): called
```

### 方法装饰器
- 应用于方法的属性描述符，可以用来监视、修改或替换方法定义
``` ts
const logFun = (target: any, methodName: any, des: any) => {
    // target 实例对象  methodName 方法名称  des 方法的具体实现
    console.log(target, methodName, des)
    const oMethod = des.value
    des.value = () => {
        console.log('getData2')
        oMethod.call(this)
    }
}

const logFun2 = (params: any) => {
    return (target: any, methodName: any, des: any) => {
        des.value = () => {
            console.log(params)
        }
    }
}

class HttpClient {
    name: string | undefined
    constructor () {
    }
    @logFun
    getData () {
        console.log('getData1')
    }
    @logFun2('测试')
    setData () {
        console.log('setData')
    }
}

const http: any = new HttpClient()
http.getData() // getData2 getData1
http.setData() // 测试
```

### 访问器装饰器
- 应用于访问器的属性描述符，可以用来监视，修改或替换一个访问器的定义（用法同方法装饰器）
``` ts
const logConfigurable = (value: boolean) => {
    return (target: any, methodName: string, des: any) => {
        console.log(target, propertyKey, des)
        des.configurable  = value
    }
}

class Point {
    private _x: number | undefined
    private _y: number | undefined
    constructor (x: number, y: number) {
        this._x = x
        this._y = y
    }
    @logConfigurable(false)
    get x() {
        return this._x
    }

    @logConfigurable(false)
    get y() {
        return this._y
    }
}
```

### 属性装饰器
``` ts
const logAttr = (target: any, attrName: any) => {
    // target实例对象 attr装饰属性名
    target[attrName] = '百度一下'
}

const logAttribute = (params: string) => {
    return (target: any, attrName: any) => {
        target[attrName] =  params
    }
}

class HttpClient {
    @logAttr
    name: string | undefined
    @logAttribute('http://www.baidu.com')
    url: string | undefined
    constructor () {
    }
    getData () {
        console.log('getData')
    }
}

const http: any = new HttpClient()
// {getData: () => {}, name: '百度一下', url: 'http://wwww.baidu.com'}
console.log(http)
```

### 方法参数装饰器
``` ts
const logParams = (params: any) => {
    return (target: any, methodName: any, paramIndex: any) => {
        // target[methodName] = () => {
        // }
        console.log(target, methodName, paramIndex)
    } 
}


class HttpClient {
    name: string | undefined
    constructor () {
    }
    getData (@logParams('测试') uid: any) {
        console.log(uid)
    }
}

const http: any = new HttpClient()
http.getData()
```

## JSX

> 三种JSX模式：`preserve`，`react` 和 `react-native`

| 模式         | 输入       | 输出                         | 输出文件扩展名 |
| :-----------:| :-------: | :--------------------------: | :-----------: |
| preserve     | `<div />` | `<div />`                    | `.jsx`        |
| react        | `<div />` | `React.createElement('div')` | `.js`         |
| react-native | `<div />` | `<div />`                    | `.js`         |

> 如果是ES6的类，类类型就是类的构造函数和静态部分，实例类型为这个类的实例的类型  
> 如果是个工厂函数，类类型为这个函数，实例类型为这个函数返回值类型

## 三斜线指令

> 三斜线指令仅可放在包含它的文件的最顶端

- `/// <reference path='...' />`
- `/// <reference types='...' />`
- `/// <reference no-default-lib='true'/>`
- `/// <reference lib='...' />`
    * 允许一个文件显式地包含一个已知的内置`lib`文件
- `/// <amd-module name='...' />`
- `/// <amd-dependency path='...' />`
    * 注意：这个指令被废弃了。使用`import 'moduleName'`语句代替。

## 声明文件

- 全局变量
    * `declare var`
    * `declare let`
    * `declare const`
- 全局函数
    * `declare function`
- 带属性的对象
    * `declare namespace`
- 函数重载
    * `declare function`
- 可重用类型（接口）
    * `interface`
- 可重用类型（类型别名）
    * `type`
- 组织类型
    * `declare namespace Name { interface }`
    * `declare namespace Name1.Name2 { interface }`
- 类
    * `declare class`
- 外部枚举
    * `declare enum`
- 扩展全局变量
    * `declare global`
- 扩展模块
    * `declare module`
- 三斜线指令
    * `/// <reference ... />`
- 导出变量
    * `export`
- 导出带属性的对象
    * `export namespace`
- ES6 默认导出
    * `export default`
- commonjs 导出模块
    * `export =`
- UMD 库声明全局变量
    * `export as namespace`

> [模板](https://www.tslang.cn/docs/handbook/declaration-files/templates.html)

## tsconfig.json

> `tsconfig.json`文件中指定了用来编译这个项目的根文件和编译选项   
> 当命令行上指定了输入文件时，`tsconfig.json`文件会被忽略

- `files`
    * 指定一个包含相对或绝对文件路径的列表
- `include`和`exclude`
    * 指定一个文件`glob`匹配模式列表。支持的glob通配符有：
        + `*` 匹配0或多个字符（不包括目录分隔符）
        + `?` 匹配一个任意字符（不包括目录分隔符）
        + `**/` 递归匹配任意子目录
- `compilerOptions`
    * `baseUrl`
    * `paths`
    * `rootDirs`
    * `typeRoots`
    * `types`
    * `outDir`

## 补充

### 实用程序类型

- `Partial<T>`
- `Readonly<T>`
- `Record<K,T>`
- `Pick<T,K>`
- `Omit<T,K>`
- `Exclude<T,U>`
- `Extract<T,U>`
- `NonNullable<T>`
- `ReturnType<T>`
- `InstanceType<T>`
- `Required<T>`
- `ThisType<T>`

### 内置类型声明
- `dom`
- `webworker`
- `es5`
- `es6` / `es2015`
- `es2015.core`
- `es2015.collection`
- `es2015.iterable`
- `es2015.promise`
- `es2015.proxy`
- `es2015.reflect`
- `es2015.generator`
- `es2015.symbol`
- `es2015.symbol.wellknown`
- `es2016`
- `es2016.array.include`
- `es2017`
- `es2017.object`
- `es2017.sharedmemory`
- `scripthost`

## 参考

- [TypeScript入门教程](https://ts.xcatliu.com/)
- [TypeScript中文网](https://www.tslang.cn/docs/home.html)
- [TypeScript官网](https://www.typescriptlang.org/docs/home.html)