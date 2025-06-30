const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class SelectiveWebScraper {
  constructor() {
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
  }

  async scrapeUrl(url, selectors = [], options = {}) {
    try {
      console.log(`Scraping: ${url}`);
      console.log(`Target selectors: ${selectors.join(', ')}`);
      
      // Make HTTP request
      const response = await axios.get(url, {
        headers: { ...this.defaultHeaders, ...options.headers },
        timeout: options.timeout || 15000,
        maxRedirects: 5
      });

      // Load HTML into Cheerio
      const $ = cheerio.load(response.data);
      
      // Base data
      const scrapedData = {
        url: url,
        timestamp: new Date().toISOString(),
        title: $('title').text().trim() || 'No Title'
      };

      // If no selectors provided, use basic set
      if (selectors.length === 0) {
        selectors = ['h1', 'h2', 'p', 'a'];
        console.log('No selectors provided, using default: h1, h2, p, a');
      }

      // Process each selector
      selectors.forEach((selector, index) => {
        try {
          const elements = $(selector);
          const extractedData = [];

          elements.each((i, element) => {
            const $el = $(element);
            const elementData = {
              index: i,
              tagName: element.tagName,
              text: $el.text().trim(),
              html: $el.html()
            };

            // Add specific attributes based on element type
            if (element.tagName === 'a') {
              elementData.href = $el.attr('href') || '';
              elementData.title = $el.attr('title') || '';
              elementData.target = $el.attr('target') || '';
            } else if (element.tagName === 'img') {
              elementData.src = $el.attr('src') || '';
              elementData.alt = $el.attr('alt') || '';
              elementData.width = $el.attr('width') || '';
              elementData.height = $el.attr('height') || '';
            } else if (['input', 'textarea', 'select'].includes(element.tagName)) {
              elementData.type = $el.attr('type') || '';
              elementData.name = $el.attr('name') || '';
              elementData.value = $el.attr('value') || $el.val() || '';
              elementData.placeholder = $el.attr('placeholder') || '';
            } else if (element.tagName === 'meta') {
              elementData.name = $el.attr('name') || '';
              elementData.property = $el.attr('property') || '';
              elementData.content = $el.attr('content') || '';
            }

            // Add common attributes
            elementData.id = $el.attr('id') || '';
            elementData.class = $el.attr('class') || '';
            
            extractedData.push(elementData);
          });

          // Store with selector as key (clean selector name for object key)
          const cleanSelector = selector.replace(/[^a-zA-Z0-9]/g, '_');
          scrapedData[`selector_${index + 1}_${cleanSelector}`] = {
            selector: selector,
            count: extractedData.length,
            elements: extractedData
          };

        } catch (error) {
          console.error(`Error processing selector '${selector}': ${error.message}`);
          scrapedData[`selector_${index + 1}_error`] = {
            selector: selector,
            error: error.message,
            count: 0,
            elements: []
          };
        }
      });

      return scrapedData;
    } catch (error) {
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }

  convertToCsvFormat(data, flattenMode = 'separate', textOnly = false) {
    const csvRows = [];
    
    if (flattenMode === 'separate') {
      // Each element gets its own row
      Object.keys(data).forEach(key => {
        if (key.startsWith('selector_')) {
          const selectorData = data[key];
          if (selectorData.elements && selectorData.elements.length > 0) {
            selectorData.elements.forEach(element => {
              if (textOnly) {
                // Text-only mode - minimal columns
                csvRows.push({
                  url: data.url,
                  selector: selectorData.selector,
                  text_content: this.cleanForCsv(element.text)
                });
              } else {
                // Full mode - all columns
                csvRows.push({
                  url: data.url,
                  timestamp: data.timestamp,
                  page_title: this.cleanForCsv(data.title),
                  selector: selectorData.selector,
                  element_index: element.index,
                  tag_name: element.tagName,
                  text_content: this.cleanForCsv(element.text),
                  html_content: this.cleanForCsv(element.html),
                  href: this.cleanForCsv(element.href || ''),
                  src: this.cleanForCsv(element.src || ''),
                  alt: this.cleanForCsv(element.alt || ''),
                  title_attr: this.cleanForCsv(element.title || ''),
                  id: this.cleanForCsv(element.id || ''),
                  class: this.cleanForCsv(element.class || ''),
                  type: this.cleanForCsv(element.type || ''),
                  name: this.cleanForCsv(element.name || ''),
                  value: this.cleanForCsv(element.value || ''),
                  width: this.cleanForCsv(element.width || ''),
                  height: this.cleanForCsv(element.height || '')
                });
              }
            });
          }
        }
      });
    } else {
      // Combined mode - one row per URL with concatenated results
      const combinedRow = {
        url: data.url,
        timestamp: data.timestamp,
        page_title: this.cleanForCsv(data.title)
      };

      Object.keys(data).forEach(key => {
        if (key.startsWith('selector_')) {
          const selectorData = data[key];
          const selector = selectorData.selector;
          const cleanSelector = selector.replace(/[^a-zA-Z0-9]/g, '_');
          
          // Combine all text content for this selector
          const allTexts = selectorData.elements.map(el => el.text).filter(text => text.length > 0);
          
          combinedRow[`${cleanSelector}_count`] = selectorData.count;
          combinedRow[`${cleanSelector}_texts`] = this.cleanForCsv(allTexts.join(' | '));
          
          if (!textOnly) {
            const allHrefs = selectorData.elements.map(el => el.href).filter(href => href && href.length > 0);
            if (allHrefs.length > 0) {
              combinedRow[`${cleanSelector}_hrefs`] = this.cleanForCsv(allHrefs.join(' | '));
            }
          }
        }
      });

      csvRows.push(combinedRow);
    }

    return csvRows;
  }

  cleanForCsv(text) {
    if (!text) return '';
    return text.toString()
      .replace(/"/g, '""')
      .replace(/\r?\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async saveToCsv(dataArray, filename, flattenMode = 'separate', textOnly = false) {
    try {
      if (!dataArray || dataArray.length === 0) {
        console.log('No data to save');
        return;
      }

      // Convert all data to CSV format
      let allCsvRows = [];
      dataArray.forEach(data => {
        const csvRows = this.convertToCsvFormat(data, flattenMode, textOnly);
        allCsvRows = allCsvRows.concat(csvRows);
      });

      if (allCsvRows.length === 0) {
        console.log('No data extracted for CSV');
        return;
      }

      // Get headers from first row
      const headers = Object.keys(allCsvRows[0]);
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      allCsvRows.forEach(row => {
        const values = headers.map(header => {
          const value = row[header] || '';
          if (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n')) {
            return `"${value}"`;
          }
          return value;
        });
        csvContent += values.join(',') + '\n';
      });

      // Save to file
      fs.writeFileSync(filename, csvContent, 'utf8');
      console.log(`\n✅ Data saved to ${filename}`);
      console.log(`Total rows: ${allCsvRows.length}`);
      console.log(`Columns: ${headers.length}`);
      
    } catch (error) {
      console.error(`Failed to save CSV: ${error.message}`);
    }
  }

  displayResults(data) {
    console.log('\n=== SCRAPING RESULTS ===');
    console.log(`URL: ${data.url}`);
    console.log(`Title: ${data.title}`);
    
    Object.keys(data).forEach(key => {
      if (key.startsWith('selector_')) {
        const selectorData = data[key];
        console.log(`\n--- ${selectorData.selector} (${selectorData.count} found) ---`);
        
        if (selectorData.error) {
          console.log(`❌ Error: ${selectorData.error}`);
        } else if (selectorData.elements.length > 0) {
          selectorData.elements.slice(0, 5).forEach((element, index) => {
            console.log(`${index + 1}. ${element.text.substring(0, 100)}${element.text.length > 100 ? '...' : ''}`);
            if (element.href) console.log(`   Link: ${element.href}`);
            if (element.src) console.log(`   Image: ${element.src}`);
          });
          if (selectorData.elements.length > 5) {
            console.log(`   ... and ${selectorData.elements.length - 5} more`);
          }
        } else {
          console.log('   No elements found');
        }
      }
    });
  }

  async scrapeMultipleUrls(urls, selectors, options = {}) {
    const results = [];
    const delay = options.delay || 2000;

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        console.log(`\n--- Processing ${i + 1}/${urls.length} ---`);
        const data = await this.scrapeUrl(url, selectors, options);
        results.push(data);
        
        if (delay > 0 && i < urls.length - 1) {
          console.log(`Waiting ${delay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Failed to scrape ${url}: ${error.message}`);
      }
    }

    return results;
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('\n🔍 Selective Web Scraper');
    console.log('Usage: node scraper.js <URL> [selectors...]');
    console.log('\nExamples:');
    console.log('  node scraper.js https://example.com h1 h2 p');
    console.log('  node scraper.js https://example.com "a[href]" ".product-title"');
    console.log('  node scraper.js https://example.com h1 "p.description" "img[alt]"');
    console.log('  node scraper.js https://example.com --combined h1 p a');
    console.log('  node scraper.js https://example.com --text-only a');
    console.log('  node scraper.js https://example.com --text-only "a[href*=\\"addr\\"]"');
    console.log('\nCommon selectors:');
    console.log('  h1, h2, h3          - Headings');
    console.log('  p                   - Paragraphs');
    console.log('  a                   - All links');
    console.log('  a[href]             - Links with href attribute');
    console.log('  img                 - Images');
    console.log('  .class-name         - Elements with specific class');
    console.log('  #id-name            - Element with specific ID');
    console.log('  [data-attribute]    - Elements with data attributes');
    console.log('\nOptions:');
    console.log('  --combined          - Save as one row per URL (default: separate rows per element)');
    console.log('  --text-only         - Save only URL, selector, and text content (no href, attributes, etc.)');
    process.exit(1);
  }

  try {
    const scraper = new SelectiveWebScraper();
    
    // Check for options
    const combinedMode = args.includes('--combined');
    const textOnly = args.includes('--text-only');
    const filteredArgs = args.filter(arg => !arg.startsWith('--'));
    
    const url = filteredArgs[0];
    const selectors = filteredArgs.slice(1);
    
    // Validate URL
    new URL(url);
    
    console.log(`🎯 Targeting specific elements on: ${url}`);
    if (selectors.length > 0) {
      console.log(`📋 Selectors: ${selectors.join(', ')}`);
    }
    
    // Scrape the data
    const data = await scraper.scrapeUrl(url, selectors);
    
    // Display results
    scraper.displayResults(data);
    
    // Save to CSV
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const mode = combinedMode ? 'combined' : 'separate';
    const textMode = textOnly ? '_text_only' : '';
    const filename = `scraped_selective_${mode}${textMode}_${timestamp}.csv`;
    await scraper.saveToCsv([data], filename, combinedMode ? 'combined' : 'separate', textOnly);
    
    console.log(`\n📊 Results saved in ${mode}${textOnly ? ' text-only' : ''} mode`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Export for use as module
module.exports = SelectiveWebScraper;

// Run if called directly
if (require.main === module) {
  main();
}