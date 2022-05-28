
function isNumber(value: any) {
    return typeof value === 'number' && value !== NaN
}

function isString(value:any){
    return typeof value === 'string' 
}

const isObject = (value: any) => objectToString.call(value) === '[object Object]'
const isUndefined = (value: any) => typeof value === 'undefined'

const isFunction = (value: any) => typeof value === 'function'

const objectToString = Object.prototype.toString

function typeOf(value: any) {
    return objectToString.call(value).slice(8, -1).toLowerCase()
}


const isArray = Array.isArray

export {
    isNumber,
    isArray,
    isString,
    isFunction,
    isUndefined,
    isObject,
    typeOf
}