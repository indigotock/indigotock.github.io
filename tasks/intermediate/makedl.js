function makedl(data) {
    var dl = document.createElement('dl')
    let arraymode = (Array.isArray(data))
    let tagtype = 'dd'
    if (arraymode) {
        dl = document.createElement('ol')
        tagtype = 'li'
    }
    for (var key in data) {
        if (!arraymode) {
            let dt = document.createElement('dt')
            if (!isNaN(+key)) {
                dt.textContent = Number(key) + 1
            } else
                dt.textContent = key + ':'
            dl.appendChild(dt)
        }
        if (data.hasOwnProperty(key)) {
            let dd = document.createElement(tagtype)
            var element = data[key];
            if (typeof (element) == 'object') {
                dd.appendChild(makedl(element))
            } else {
                dd.textContent = element
            }
            dl.appendChild(dd)
        }
    }
    return dl
}