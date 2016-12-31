"use strict";

(function (window, performance) {
    /**
     * basic configuration
     */
    var url = '/perf';

    /**
     * setup performance monitoring
     */
    window.addEventListener('load', function setup() {
        window.removeEventListener("load", setup, false);
        // give Chrome 100ms to prepare window.chrome.loadTimes
        window.setTimeout(analyzePageLoad, 100);
        window.setInterval(analyzeXhrLoad, 1000);
        analyzeXhrLoad();
    });

    /**
     * gather and calculate page load performance data
     */
    function analyzePageLoad() {
        var t = performance.timing;
        var entry = {
            timeToFirstByte       : t.responseStart - t.navigationStart,
            timeToConnect         : t.connectStart - t.fetchStart,
            timeToDomContentLoaded: t.domContentLoadedEventStart - t.domLoading,
            timeToDomInteractive  : t.domInteractive - t.domLoading,
            timeToDomOnLoad       : t.loadEventStart - t.domLoading,
            timeToFirstPaint      : getFirstPaintTime()
        };
        transmit('page', entry);
    }

    /**
     * gather and calculate ajax performance data
     */
    function analyzeXhrLoad() {
        var entries = getXhrPerformanceEntries().map(function (e) {
            return {
                url            : e.name,
                timeToFirstByte: Math.round(e.responseStart - e.startTime),
                timeToConnect  : Math.round(e.connectStart - e.fetchStart),
                timeToOnLoad   : Math.round(e.duration)
            };
        });
        if (entries.length) {
            transmit('ajax', entries);
        }
    }

    /**
     * determine time to first paint
     */
    function getFirstPaintTime() {
        var t = performance.timing;
        var paintTime = null;
        // Chrome (and probably Opera)
        if (window.chrome && window.chrome.loadTimes) {
            var ct = window.chrome.loadTimes();
            var paintTimeStamp = Math.round(ct.firstPaintTime * 1000);
            paintTime = paintTimeStamp - t.navigationStart;
        }
        // Internet Explorer
        else if (typeof t.msFirstPaint === 'number') {
            paintTime = t.msFirstPaint - t.navigationStart;
        }
        return paintTime;
    }

    /**
     * procure and filter xhr performance data
     */
    function getXhrPerformanceEntries() {
        var xhrEntries = [];
        if ('getEntriesByType' in performance) {
            var allEntries = performance.getEntriesByType('resource');
            if (allEntries.length) {
                performance.clearResourceTimings();
                xhrEntries = allEntries.filter(function (entry) {
                    var isXhr = entry.initiatorType === 'xmlhttprequest';
                    var isOwn = entry.name.match(new RegExp(url + '$'));
                    return isXhr && !isOwn;
                });
            }
        }
        return xhrEntries;
    }

    /**
     * send data to some backend server (using cors)
     */
    function transmit(type, data) {
        var xhr = new XMLHttpRequest();
        if ('withCredentials' in xhr) {
            xhr.open('POST', url);
        } else if (typeof XDomainRequest !== 'undefined') {
            xhr = new XDomainRequest();
            xhr.open('POST', url);
        } else {
            xhr = null;
        }
        if (xhr) {
            // json sent as text/plain to make dealing with cors easier
            // xhr.send(JSON.stringify({ type: type, data: data }));
            if (console && console.log) {
                console.log(type, JSON.stringify(data));
            }
        }
    }
})(global, global.performance);
