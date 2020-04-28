(function() {

    // on hyperlink click start listener
    chrome.history.onVisited.addListener(function(HistoryItem) {
        // get the tab that was opened and close it
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
            return;
        };


    });



}());

//HistoryItem.url == "http://proksee.co/"
// check that we are in proksee site
