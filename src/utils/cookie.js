export function getCookie(name) {
    if (typeof name === 'string' && name !== '') {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return arr[2] ? decodeURIComponent(arr[2]) : null;
        }
    }
    return null;
}

export function setCookie(name, value, seconds) {
    var date = new Date();
    date.setTime(date.getTime + seconds * 1000);
    var expires = "expires=" + date.toGMTString();
    document.cookie = name + "=" + value + "; " + expires;
}