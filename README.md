Here’s a clean, professional, and properly formatted version of your **README.md** file for the **Selective Web Scraper** project. This version uses proper markdown styling, consistent formatting, and improved readability:

---

# 🕷️ Selective Web Scraper

A flexible Node.js web scraping tool built with **Axios** and **Cheerio** to extract specific HTML elements and export them to CSV format. Perfect for developers experimenting with web scraping and CSS selectors.

---

## 🚀 Features

* **Selective Extraction**
  Target specific HTML elements using CSS selectors (e.g., `h1`, `.class-name`, `[data-attribute]`).

* **Output Modes**

  * **Separate Mode**: Each element saved as a separate CSV row.
  * **Combined Mode**: All elements from a URL saved into one row.

* **Text-Only Option**
  Extract only text content for minimal CSV output.

* **Attribute Extraction**
  Automatically extract relevant attributes:

  * Links (`<a>`): `href`, `title`, `target`
  * Images (`<img>`): `src`, `alt`, `width`, `height`
  * Form elements (`<input>`, `<textarea>`, `<select>`): `type`, `name`, `value`, `placeholder`
  * Meta tags (`<meta>`): `name`, `property`, `content`
  * Common attributes: `id`, `class`

* **Multiple URLs Support**
  Scrape multiple URLs with configurable delays to avoid rate-limiting.

* **Robust Error Handling**
  Handles failed requests or invalid selectors gracefully.

* **CSV Output**
  Cleaned, timestamped CSV file output.

* **CLI Interface**
  Simple command-line usage with helpful options.

* **Modular Design**
  Usable as a Node.js module in other projects.

---

## 📦 Installation

1. Ensure **Node.js (v18 or higher)** is installed.

2. Install required dependencies:

   ```bash
   npm install axios cheerio
   ```

3. Save the code in a file (e.g., `scraper.js`).

---

## 🛠️ Usage

### 📌 CLI Mode

```bash
node scraper.js <URL> [selectors...] [options]
```

### 🧪 Examples

* **Basic Scraping** (default selectors: `h1`, `h2`, `p`, `a`):

  ```bash
  node scraper.js https://example.com
  ```

* **Specific Selectors**:

  ```bash
  node scraper.js https://example.com h1 p ".product-title" "a[href]"
  ```

* **Text-Only Mode**:

  ```bash
  node scraper.js https://example.com --text-only h1 p
  ```

* **Combined Mode**:

  ```bash
  node scraper.js https://example.com --combined h1 p a
  ```

---

## 🎯 Common Selectors

| Purpose    | Selector Example   |
| ---------- | ------------------ |
| Headings   | `h1`, `h2`, `h3`   |
| Paragraphs | `p`                |
| Links      | `a`, `a[href]`     |
| Images     | `img`              |
| Class      | `.class-name`      |
| ID         | `#id-name`         |
| Data Attr  | `[data-attribute]` |

---

## ⚙️ Options

* `--combined`: Combine all selectors into one row per URL.
* `--text-only`: Extract only text content (no HTML or attributes).

---

## 🧩 As a Module

```js
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
```

---

## 📤 Output Format

* **Console Output**:
  Summarizes the scraped data: URL, page title, and up to 5 elements per selector.

* **CSV Output**:

  * `scraped_selective_separate_<timestamp>.csv`
  * `scraped_selective_combined_<timestamp>.csv`

### CSV Columns:

| Mode      | Columns                                                                  |
| --------- | ------------------------------------------------------------------------ |
| Separate  | URL, timestamp, title, selector, index, tag name, text, HTML, attributes |
| Combined  | URL, timestamp, title, selector-wise concatenated values                 |
| Text-Only | URL, selector, text content                                              |

---

## 💡 Use Cases

* **Content Analysis**: Extract headers and links for SEO or content summaries.
* **Data Collection**: Scrape product info or user reviews.
* **Research**: Gather titles or abstracts from blogs or news.
* **Monitoring**: Track web page element changes over time.
* **Form Analysis**: Review form field accessibility and metadata.
* **Link Extraction**: Crawl and audit outbound or internal links.

---

## 📎 Notes

* **Respect Rate Limits**: Use delays when scraping multiple URLs.
* **Valid Selectors**: Always use proper CSS selectors.
* **Error Logging**: Errors are logged without breaking the flow.
* **CSV Cleanliness**: Newlines removed, quotes escaped.

---

## 🤝 Contributing

1. Fork the repository.

2. Create a feature branch:

   ```bash
   git checkout -b feature/YourFeature
   ```

3. Commit changes:

   ```bash
   git commit -m "Add YourFeature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/YourFeature
   ```

5. Open a pull request!

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

Let me know if you'd like this in an actual `.md` file or if you need the repo structure/layout to go with it.
