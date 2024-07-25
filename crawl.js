const { JSDOM } = require('jsdom');

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for (const linkElement of linkElements) {
        try {
            let urlObj;
            if (linkElement.href.startsWith('/')) {
                // relative
                urlObj = new URL(linkElement.href, baseURL);
            } else {
                // absolute
                urlObj = new URL(linkElement.href);
            }
            urls.push(urlObj.href);
        } catch (error) {
            console.log(`error with url: ${error.message}`);
        }
    }
    return urls;
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    return hostPath.endsWith('/') ? hostPath.slice(0, -1) : hostPath;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
};