
(function() {
    var proxyconfig = {};

    // create listener for tab change - if tab is a proksee tab reload proxy settings, if not direct mode
    chrome.tabs.onActivated.addListener(({tabId, windowId}) =>  {
    console.log(tabId);
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
        // if this is a proksee link, get the tab that was opened (current tab) and close it
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentURL = tabs[0].url;
            console.log(currentURL);
            if (HistoryItem.url.includes("?prokseelink")) {
                chrome.tabs.remove(tabs[0].id);
            }
            return;
        });

        // on url click gather proxy info and open incognito tab
        if (HistoryItem.url.includes("?prokseelink")) {
            console.log("this is a proksee link!");
            var newURL = "http://stackoverflow.com/";
            chrome.tabs.create({ url: newURL });

            // get our new prokseetab id
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var prokseetab = tabs[0].id;

            // change the proxy to the one in the proksee link parameter and
                // save it with the current tabid
            proxyconfig[prokseetab] =
                {
                    mode: "fixed_servers",
                    rules: {
                        proxyForHttp: {
                            scheme: "http",
                            host: "127.0.0.1",
                            port: 8080
                        },
                        bypassList: ["foobar.com"]
                    }

                };
            console.log("our saved proxy info - tabid:", prokseetab)
            console.log(proxyconfig[prokseetab]);
            // change proxy settings to gathered proxy info
            chrome.proxy.settings.set(
                {value: proxyconfig[prokseetab], scope: 'regular'},
                function() {});
            });
            return;
        };


    });



}());

