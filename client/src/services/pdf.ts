export function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .filter(text => !text.includes('oklch') && !text.includes('oklab'))
          .join('\n');
      } catch {
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
        <style>
          ${styles}
          body { font-family: system-ui, sans-serif; padding: 20px; background: white; }
          @media print {
            body { padding: 0; }
            button, .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <h2 style="margin-bottom:16px;color:#1e293b;">${filename}</h2>
        ${element.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
