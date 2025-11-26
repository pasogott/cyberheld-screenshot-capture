/**
 * Triggers a file download in the browser
 * @param {string} data - The data to download
 * @param {string} filename - The name of the file to be downloaded
 */
function downloadFile(data, filename) {
  const url = window.URL.createObjectURL(new Blob([data]), { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Copies text to clipboard
 * @param {string} text - The text to copy to clipboard
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

/**
 * Exports a 1D array to a text file
 * @param {string[]} data - The array to export
 * @param {string} filename - The name of the file to be downloaded
 */
export function exportToTxtFile(data, filename) {
  const text = data.join('\n');
  downloadFile(text, filename);
}

/**
 * Exports a 2D array to a CSV file
 * @param {any[][] | {}} data - The 2D array or object to export
 * @param {string} filename - The name of the file to be downloaded
 * @returns {Promise<void>}
 */
export async function exportToCsvFile(data, filename) {
  const Papa = await import('papaparse');
  console.log('exportToCsvFile data', data);
  const csv = Papa.unparse(data);
  downloadFile(csv, filename);
}

export async function exportToExcel(data, filename) {
  const XLSX = await import('xlsx');

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  //filename add extension if not present
  if (!filename.endsWith('.xlsx')) filename += '.xlsx';

  XLSX.writeFile(workbook, filename);
}
