// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('LinkedIn Message Rephraser Extension Installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'check_status') {
    sendResponse({ status: 'Extension is active and running' });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('linkedin.com')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js'],
    });
  }
});
