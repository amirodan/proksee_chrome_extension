(function() {

    // on hyperlink click start listener
    chrome.history.onVisited.addListener(function(HistoryItem) {
        // get the tab that was opened (current tab) and close it
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentURL = tabs[0].url;
            console.log(currentURL);
            if (HistoryItem.url.includes("?prokseelink")) {
                chrome.tabs.remove(tabs[0].id);
            }
            return;
            //if (currentURL = "https://proksee.co/") {
            //    console.log("we are in proksee site");
            //    return;

        });
        // on url click gather proxy info and open incognito tab
        if (HistoryItem.url.includes("?prokseelink")) {
            console.log("this is a proksee link!");
            var newURL = "http://stackoverflow.com/";
            chrome.tabs.create({ url: newURL });
            // change the proxy to the one in the link parameter
            var config = {
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
            chrome.proxy.settings.set(
                {value: config, scope: 'regular'},
                function() {});
            // save the tab id and the proxy data in a dictionary - when we switch tabs we want to change the proxy settings
            return;
        };


    });



}());

