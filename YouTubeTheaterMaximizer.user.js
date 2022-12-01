// ==UserScript==
// @name        YouTube Theater Maximizer
// @description Maximizes the YouTube player to fill the entire browser viewport when in theater mode.
// @license     MIT
// @author      Jerryh001
// @icon        http://www.google.com/s2/favicons?domain=youtube.com
// @match       https://www.youtube.com/*
// @version     0.2.1
// @run-at      document-start
// @grant       GM_addStyle
// @namespace   https://github.com/Jerryh001
// @homepageURL https://github.com/Jerryh001/YouTubeTheaterMaximizer
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.slim.min.js
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
        #player-theater-container {
            min-height: 0 !important;
            max-height: 100vh !important;
        }
    `);
    $(document).on("scroll", updateMastheadContainer);
    $(document).on("fullscreenchange", updateMastheadContainer);
    installed = true;
}

function uninstall() {
    $("ytd-app").css("--ytd-masthead-height", "");
    $("ytd-app").attr("masthead-hidden", null);
    $(document).off("scroll", updateMastheadContainer);
    $(document).off("fullscreenchange", updateMastheadContainer);
    installed = false;
}

function updateMastheadContainer() {
    const ytdApp = $("ytd-app");
    ytdApp.css("--ytd-masthead-height", 0);
    if ($(document).scrollTop() == 0) {
        ytdApp.attr("masthead-hidden", true);
    } else {
        ytdApp.attr("masthead-hidden", null);
    }
}

function inWatchPage() {
    return location.pathname == "/watch";
}

$(() => {
    if (window.self === window.top) {
        startScript();
    }
    $(window).on("yt-navigate-finish", startScript);
});
