#!/usr/bin/env node

const labels = require('./labels.json');
const fs = require('fs');

const html = `\
<!DOCTYPE html>
<html>
  <head>
    <style>
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
        const R = parseInt(bgColor.slice(0, 2), 16),
          G = parseInt(bgColor.slice(2, 4), 16),
          B = parseInt(bgColor.slice(4, 6), 16);

        const C = [R / 255, G / 255, B / 255];

        for (var i = 0; i < C.length; ++i) {
          if (C[i] <= 0.03928) {
            C[i] = C[i] / 12.92;
          } else {
            C[i] = Math.pow((C[i] + 0.055) / 1.055, 2.4);
          }
        }

        const L = 0.2126 * C[0] + 0.7152 * C[1] + 0.0722 * C[2];

        if (L > 0.179) {
          return 'black';
        } else {
          return 'white';
        }
      }

      const table = document.body.appendChild(document.createElement('table'));

      for (const label of labels) {
        const tableRow = table.appendChild(document.createElement('tr'));
        const cells = [
          document.createElement('td'),
          document.createElement('td'),
        ];
        tableRow.append(...cells);

        const labelDiv = document.createElement('div');
        labelDiv.setAttribute('class', 'label');
        const { bgColor, color } = {
          bgColor: label.color,
          color: calculateColor(label.color),
        };
        labelDiv.setAttribute(
          'style',
          \`background-color: #\${bgColor}; color: \${color}\`,
        );
        labelDiv.innerText = label.name;
        cells[0].appendChild(labelDiv);

        const descDiv = document.createElement('div');
        descDiv.setAttribute('class', 'desc');
        descDiv.innerText = label.description;
        cells[1].appendChild(descDiv);
      }
    </script>
  </body>
</html>
`;

fs.writeFileSync('preview.html', html);
