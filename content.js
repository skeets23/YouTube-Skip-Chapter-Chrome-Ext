let timeStampRegex = /(\d+:)?\d+:\d\d/;
let currentChapter = "";
chrome.storage.local.get(["options"], function (result) {
    var options = JSON.parse(result.options);

    setInterval(function () {
        let newChapter = document.getElementsByClassName("ytp-chapter-title-content")[0].textContent.toLowerCase();

        if (newChapter === currentChapter) {
            return true;
        }

        currentChapter = newChapter;

        if (hasSkipWord(currentChapter, options.regex, options.skip_words)) {
            currentChapter = "";
            goNextChapter();
        }
    }, 3000);
});

function hasSkipWord(url, regex, skipWords) {
    skipWords = skipWords.split("\n");
    var skipWordFound = false;
    skipWords.forEach(function (skipWord) {
        skipWord = skipWord.trim();
        if (skipWord.length < 1) {
            return true;
        }
        if (regex) {
            var re = new RegExp(skipWord, "gi");
            if (re.test(url)) {
                skipWordFound = true;
            }
        } else {
            if (url.toLowerCase().includes(skipWord.toLowerCase())) {
                skipWordFound = true;
            }
        }
    });
    return skipWordFound;

}

function goNextChapter() {
    var seconds = getNextChapterSeconds();
    var javascript = 'document.getElementById("movie_player").seekTo(' + seconds + ');';
    var script = document.createElement('script');
    script.textContent = javascript;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

function getNextChapterSeconds() {
    let currentTime = document.querySelector("span.ytp-time-current").textContent;
    let currentSeconds = getSeconds(currentTime);

    for (let i of document.querySelectorAll("yt-formatted-string.content a")) {
        let timeStampText = i.text;

        if (timeStampRegex.test(timeStampText)) {
            let output = getSeconds(timeStampText);
            if (output > currentSeconds) {
                return output;
            }
            i++;
        }
    }
    return 99999999;
}

function getSeconds(timeStampText) {

    if (timeStampRegex.test(timeStampText)) {
        let times = timeStampText.split(":");

        if (times.length === 3) {
            return (parseInt(times[0]) * 3600) + (parseInt(times[1]) * 60) + parseInt(times[2]);
        } else if (times.length === 2) {
            return (parseInt(times[0]) * 60) + parseInt(times[1]);
        } else {
            return parseInt(times[0]);
        }
    }
    console.log("error, unrecognized timestamp: " + timeStampText);
}
