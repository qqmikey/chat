let $ = require('jquery');

class Utils {

    ajax(params) {
        return new Promise((resolve, reject) => {
            let data = {
                url: params.url,
                dataType: 'json',
                method: params.method ? params.method : 'get',
                success: function (data) {
                    resolve(data);
                },
                error: function (data) {
                    reject(data);
                }
            };

            if (params.data) {
                data.data = params.data;
            }

            $.ajax(data);
        });
    }

    getQueryObject(location) {
        let params = {},
            search = location.search;
        if (search.indexOf('?') !== -1) {
            let searchString = search.split('?').pop();
            if (searchString) {
                searchString.split('&').forEach((k) => {
                    let key = k.split('=')[0],
                        value = k.split('=')[1];
                    params[key] = value;
                });
            }
        }
        return params;
    }

    getCookie(name, from=null) {
        let cookieString = from ? from : document.cookie;
        let matches = cookieString.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    setCookie(name, value, options) {
        options = options || {};

        let expires = options.expires;

        if (typeof expires == "number" && expires) {
            let d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        let updatedCookie = name + "=" + value;

        for (let propName in options) {
            updatedCookie += "; " + propName;
            let propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }

    deleteCookie(name) {
        setCookie(name, "", {
            expires: -1
        })
    }
}

module.exports = new Utils();