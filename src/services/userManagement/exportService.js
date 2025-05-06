const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');

exports.exportToCSV = async (logs) => {
  const fields = [
    { label: 'Timestamp', value: 'timestamp' },
    { label: 'User', value: row => `${row.userName} (${row.userEmail})` },
    { label: 'Action', value: 'actionType' },
    { label: 'Entity', value: 'entityType' },
    { label: 'Description', value: 'description' },
    { label: 'IP Address', value: 'ipAddress' }
  ];

  const parser = new Parser({ fields });
  return parser.parse(logs);
};

exports.exportToExcel = async (logs) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Audit Logs');

  // Add headers
  worksheet.columns = [
    { header: 'Timestamp', key: 'timestamp', width: 20 },
    { header: 'User', key: 'user', width: 25 },
    { header: 'Action', key: 'actionType', width: 15 },
    { header: 'Entity', key: 'entityType', width: 15 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'IP Address', key: 'ipAddress', width: 15 }
  ];

  // Add rows
  logs.forEach(log => {
    worksheet.addRow({
      timestamp: log.timestamp,
      user: `${log.userName} (${log.userEmail})`,
      ...log
    });
  });

  // Format timestamp column
  worksheet.getColumn('timestamp').numFmt = 'yyyy-mm-dd hh:mm:ss';

  return workbook.xlsx.writeBuffer();
};