var UnicodeString = (function () {
    function surrogatePairToCodePoint(charCode1, charCode2) {
        return ((charCode1 & 0x3FF) << 10) + (charCode2 & 0x3FF) + 0x10000;
    }

    function stringToCodePointArray(str) {
        var codePoints = [],
            i = 0,
            charCode;
        while (i < str.length) {
            charCode = str.charCodeAt(i);
            if ((charCode & 0xF800) == 0xD800) {
                codePoints.push(surrogatePairToCodePoint(charCode, str.charCodeAt(++i)));
            } else {
                codePoints.push(charCode);
            }
            ++i;
        }
        return codePoints;
    }

    function codePointArrayToString(codePoints) {
        var stringParts = [];
        for (var i = 0, len = codePoints.length, codePoint, offset, codePointCharCodes; i < len; ++i) {
            codePoint = codePoints[i];
            if (codePoint > 0xFFFF) {
                offset = codePoint - 0x10000;
                codePointCharCodes = [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)];
            } else {
                codePointCharCodes = [codePoint];
            }
            stringParts.push(String.fromCharCode.apply(String, codePointCharCodes));
        }
        return stringParts.join("");
    }

    function UnicodeString(arg) {
        if (this instanceof UnicodeString) {
            this.codePoints = (typeof arg == "string") ? stringToCodePointArray(arg) : arg;
            this.length = this.codePoints.length;
        } else {
            return new UnicodeString(arg);
        }
    }

    UnicodeString.prototype = {
        slice: function (start, end) {
            return new UnicodeString(this.codePoints.slice(start, end));
        },

        toString: function () {
            return codePointArrayToString(this.codePoints);
        },

        at: function (ind) {
            return String.fromCodePoint(this.codePoints[ind])
        }
    };


    return UnicodeString;
})();