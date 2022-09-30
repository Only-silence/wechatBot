// 判断一个对象是否包含另一个对象
let contains = (a, b) => Object.entries(b).every(([k, v]) => a[k] === v)

export {contains}