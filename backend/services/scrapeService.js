const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { convert } = require('html-to-text');

/**
 * Service to scrape job descriptions from URLs
 */
const ScrapeService = {
    /**
     * Scrapes a URL and returns the main text content
     * @param {string} url - The URL to scrape
     * @returns {Promise<{title: string, content: string, text: string}>}
     */
    scrapeJobDescription: async (url) => {
        try {
            // 1. Fetch the HTML
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9'
                },
                timeout: 10000
            });

            const html = response.data;

            // 2. Parse with JSDOM
            const dom = new JSDOM(html, { url });
            const doc = dom.window.document;

            // 3. Extract with Readability
            const reader = new Readability(doc);
            const article = reader.parse();

            if (!article || !article.textContent) {
                // Heuristic Fallback: Get text from body if readability fails
                const bodyText = convert(html, {
                    wordwrap: 130,
                    selectors: [
                        { selector: 'nav', format: 'skip' },
                        { selector: 'footer', format: 'skip' },
                        { selector: 'script', format: 'skip' },
                        { selector: 'style', format: 'skip' },
                        { selector: 'header', format: 'skip' }
                    ]
                });

                return {
                    title: doc.title || 'Scraped Job Description',
                    content: html,
                    text: bodyText || 'Failed to extract meaningful text content.'
                };
            }

            // 4. Return HTML content primarily for high-fidelity preview
            // We can still provide a text version as a fallback or for other uses
            return {
                title: article.title,
                content: article.content, // HTML from Readability
                text: article.textContent, // Plain text from Readability
                byline: article.byline,
                siteName: article.siteName
            };

        } catch (error) {
            console.error(`Scraping Error for ${url}:`, error.message);
            throw new Error(`Failed to scrape job description: ${error.message}`);
        }
    }
};

module.exports = ScrapeService;
