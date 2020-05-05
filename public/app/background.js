
(function() {
    var proxyconfig = {};

    // create listener for focus change - when we switch between chrome windows we need to change the proxy settings
    chrome.windows.onFocusChanged.addListener(function(window) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            try {
            var focustabid = tabs[0].id;
            console.log("focus tab id: " + focustabid);}
            catch(err) {
                return
            }

            if (focustabid in proxyconfig) {
                console.log("found focus tabid in proxyconfig dict")
                console.log(proxyconfig[focustabid])
                chrome.proxy.settings.set(
                    {value: proxyconfig[focustabid], scope: 'regular'},
                    function() {});
            }
            else {
                var directconfig =
                    {
                        mode: "direct"
                    };
                chrome.proxy.settings.set(
                    {value: directconfig, scope: 'regular'},
                    function() {});
            }
        });
    });

    // create listener for tab change - if tab is a proksee tab reload proxy settings, if not direct mode
    chrome.tabs.onActivated.addListener(({tabId, windowId}) =>  {
    console.log("tab activated id: "+ tabId);
    if (tabId in proxyconfig) {
        console.log("found tabid in proxyconfig dict")
        console.log(proxyconfig[tabId])
        chrome.proxy.settings.set(
            {value: proxyconfig[tabId], scope: 'regular'},
            function() {});
    }
    else {
        var directconfig =
            {
                mode: "direct"
            };
        chrome.proxy.settings.set(
            {value: directconfig, scope: 'regular'},
            function() {});
    }
    });
    // create listener for hyperlink click
    chrome.history.onVisited.addListener(function(HistoryItem) {
        // if this is a proksee link, prevent visiting it by closing it and opening a new tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentURL = tabs[0].url;
            console.log("visited hyperlink url: " + currentURL);
            if (HistoryItem.url.includes("&prokseelink")) {
                chrome.tabs.remove(tabs[0].id);
            }
            return;
        });

        // gather proxy info and open incognito tab
        if (HistoryItem.url.includes("&prokseelink")) {
            console.log("this is a proksee link!");
            var newURL = "http://stackoverflow.com/";
            chrome.windows.create({ url: newURL, incognito: true });

            // get our new prokseetab id
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var prokseetab = tabs[0].id;
                console.log("our proksee tab id:" + prokseetab)

                // extract proxy parameters from link
                console.log("clicked url: " + HistoryItem.url)
                const params = new URLSearchParams(HistoryItem.url);

                var proxy_ip = params.get('ip')
                var proxy_port = parseInt(params.get('port'))
                console.log("proxy port: " + proxy_port);
                // change the proxy to the one in the proksee link parameter and
                // save it with the current tabid
            proxyconfig[prokseetab] =
                {
                    mode: "fixed_servers",
                    rules: {
                        singleProxy: {
                            host: proxy_ip,
                            port: proxy_port
                        },
                        bypassList: ["foobar.com"]
                    }

                };
            console.log("our saved proxy info - tabid:", prokseetab)
            console.log(proxyconfig[prokseetab]);
            // change proxy settings
            chrome.proxy.settings.set(
                {value: proxyconfig[prokseetab], scope: 'regular'},
                function() {});
            });
            return;
        };


    });



}());

