export function encryptPhone(str) {
    if (null !== str && str !== undefined) {
        var pat = /(\d{3})\d*(\d{2})/;
        return str.replace(pat, '$1****$2');
    } else {
        return "";
    }
}

export function encryptIdNo(str) {
    if (null !== str && str !== undefined) {
        var pat = /(\d{4})\d*(\d{4})/;
        return str.replace(pat, '$1***********$2');
    } else {
        return "";
    }
}

export function encryptName(str) {
    if (null !== str && str !== undefined) {
        if (str.length <= 3) {
            return "*" + str.substring(1, str.length);
        } else if (str.length > 3 && str.length <= 6) {
            return "**" + str.substring(2, str.length);
        } else if (str.length > 6) {
            return str.substring(0, 2) + "****" + str.substring(6, str.length)
        }
    } else {
        return "";
    }
}

export function encryptEmail(email) {
    let new_email = email;
    if (String(email).indexOf('@') > 0) {
        let str = email.split('@');
        let _s = '';
        if (str[0].length > 3) { //@前面多于3位
            for (let i = 3; i < str[0].length; i++) {
                _s += '*';
            }
            new_email = str[0].substr(0, 3) + _s + '@' + str[1];
        } else { //@前面小于等于于3位
            for (let i = 1; i < str[0].length; i++) {
                _s += '*'
            }
            new_email = str[0].substr(0, 1) + _s + '@' + str[1]
        }
    }
    return new_email;
}