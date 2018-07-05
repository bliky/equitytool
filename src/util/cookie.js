/**
 * cookiey方法封装
 * 2017-11-14
 */

// 设置cookie
const setCookie = (name, value) => {
    let Days = 30
    let exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=/;`
}

// 读取cookie
const getCookie = name => {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    let arr = document.cookie.match(reg)
    if (arr) {
        return unescape(arr[2])
    } else {
        return null
    }
}

// 删除cookie
const removeCookie = name => {
    let exp = new Date()
    exp.setTime(exp.getTime() - 100)
    let cval = getCookie(name)
    if (cval !== null) {
        document.cookie = `${name}=${cval};expires=${exp.toGMTString()};`
    }
}

// 导出所有方法
export default {
    setCookie: setCookie,
    getCookie: getCookie,
    removeCookie: removeCookie,
}

