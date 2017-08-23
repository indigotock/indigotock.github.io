let rev = function (s) {
    let x = s.split('')
    x.reverse()
    return x.join('')
}

function getchar(s, x, y) {
    s = rev(s)
    let l = s.length - 1
    if (x % l != 0 && y % l != 0)
        return ' '


    let ind = 0
    let axis = x
    if (axis % l == 0)
        axis = y

    ind = Math.abs(l - (axis % l))

    if ((axis % (l * 2)) > l)
        s = rev(s)

    let ret = s[ind] || '?'
    if (ret == '?')
        console.log(x, y, axis, ind)
    return ret
}