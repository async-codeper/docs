# Vue3组合式API
Vue3采用OptionApi和CompositionApi（以下简称API）两种方式，Vue2采用的就是OptionApi，相信大家都比较熟悉，接下来就是对CompositionApi进行总结。

## 插件
工欲善其事必先利其器，在对API进行总结以前，先总结一下Vue3和Vue2的插件差异，浏览器插件Vue2采用的devtools是5.x版本，Vue3采用的devtools是6.x版本
- VsCode插件[TypeSript Vue Plugin(Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- chrome商店devtools[Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=zh-CN)。
- 浏览器插件官网[Vue.js devtools](https://devtools.vuejs.org/)

## 兼容性
vue3不支持IE浏览器，且没有任何的polyfill，因为Vue3使用的响应式底层是基于Proxy来实现的，所以不支持IE浏览器。Vue2底层使用的是defineProperty，所以它不支持IE8及以下的版本

## setup()

### 基本使用
setup()钩子函数是使用API的入口，但是在Vue3.2及以上版本可以使用setup语法糖来使用API
> SFC中OptionAPI可以和CompositionAPI混合使用，setup函数返回的对象会暴漏给模版和组件实例，所以OptionApi可以通过组件实例来访问暴漏出来的属性
``` vue
<script lang="ts">
import { ref } from 'vue'

export default {
    props: ['title'],
    setup (props, { attrs，slots, emit, expose }) {
        // setup()内部对组件实例没有访问权，所以不能访问this（组件实例）
        const count = ref(0)

        // 返回值暴漏给组件实例和模板
        return {
            count
        }
    },
    mounted () {
        console.log(this.count) // 0
    }
}
</script>

<template>
    <button @click="count++"></button>
</template>
```

在vue3.2及以上，可以使用setup语法糖，不用写setup函数
``` vue
<script lang="ts" setup>
import { ref } from 'vue'

// 不用返回，且会暴漏给模板，对于ref会自动解包
const count = ref(0)
</script>

<template>
    <button @click="count++"></button>
</template>
```

### setup()参数
- 第一个参数是props，是响应式的，不能简单的使用ES6来解构props，会丢失响应性，可以借助`toRefs`和`toRef`工具函数来解构保持响应性
- 第二个参数是setup上下文对象，该对象不是响应式的，所以可以使用ES6解构

``` ts
setup (props, { attrs, slots, emit, expose }) {
    // attrs、slots虽然不是响应式的， 但是是有状态的对象，避免解构

    // 让组件实例处于关闭状态，不像父组件暴漏任何东西
    expose()

    // 有选择性的暴露属性
    expose({
        count: ref(0)
    })
}
```

### render函数
setup函数中可以返回一个渲染函数，渲染函数可以使用setup函数内作用域中的响应式状态
> 返回一个渲染函数阻止我们返回其他东西，但是父组件想要访问内部属性和方法需要通过expose()暴漏出去
``` ts
import { ref, h } from 'vue'

export default {
    setup (_, { expose }) {
        const count = ref(0)

        // 提前暴漏，可以让父组件访问
        expose({
            count
        })

        return () => h('div', count.value)
    }
}
```

## 核心方法
### ref

- 标注类型
``` vue
<script lang="ts" setup>
import { ref, type Ref } from 'vue'

// ref类型标注
const count = ref<number>(0)

// ref类型标注
const name: Ref<string | number> = ref('zs')

// dom节点
const dom = ref<HTMLDivElement | null>(null)
</script>

<template>
    <button @click="count++"></button>
    <div ref="dom"></div>
</template>
```

- ref解包

1、ref只有在模板渲染上下文顶层中才会自动解包，不需要.value
``` vue
<script lang="ts" setup>
import { ref } from 'vue'

// {{ test.foo }} BAD
const test = { foo: ref(1) }

// {{ foo }} GOOD
const { foo } = test

const obj = { age: ref(20), name: ref('ls') }

// 仍然是响应式的
const { age, name } = obj
</script>
```

2、ref在响应式对象中作为属性会自动解包，但是作为响应式数组或Map这种原生集合使用时，不会自动解包
``` ts
const count = ref(0)

const state = reactive({
    count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1

const books = reactive([ref(0)])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

### reactive
不能使用ES6解构，会丢失响应性，借助工具函数toRefs就可以结构
``` ts
const state = reactive({
    age: 20
})

console.log(state.age++) // 21
```
- 类型标注
``` ts
interface Person {
    name: string
    age: number
}

// GOOD
const state: Person = reactive({
    age: 20,
    name: 'zs'
})

// BAD 不推荐使用泛型参数
const state = reactive<Person>({
    age: 20,
    name: 'zs'
})
```

### computed
``` ts
// 只读
function computed<T>(
  getter: () => T,
  // 查看下方的 "计算属性调试" 链接
  debuggerOptions?: DebuggerOptions
): Readonly<Ref<Readonly<T>>>

// 可写的
function computed<T>(
  options: {
    get: () => T
    set: (value: T) => void
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>
```
``` ts
// 只读
const count = ref(20)
const plusCount = computed<number>(() => count.value++) // number类型标注，也可以不写，自动推导

plusCount.value++ // 错误
```
``` ts
// 可写
const count = ref(1)
const plusCount = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

plusCount.value = 1
console.log(count.value) // 0
```
``` ts
// 调试
const plusOne = computed(
    () => count.value + 1,
    {
        onTrack(e) {
            debugger
        },
        onTrigger(e) {
            debugger
        }
    }
)
```

### readonly
接受一个对象，不论是响应式或者是普通对象或是一个ref，返回一个原值的只读代理
``` ts
// 类型
function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>>
```
``` ts
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 用来做响应性追踪
  console.log(copy.count)
})

// 更改源属性会触发其依赖的侦听器
original.count++

// 更改该只读副本将会失败，并会得到一个警告
copy.count++ // warning!
```

### watch
``` ts
// 侦听单个来源
function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions
): StopHandle

// 侦听多个来源
function watch<T>(
  sources: WatchSource<T>[],
  callback: WatchCallback<T[]>,
  options?: WatchOptions
): StopHandle

type WatchCallback<T> = (
  value: T,
  oldValue: T,
  onCleanup: (cleanupFn: () => void) => void
) => void

type WatchSource<T> =
  | Ref<T> // ref
  | (() => T) // getter
  | T extends object
  ? T
  : never // 响应式对象

interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // 默认：false
  deep?: boolean // 默认：false
  flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
```
``` ts
// 侦听一个get函数
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)
```
``` ts
// 侦听一个 ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```
``` ts
// 侦听多个源
const name = ref('zs')
const age = ref(20)
watch(
    [name, age],
    ([nameNew, ageNew], [namePrev, agePrev]) => {

    }
)
```
``` ts
const state = reactive({ name: 'zs', age: 20 })
wacth(
    () => state,
    () => {
        // 会自动开启深度监听
    }
)

// 需要手动开启深度监听
watch(
    state,
    () => {

    },
    { deep: true }
)
```
```ts
// 停止监听
const stop = watch(
    () => state,
    () => {
        
    }
)
stop()
```
``` ts
// 清除副作用
watch(
    id,
    async (newId, oldId, onCleanup) => {
        const { response, cancel } = doAsyncWork(newId)
        // 当 `id` 变化时，`cancel` 将被调用，
        // 取消之前的未完成的请求
        onCleanup(cancel)
        data.value = await response
    }
)
```

### watchEffect
立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行
``` ts
function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
): StopHandle

type OnCleanup = (cleanupFn: () => void) => void

interface WatchEffectOptions {
    // 默认：'pre',侦听器在组件渲染之前执行
    // post 侦听器在组件渲染之后执行
    // sync 侦听器和组件渲染同步执行
    flush?: 'pre' | 'post' | 'sync'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
}

type StopHandle = () => void
```

``` ts
const count = ref(1)

watchEffect(() => {
    console.log(count.value)
})
// -> 输出 0

count.value++
// -> 输出 1
```

### watchPostEffect
watchEffect() 使用 flush: 'post' 选项时的别名

### watchSyncEffect
watchEffect() 使用 flush: 'sync' 选项时的别名

## 工具方法
### isRef
检查某个值是否为 ref
``` ts
// 类型
function isRef<T>(r: Ref<T> | unknown): r is Ref<T>

let age: unknown
if (isRef(age)) {
    // age的类型被收缩为Ref<unknown>
    age.value
}
```

### unref
如果参数是 ref，则返回内部值，否则返回参数本身。`val = isRef(val) ? val.value : val`
``` ts
function unref<T>(ref: T | Ref<T>): T
```
``` ts
function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped 现在保证为 number 类型
}
```

### toRef
基于响应式对象上的一个**属性**，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值将更新 ref 的值，反之亦然。
``` ts
function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
): ToRef<T[K]>

type ToRef<T> = T extends Ref ? T : Ref<T>
```
``` ts
const state = reactive({
    name: 'zs',
    age: 20
})

const ageRef = toRef(state, 'age')

ageRef.value++
console.log(state.age) // 21

state.age++
console.log(ageRef.value) // 22
```
``` vue
<script setup>
import { toRef } from 'vue'

const props = defineProps(/* ... */)

// 将 `props.foo` 转换为 ref，然后传入
// 一个组合式函数
const fooRef = toRef(props, 'foo')
</script>
```

### toRefs
将一个响应式对象转换为一个**普通对象**，这个普通对象的每个属性都是指向源对象相应属性的 ref。每个单独的 ref 都是使用 toRef() 创建的。
``` ts
function toRefs<T extends object>(
  object: T
): {
  [K in keyof T]: ToRef<T[K]>
}

type ToRef = T extends Ref ? T : Ref<T>
```
``` ts
const state = reactive({
    foo: 1,
    bar: 2
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs 的类型：{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// 这个 ref 和源属性已经“链接上了”
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

### isProxy
检查一个对象是否是由 `reactive()`、`readonly()`、`shallowReactive()` 或 `shallowReadonly()` 创建的代理
``` ts
function isProxy(value: unknown): boolean

const age = ref(20)
console.log(isProxy(age)) // false

const state = reactive({ name: 'zs' })
console.log(isProxy(state)) // true
```

### isReactive
检查一个对象是否是由 reactive() 或 shallowReactive() 创建的代理
``` ts
function isReactive(value: unknown): boolean
```

### isReadonly
检查传入的值是否为只读对象。只读对象的属性可以更改，但他们不能通过传入的对象直接赋值
``` ts
function isReadonly(value: unknown): boolean
```

## 进阶方法
### shadowRef
ref的浅层作用形式，只作用第一层
``` ts
// 类型
function shallowRef<T>(value: T): ShallowRef<T>

interface ShallowRef<T> {
    value: T
}
```
``` ts
const state = shallowRef({ count: 1 })

// 不会触发更改
state.value.count = 2

// 会触发更改
state.value = { count: 2 }
```

### triggleRef
强制触发依赖于一个浅层 ref 的副作用，这通常在对浅引用的内部值进行深度变更后使用
``` ts
// 类型
function triggerRef(ref: ShallowRef): void
```
``` ts
const shallow = shallowRef({
    greet: 'Hello, world'
})

// 触发该副作用第一次应该会打印 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet)
})

// 这次变更不应触发副作用，因为这个 ref 是浅层的
shallow.value.greet = 'Hello, universe'

// 打印 "Hello, universe"
triggerRef(shallow)
```

### customRef
创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式
``` ts
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
) => {
    get: () => T
    set: (value: T) => void
}
```
``` ts
import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return value
            },
            set(newValue) {
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                    value = newValue
                    trigger()
                }, delay)
            }
        }
    })
}
```
``` vue
<script setup>
import { useDebouncedRef } from './debouncedRef'
const text = useDebouncedRef('hello')
</script>

<template>
  <input v-model="text" />
</template>
```

### shadowReactive
reactive() 的浅层作用形式，只作用于根级别的属性才是响应式的，所以不会自动解包ref
``` ts
// 类型
function shallowReactive<T extends object>(target: T): T
```
``` ts
const state = shallowReactive({
    foo: 1,
    nested: {
        bar: 2
    }
})

// 更改状态自身的属性是响应式的
state.foo++

// ...但下层嵌套对象不会被转为响应式
isReactive(state.nested) // false

// 不是响应式的
state.nested.bar++
```

### shadowReadonly
readonly() 的浅层作用形式，只有根节点的属性变为了只读
``` ts
function shallowReadonly<T extends object>(target: T): Readonly<T>
```
``` ts
const state = shallowReadonly({
    foo: 1,
    nested: {
        bar: 2
    }
})

// 更改状态自身的属性会失败
state.foo++

// ...但可以更改下层嵌套对象
isReadonly(state.nested) // false

// 这是可以通过的
state.nested.bar++
```

### toRaw
根据响应式对象返回原始对象。toRaw() 可以返回由 `reactive()`、`readonly()`、`shallowReactive()` 或者 `shallowReadonly()` 创建的代理对应的原始对象
``` ts
// 类型
function toRaw<T>(proxy: T): T
```
``` ts
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

### markRaw
将一个对象标记为不可转为响应式
``` ts
// 类型
function markRaw<T extends object>(value: T): T
```
``` ts
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 也适用于嵌套在其他响应性对象
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

### effectScope
创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理
``` ts
// 类型
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
    run<T>(fn: () => T): T | undefined // 如果作用域不活跃就为 undefined
    stop(): void
}
```
``` ts
const scope = effectScope()

scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
})

// 处理掉当前作用域内的所有 effect
scope.stop()
```

### getCurrentScope
获取当前活跃的effect作用域
``` ts
function getCurrentScope(): EffectScope | undefined
```

### onScopeDispose
在当前活跃的 effect 作用域上注册一个处理回调函数。当相关的 effect 作用域停止时会调用这个回调函数。
这个方法可以作为可复用的组合式函数中 onUnmounted 的替代品，它并不与组件耦合，因为每一个 Vue 组件的 setup() 函数也是在一个 effect 作用域中调用的
``` ts
function onScopeDispose(fn: () => void): void
```

## 生命周期钩子
### onBeforeMount
在组件被挂在之前调用
``` ts
// 类型
function onBeforeMount(callback: () => void): void
```

### onMounted
组件挂在完成后执行
``` ts
// 类型
function onMounted(callback: () => void): void
```
``` vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLDivElement>()

onMounted(() => {
    el.value // div dom节点
})
</script>

<template>
    <div ref="el"></div>
</template>
```

### onBeforeUpdate
在组件即将因为响应式数据变更而更新其 DOM 树之前调用。这个钩子可以用来在 Vue 更新 DOM 之前访问 DOM 状态
``` ts
// 类型
function onBeforeUpdate(callback: () => void): void
```

### onUpdated
组件因为响应式数据变更而更新DOM树之后调用。父组件的onUpdated钩子会在其子组件的onUpdated钩子之后调用。
``` ts
// 类型
function onUpdated(callback: () => void): void
```
``` vue
<script setup>
import { ref, onUpdated } from 'vue'

const count = ref(0)

onUpdated(() => {
  // 文本内容应该与当前的 `count.value` 一致
  console.log(document.getElementById('count').textContent)
})
</script>

<template>
  <button id="count" @click="count++">{{ count }}</button>
</template>
```

### onBeforeUnmount
在组件卸载之前被调用。调用这个钩子的时候，组件实例依然还保有全部的功能
``` ts
// 类型
function onBeforeUnmount(callback: () => void): void
```

### onUnmounted
组件卸载之后被调用
``` ts
// 类型
function onUnmounted(callback: () => void): void
```
``` vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

let intervalId
onMounted(() => {
  intervalId = setInterval(() => {
    // ...
  })
})

onUnmounted(() => clearInterval(intervalId))
</script>
```

### onErrorCaptured
捕获后代组件传递错误时调用，callback可以返回一个false组织错误继续向上传递，如果不组织，会传递到`app.config.errorHandler`
``` ts
function onErrorCaptured(callback: ErrorCapturedHook): void

type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
) => boolean | void
```

### onRenderTracked
只在开发模式下可用，组件收集依赖时调用
``` ts
function onRenderTracked(callback: DebuggerHook): void

type DebuggerHook = (e: DebuggerEvent) => void

type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
}
```

### onRenderTriggered
只在开发模式下可用，依赖变更触发组件更新渲染时调用
``` ts
function onRenderTriggered(callback: DebuggerHook): void

type DebuggerHook = (e: DebuggerEvent) => void

type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
}
```

### onActivated
组件实例是 <KeepAlive> 缓存树的一部分，当组件被插入到 DOM 中时调用
``` ts
function onActivated(callback: () => void): void
```

### onDeactivated
组件实例是 <KeepAlive> 缓存树的一部分，当组件从 DOM 中被移除时调用
``` ts
function onDeactivated(callback: () => void): void
```

## 依赖注入
### provide
``` ts
function provide<T>(key: InjectionKey<T> | string, value: T): void
```
``` ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若提供的是非字符串值会导致错误

const foo = inject(key) // foo 的类型：string | undefined
```

### inject
``` ts
// 没有默认值
function inject<T>(key: InjectionKey<T> | string): T | undefined

// 带有默认值
function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

// 使用工厂函数
function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: () => T,
  treatDefaultAsFactory: true
): T
```
``` vue
<script setup>
import { inject } from 'vue'
import { fooSymbol } from './injectionSymbols'

// 注入值的默认方式
const foo = inject('foo')

// 注入响应式的值
const count = inject('count')

// 通过 Symbol 类型的 key 注入
const foo2 = inject(fooSymbol)

// 注入一个值，若为空则使用提供的默认值
const bar = inject('foo', 'default value')

// 注入一个值，若为空则使用提供的工厂函数
const baz = inject('foo', () => new Map())

// 注入时为了表明提供的默认值是个函数，需要传入第三个参数
const fn = inject('function', () => {}, false)
</script>
```

## 宏函数
宏函数不需要导入
### defineProps/withDefaults
``` vue
<script setup lang="ts">
import { type PropType } from 'vue'

type PersonType = {
    name: string
    age: number
}
// 运行时声明
const props = defineProps({
    foo: { type: String, required: true },
    bar: Number,
    person: Object as PropType<PersonType>
})

props.foo // string
props.bar // number | undefined
</script>
```
``` vue
<script setup lang="ts">
import { type PropType } from 'vue'

type PersonType = {
    name: string
    age: number
}
// 泛型参数，基于类型的声明
const props = defineProps<{
    foo: string
    bar?: number
    person: PersonType
}>()
</script>
```
``` vue
<script setup lang="ts">
// 基于类型的声明，缺少默认值的能力
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
</script>
```

### defineEmits
``` vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

### defineExpose
对父组件暴漏属性
``` vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
    a,
    b
})
</script>
```

### useSlots/useAttrs
useSlots 和 useAttrs 是真实的运行时函数，它的返回与 setupContext.slots 和 setupContext.attrs 等价
``` vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

## 参考
- [Vue3中文官网](https://cn.vuejs.org/api/composition-api-setup.html#basic-usage)