let normalform = function (str) {
    // Replace each capital with the captured character after a space
    // Then uppercase the first character
    return str.replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
}

function makedl(data, keymeta) {
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
            } else {
                let newkey = key
                if (keymeta && keymeta[key])
                    newkey = keymeta[key]
                dt.textContent = normalform(newkey) + ':'
            }
            dl.appendChild(dt)
        }
        if (data.hasOwnProperty(key)) {
            let dd = document.createElement(tagtype)
            var element = data[key];
            if (typeof (element) == 'object') {
                dd.appendChild(makedl(element, keymeta))
            } else {
                dd.textContent = element
            }
            dl.appendChild(dd)
        }
    }
    return dl
}