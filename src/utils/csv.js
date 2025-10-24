/**
 * CSV utilities for data export
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} rows - Array of objects to convert
 * @returns {string} CSV string
 */
export function toCSV(rows) {
  if (!rows || rows.length === 0) {
    return '';
  }
  
  // Get headers from first row
  const headers = Object.keys(rows[0]);
  
  // Create CSV header row
  const headerRow = headers.join(',');
  
  // Create data rows
  const dataRows = rows.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape values that contain commas, quotes, or newlines
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 * @param {string} filename - Name of the file to download
 * @param {Array} rows - Array of objects to convert to CSV
 */
export function downloadCSV(filename, rows) {
  const csvContent = toCSV(rows);
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
