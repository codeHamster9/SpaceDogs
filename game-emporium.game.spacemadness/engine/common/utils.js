//'use strict';

var common = {};

common.utils = {

    timeNow: function () {
        var date = new Date();
        return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() <
            10) ? "0" : "") + date.getMinutes() + ":" + ((date.getSeconds() < 10) ? "0" : "") +
            date.getSeconds() + ":" + ((date.getMilliseconds() < 100) ? ((date.getMilliseconds() <
                    10) ? "00" + date.getMilliseconds() : "0" + date.getMilliseconds()) :
                date.getMilliseconds());
    },
    getCenterPoint: function (object) {
        return {
            x: (object.x + (object.width / 2)),
            y: (object.y + (object.height / 2))
        };
    },
    getUrlVars: function () {
        var vars = [],
            hash,
            hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'),
            i;
        for (i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
};
