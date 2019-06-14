#!/usr/bin/env node

const labels = require('./labels.json');
const fs = require('fs');
const path = require('path');

const html = `\
<!DOCTYPE html>
<html>
  <head>
    <style>
      table {
        border-collapse: collapse;
      }

      tr {
        border-top: 1px solid #eaecef;
      }
      tr:last-child {
        border-bottom: 1px solid #eaecef;
      }

      tr > td:first-child {
        border-left: 1px solid #eaecef;
      }
      tr > td:last-child {
        border-right: 1px solid #eaecef;
      }
      .label {
        border-radius: 3px;
        font-size: 16px;
        font-weight: 600;
        line-height: 2;
        font-family: sans-serif;
        padding: 0 8px;
        display: inline-block;
        margin: 8px 8px;
      }

      .desc {
        padding: 8px 16px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <script>
      const labels = ${JSON.stringify(labels)};

      function calculateColor(bgColor) {
        const r = parseInt(bgColor.slice(0, 2), 16);
        const g = parseInt(bgColor.slice(2, 4), 16);
        const b = parseInt(bgColor.slice(4, 6), 16);

        const c = [r / 255, g / 255, b / 255];

        for (let i = 0; i < c.length; ++i) {
          if (c[i] <= 0.03928) {
            c[i] = c[i] / 12.92;
          } else {
            c[i] = Math.pow((c[i] + 0.055) / 1.055, 2.4);
          }
        }

        const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

        return l > 0.179 ? "black" : "white";
      }

      const table = document.body.appendChild(document.createElement('table'));

      for (const label of labels) {
        const tableRow = table.appendChild(document.createElement('tr'));
        const cells = [
          document.createElement('td'),
          document.createElement('td'),
        ];
        tableRow.append(...cells);

        const labelDiv = cells[0].appendChild(document.createElement('div'));
        labelDiv.setAttribute('class', 'label');
        const textColor = calculateColor(label.color);
        labelDiv.setAttribute(
          'style',
          \`background-color: #\${label.color}; color: \${textColor}\`,
        );
        labelDiv.innerText = label.name;

        if (!label.description) continue;
        const descDiv = cells[1].appendChild(document.createElement('div'));
        descDiv.setAttribute('class', 'desc');
        descDiv.innerText = label.description;
      }
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'preview.html'), html);
