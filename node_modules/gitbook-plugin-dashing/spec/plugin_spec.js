"use strict";

describe("the dashing plugin", () => {
  const path = require("path")
  const tester = require("gitbook-tester");

  const fixture = `
# Example

Upon discovering the errors---all 124 of them---the publisher immediately recalled the books.

* The 2010--2011 season was our best yet.

\`\`\`
You will find this material in chapters 8--12.
\`\`\`
  `;

  const paragraph = "<p>Upon discovering the errors&#x2014;all 124 of them&#x2014;the publisher immediately recalled the books.</p>";
  const listItem = "<li>The 2010&#x2013;2011 season was our best yet.</li>";
  const unprocessedCode = "<pre><code>You will find this material in chapters 8--12.\n" +
      "</code></pre>";
  const processedCode = "<pre><code>You will find this material in chapters 8&#x2013;12.\n" +
      "</code></pre>";

  let originalTimeoutInterval;

  beforeEach(() => {
    originalTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeoutInterval;
  });

  it("should replace dashes in common elements by default", testDone => {
    tester.builder()
      .withLocalPlugin(path.join(__dirname, ".."))
      .withContent(fixture)
      .create()
      .then(result => {
        let content = result.get("index.html").content;
        expect(content).toContain(paragraph);
        expect(content).toContain(listItem);
        expect(content).toContain(unprocessedCode);
      })
      .fin(testDone)
      .done();
  });

  it("should honour the selectors option", testDone => {
    tester.builder()
      .withLocalPlugin(path.join(__dirname, ".."))
      .withBookJson({
        pluginsConfig: {
          dashing: {
            selectors: [
              "pre > code"
            ]
          }
        }
      })
      .withContent(fixture)
      .create()
      .then(result => {
        let content = result.get("index.html").content;
        expect(content).not.toContain(unprocessedCode);
        expect(content).toContain(processedCode);
      })
      .fin(testDone)
      .done();
  });
})
