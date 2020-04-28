(function() {

    // on hyperlink click open url
    chrome.history.onVisited.addListener(function(HistoryItem) {

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var currentURL = tabs[0].url;
            console.log(currentURL);
            chrome.tabs.remove(tabs[0].id);
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
            return;
        };


    });



}());

//HistoryItem.url == "http://proksee.co/"
// check that we are in proksee site
