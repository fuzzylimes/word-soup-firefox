/*
Author: fuzzylimes
Created: 12/27/2018
Last: 12/27/2018
*/

const PURPLE = '#6B459A';
const GRAY = '#777';

function turnOn() {
    updateBadge('on', PURPLE);
    reload();
}

function turnOff() {
    updateBadge('off', GRAY);
    reload();
}

function updateBadge(text, color) {
    browser.browserAction.setBadgeText({ 'text': text });
    browser.browserAction.setBadgeBackgroundColor({ 'color': color });
}

// Reload the current tab
function reload() {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.reload(tabs[0].id);
    });
}

// Set badge on startup
updateBadge('?', GRAY);

// Check whether new version is installed
browser.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        browser.storage.local.set({ 'state': false, 'rules': {} });
        turnOff();
    } else if (details.reason == "update") {
        var thisVersion = browser.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

// Handle current state on startup
browser.runtime.onStartup.addListener(function() {
    browser.storage.local.get('state', (data) => {
        let state = data['state'];
        if (state) {
            turnOn();
        } else {
            turnOff();
        }
    })
})

// Handle events from popup
browser.runtime.onMessage.addListener(function(request, sender) {
    if(request.state) {
        turnOn();
    } else {
        turnOff();
    }
});
