function getchar(s, x, y) {
    let l = s.length - 1
    if (x % l != 0 && y % l != 0)
        return ' '
    let ind = (x + y) % (l * 2)
    if (ind > l)
        ind = l * 2 - ind
    return s[ind]
}