/** Dispara o download de um arquivo gerado no navegador, sem passar pelo servidor. */
export const downloadFile = (fileName: string, content: string, mimeType = 'text/plain') => {
  const url = URL.createObjectURL(new Blob([content], { type: `${mimeType};charset=utf-8` }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const escapeCsvCell = (value: string) => (/[",;\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

export const toCsv = (rows: string[][]) => rows.map((row) => row.map(escapeCsvCell).join(';')).join('\n');
