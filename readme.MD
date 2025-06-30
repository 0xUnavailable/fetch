Selective Web Scraper
A flexible Node.js web scraping tool built with Axios and Cheerio to extract specific HTML elements from websites and save results in CSV format. Designed for developers to experiment with web scraping and CSS selectors in a powerful yet playful way.
Features

Selective Extraction: Target specific HTML elements using CSS selectors (e.g., h1, .class-name, [data-attribute]).
Output Modes:
Separate Mode: Each element saved as a separate CSV row.
Combined Mode: All elements for a URL combined into one row.


Text-Only Option: Extract only text content for minimal output.
Attribute Extraction:
Links (<a>): href, title, target
Images (<img>): src, alt, width, height
Form elements (<input>, <textarea>, <select>): type, name, value, placeholder
Meta tags (<meta>): name, property, content
Common attributes: id, class


Multiple URLs: Scrape multiple URLs with configurable delays to respect server limits.
Error Handling: Robust handling for failed requests or invalid selectors.
CSV Output: Save cleaned data to timestamped CSV files.
CLI Interface: Simple command-line interface with clear instructions.
Modular Design: Usable as a Node.js module for integration into other projects.

Installation

Ensure Node.js (v18 or higher) is installed.
Install dependencies:npm install axios cheerio


Save the code in a file (e.g., scraper.js).

Usage
Command-Line Interface
Run the scraper:
node scraper.js <URL> [selectors...] [options]

Examples

Basic Scraping (default elements: h1, h2, p, a):
node scraper.js https://example.com


Specific Selectors:
node scraper.js https://example.com h1 p ".product-title" "a[href]"


Text-Only Mode:
node scraper.js https://example.com --text-only h1 p


Combined Mode:
node scraper.js https://example.com --combined h1 p a



Common Selectors

Headings: h1, h2, h3
Paragraphs: p
Links: a, a[href]
Images: img
Classes: .class-name
IDs: #id-name
Data attributes: [data-attribute]

Options

--combined: Combine all elements into one row per URL.
--text-only: Save only URL, selector, and text content.

As a Module
Use in a Node.js project:
const SelectiveWebScraper = require('./scraper.js');
const scraper = new SelectiveWebScraper();

async function example() {
  // Single URL
  const data = await scraper.scrapeUrl('https://example.com', ['h1', 'p']);
  scraper.displayResults(data);
  await scraper.saveToCsv([data], 'output.csv');

  // Multiple URLs
  const urls = ['https://example.com', 'https://example.org'];
  const results = await scraper.scrapeMultipleUrls(urls, ['h1', 'p'], { delay: 1000 });
  await scraper.saveToCsv(results, 'multiple_output.csv', 'combined');
}

example();

Output

Console: Summarizes scraped data (URL, page title, up to 5 elements per selector with truncated text).
CSV: Saves to a timestamped file (e.g., scraped_selective_separate_2025-06-30T14-07-00.csv):
Separate Mode: Columns for URL, timestamp, page title, selector, element index, tag name, text, HTML, and attributes.
Combined Mode: Columns for URL, timestamp, page title, and concatenated text/attributes per selector.
Text-Only Mode: Columns for URL, selector, and text content.



Use Cases

Content Analysis: Extract headings or links for SEO or summarization.
Data Collection: Scrape product details or reviews from e-commerce sites.
Research: Gather titles or abstracts from articles or blogs.
Monitoring: Track changes in website elements over time.
Form Analysis: Extract form field attributes for accessibility studies.
Link Extraction: Collect links for auditing or crawling.

Notes

Rate Limiting: Use the delay option in scrapeMultipleUrls to avoid server overload.
Selectors: Use valid CSS selectors (e.g., .class-name, [data-id="value"]).
Error Handling: Invalid URLs or selectors are logged without crashing.
CSV Output: Text is cleaned (newlines removed, quotes escaped).
Dependencies: Requires axios, cheerio, and fs.

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature/YourFeature
Commit changes: git commit -m 'Add YourFeature'
Push to the branch: git push origin feature/YourFeature
Open a pull request.

License
MIT License
