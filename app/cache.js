var memoryCache = require('memory-cache'),
    cacheRequest = function (time) {
        cache = function (req, res, next) {
            var url = '__express__' + req.originalUrl || req.url,
                cachedResponse = memoryCache.get(url);

            if (cachedResponse) {
                res.send(cachedResponse);
            }
            else {
                res.sendResponse = res.send;
                res.send = function (html) {
                    memoryCache.put(url, html, time * 1000);
                    res.sendResponse(html);
                };
                next();
            }
        };
        return cache;
    };

module.exports = cacheRequest;