// ==UserScript==
// @name        YouTube Theater Maximizer
// @description Maximizes the YouTube player to fill the entire browser viewport when in theater mode.
// @license     MIT
// @author      Jerryh001
// @icon        http://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match       https://www.youtube.com/*
// @version     0.3.0
// @run-at      document-end
// @grant       GM_addStyle
// @namespace   https://github.com/Jerryh001
// @homepageURL https://github.com/Jerryh001/YouTubeTheaterMaximizer
// @noframes
// ==/UserScript==

let installed = false;

// Install or uninstall full-size player page stylesheet if needed
function startScript() {
    const isWatchPage = inWatchPage();
    if (!isWatchPage && installed) {
        uninstall();
    } else if (isWatchPage && !installed) {
        install();
        updateMastheadContainer();
    }
}

function install() {
    GM_addStyle(`
        #full-bleed-container {
            min-height: 0 !important;
            max-height: 100vh !important;
        }
        #full-bleed-container .ytp-size-button {
            display: none !important;
        }
    `);
    document.addEventListener('scroll', updateMastheadContainer);
    document.addEventListener('fullscreenchange', updateMastheadContainer);
    installed = true;
}

function uninstall() {
    const ytdApp = document.querySelector("ytd-app");
    if (ytdApp) {
        ytdApp.style.setProperty("--ytd-masthead-height", "");
        ytdApp.removeAttribute("masthead-hidden");
    }

    document.removeEventListener('scroll', updateMastheadContainer);
    document.removeEventListener('fullscreenchange', updateMastheadContainer);
    installed = false;
}

function updateMastheadContainer() {
    const ytdApp = document.querySelector("ytd-app");
    if (ytdApp) {
        ytdApp.style.setProperty("--ytd-masthead-height", "0");
        if (document.documentElement.scrollTop === 0) {
            ytdApp.setAttribute("masthead-hidden", "true");
        } else {
            ytdApp.removeAttribute("masthead-hidden");
        }
    }
}

function inWatchPage() {
    return location.pathname == "/watch";
}

startScript();

window.addEventListener("yt-navigate-finish", startScript);
