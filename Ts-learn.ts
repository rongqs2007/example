// splice 方法用于添加或删除数组的元素，其会改变原始数组
let arrA: string[] = ['1', '2', '3', '4']
let arrB: string[] = ['1', '2', '3', '4']
let _arrDelete = arrA.splice(2, 1)
let _arrAdd = arrB.splice(2, 1, '5', '9')
console.log(arrA)
console.log(arrB)
console.log(_arrAdd)

// slice 方法可以从已有的数组中返回选定的元素，还可提取字符串的某个部分，返回被提取的部分，其不会改变原始数组
// arr.slice(start, end)
// start--可选。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。
// end--可选。规定从何处结束选取。该参数是数组片断结束处的数组下标。如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。

// 包含start不包含end
let fruits: string[] = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango']
console.log(fruits.slice(2, 4)) // ['Lemon', 'Apple']
console.log(fruits.slice(-4, -2)) // ['Orange', 'Lemon']

// js原型继承——所有JavaScript的内置构造函数都是继承自Object.prototype
// 对象没有数组Array.prototype的属性
// 数组具有一个最基本特征：索引，这是对象所没有的
let obj: any = {}
let arr: any = []
obj[2] = 'a'
arr[2] = 'a'
console.log(obj[2]) // obj[2]输出’a’，是因为对象就是普通的键值对存取数据
console.log(obj.length) // obj.length并不具有数组的特性，并且obj没有保存属性length，那么自然就会输出undefined
console.log(arr[2]) // arr[2]输出’a’，数组是通过索引来存取数据，arr[2]之所以输出’a’，是因为数组arr索引2的位置已经存储了数据
console.log(arr.length) // 对于数组来说，length是数组的一个内置属性，数组会根据索引长度来更改length的值 为什么arr.length输出3，而不是1
// 在给数组添加元素时，并没有按照连续的索引添加，所以导致数组的索引不连续，那么就导致索引长度大于元素个数


// 伪数组——就是像数组一样有 length 属性，也有 0、1、2、3 等属性的对象，看起来就像数组一样，但不是数组
// 伪数组是一个 Object，而真实的数组是一个 Array。
// 伪数组存在的意义，是可以让普通的对象也能正常使用数组的很多方法
// 对象没有数组 Array.prototype 的属性值，类型是 Object ，而数组类型是 Array
// 数组是基于索引的实现， length 会自动更新，而对象是键值对
// 使用对象可以创建伪数组，伪数组可以正常使用数组的大部分方法
let fakeArray: any = {
	'0': 'first',
	'1': 'second',
	'2': 'third',
	length: 3
}
for (let i = 0; i < fakeArray.length; i++) {
	console.log(fakeArray[i])
}
// join() 方法：把数组的所有元素放入一个字符串。元素通过指定的分隔符进行分隔。
// call() 方法可以用来代替另一个对象调用一个方法。
Array.prototype.join.call(fakeArray, '+')
console.log(Array.prototype.join.call(fakeArray, '+'))

// 拆机理解

let fn = Array.prototype.join // 把方法添加为属性

fn.call(fakeArray,",") // 转变为方法调用！！！
// 常见的伪数组有：
// 函数内部的 arguments
// DOM 对象列表（比如通过 document.getElementsByTags 得到的列表）
// jQuery 对象（比如 $("div") ）

// js闭包
// 创建闭包最常见的方式--函数作为返回值
function foo　() {
	let name: string = 'tom'
	return function () {
		console.log(name)
	}
}
let bar = foo()
bar() // 外部函数访问内部变量


// 计数器闭包实现原理
function addCount () {
	let count: number = 0
	return function () {
		count += 1
		console.log(count)
	}
}
let add1 = addCount()
add1()
add1()
add1()

let add2 = addCount()
add2()
add2()

// 过程: addCount() 执行的时候, 返回一个函数, 函数是可以创建自己的作用域的, 但是此时返回的这个函数内部需要引用 addCount() 作用域下的变量 count, 
// 因此这个 count 是不能被销毁的.接下来需要几个计数器我们就定义几个变量就可以,并且他们都不会互相影响,每个函数作用域中还会保存 count 变量不被销毁,进行不断的累加

// for 循环中的打印
// 声明变量的方式为var的话打印都为4，如果是let，则为0,1,2,3
for (var i = 0; i < 4; i++) {
	setTimeout(() => {
		// console.log('打印', i)
	}, 300)
}


// 扩展运算符...
// 1.可变参数个数的函数调用
function add (...vals: any[]) {
	let sum: number = 0
	for (let item of vals) {
		sum += item
	}
	return sum
}
let arrC: number[] = [1, 2, 3, 4, 5, 6]
let _addSum = add(...arrC)
console.log(_addSum)

// 2.更便捷的数组合并,没有去重的作用
let arrD: number[] = [3, 9]
let arrE: number[] = [8, 6, 9]
let arrF: number[] = [55]
let newArr = [...arrF, ...arrE, ...arrD]
// arrE.push(...arrD) // 将一个数组添加到另一个数组的尾部
// ES5的写法
Array.prototype.push.apply(arrE, arrD)
console.log(newArr)
console.log('=====', arrE)

// 3.替代es5的apply方法
// 求数组最大值
Math.max.apply(null, arrC) // ES5的写法
Math.max(...arrC) // ES6的写法， 等同于Math.max(1, 2, 3, 4, 5, 6)

//4.与解构赋值结合，生成新数组
const [first, ...rest] = [1, 2, 3, 4, 5]
console.log(first)
console.log(rest)
// const [num1, ...rest2] = []
// num1 => 输出undefined
// rest2 => 输出[]

const [num1, ...rest2] = ['foo']
console.log(num1) // foo
console.log(rest2) // []

// 5.将字符串转为真正的数组
let str: string = 'hello'
// [...'hello'] ts文件中会报错 但在浏览器控制台正常

// 6.将实现了 Iterator 接口的对象转为数组
let nodeList = document.querySelectorAll('div')
let array = [...nodeList]
