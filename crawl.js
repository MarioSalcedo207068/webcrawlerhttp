const { log } = require('console');
const { JSDOM } = require('jsdom');

async function crawlPage(currentURL){
    console.log(`actively crawling: ${currentURL}`)

    try {
        const resp = await fetch(currentURL)

        if (resp.status >399) {
            console.log(`error in fetch with status code: ${resp.status}, on page ${currentURL}`)
            return
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")) {
            console.log(`non html responde ${contentType}, on page ${currentURL}`)
            return
        }

        console.log(await resp.text())    
    } catch (error) {
        console.log(`error in fetch. ${error.message}, on page ${currentURL}`)
    }
    
    
}



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
    getURLsFromHTML,
    crawlPage
};