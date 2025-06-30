Selective Web Scraper
A flexible and powerful Node.js web scraping tool built with Axios and Cheerio, designed to extract specific HTML elements from websites and save the results in CSV format.
Features

Selective Element Extraction: Scrape specific HTML elements using CSS selectors (e.g., h1, .class-name, [data-attribute]).
Customizable Output: Save data in two modes:
Separate Mode: Each element is saved as a separate row in the CSV.
Combined Mode: All elements for a URL are combined into a single row.


Text-Only Option: Extract only text content for minimal output.
Attribute Extraction: Capture specific attributes for different HTML elements:
Links (<a>): href, title, target
Images (<img>): src, alt, width, height
Form elements (<input>, <textarea>, <select>): type, name, value, placeholder
Meta tags (<meta>): name, property, content
Common attributes: id, class


Multiple URL Support: Scrape multiple URLs with configurable delays to respect server limits.
Error Handling: Robust error handling for failed requests or invalid selectors.
CSV Output: Save scraped data to a timestamped CSV file with cleaned and formatted content.
CLI Interface: Easy-to-use command-line interface with detailed usage instructions.
Modular Design: Exportable as a Node.js module for integration into other projects.

Installation

Ensure Node.js is installed.
Install dependencies:

npm install axios cheerio


Save the code in a file (e.g., scraper.js).

Usage
Command-Line Interface
Run the scraper from the command line:
node scraper.js <URL> [selectors...] [options]

Examples

Basic Scraping (scrape default elements: h1, h2, p, a):

node scraper.js https://example.com


Specific Selectors (scrape specific elements):

node scraper.js https://example.com h1 p ".product-title" "a[href]"


Text-Only Mode (minimal output with only text content):

node scraper.js https://example.com --text-only h1 p


Combined Mode (one row per URL):

node scraper.js https://example.com --combined h1 p a

Common Selectors

h1, h2, h3: Headings
p: Paragraphs
a: All links
a[href]: Links with href attribute
img: Images
.class-name: Elements with a specific class
#id-name: Element with a specific ID
[data-attribute]: Elements with data attributes

Options

--combined: Save all elements in a single row per URL.
--text-only: Save only URL, selector, and text content (excludes attributes like href, src, etc.).

As a Module
const SelectiveWebScraper = require('./scraper.js');
const scraper = new SelectiveWebScraper();

async function example() {
  // Scrape a single URL
  const data = await scraper.scrapeUrl('https://example.com', ['h1', 'p']);
  scraper.displayResults(data);
  await scraper.saveToCsv([data], 'output.csv');

  // Scrape multiple URLs
  const urls = ['https://example.com', 'https://example.org'];
  const results = await scraper.scrapeMultipleUrls(urls, ['h1', 'p'], { delay: 1000 });
  await scraper.saveToCsv(results, 'multiple_output.csv', 'combined');
}

example();

Output

Console Output: Displays a summary of scraped data, including URL, page title, and up to 5 elements per selector (with truncation for long text).
CSV Output: Saves data to a timestamped CSV file (e.g., scraped_selective_separate_2025-06-30T12-53-00.csv) with columns based on the mode:
Separate Mode: Includes URL, timestamp, page title, selector, element index, tag name, text content, HTML content, and relevant attributes.
Combined Mode: Includes URL, timestamp, page title, and concatenated text/attributes for each selector.
Text-Only Mode: Includes only URL, selector, and text content.



Potential Use Cases

Content Analysis: Extract headings, paragraphs, or links for content summarization or SEO analysis.
Data Collection: Gather product information, prices, or reviews from e-commerce websites.
Research: Scrape academic articles, news sites, or blogs for specific elements like titles or abstracts.
Monitoring: Track changes in specific website elements over time.
Form Analysis: Extract form field attributes for web accessibility or usability studies.
Link Extraction: Collect all links or specific link types for crawling or auditing purposes.

Notes

Rate Limiting: Use the delay option in scrapeMultipleUrls to avoid overwhelming servers.
Selector Syntax: Use valid CSS selectors (e.g., .class-name, [data-id="value"]).
Error Handling: Invalid URLs or selectors are caught and logged without crashing.
File Output: CSV files are saved with cleaned text (newlines removed, quotes escaped).
Dependencies: Requires axios for HTTP requests, cheerio for HTML parsing, and fs for file output.

License
MIT License