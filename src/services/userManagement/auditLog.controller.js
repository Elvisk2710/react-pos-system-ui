const AuditLog = require('./auditLog.model');
const { exportToCSV, exportToExcel } = require('./exportService');

exports.getActivityLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50,
      actionType,
      entityType,
      startDate,
      endDate,
      userId
    } = req.query;

    const filter = {};
    if (actionType) filter.actionType = actionType;
    if (entityType) filter.entityType = entityType;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await AuditLog.countDocuments(filter);

    res.json({
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportLogs = async (req, res) => {
  try {
    const { format, ...filters } = req.body;
    
    const logs = await AuditLog.find(filters)
      .sort({ timestamp: -1 })
      .lean();

    let fileData;
    let contentType;
    let fileName;

    switch (format) {
      case 'csv':
        fileData = await exportToCSV(logs);
        contentType = 'text/csv';
        fileName = `audit_logs_${Date.now()}.csv`;
        break;
      case 'excel':
        fileData = await exportToExcel(logs);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileName = `audit_logs_${Date.now()}.xlsx`;
        break;
      case 'json':
        fileData = JSON.stringify(logs, null, 2);
        contentType = 'application/json';
        fileName = `audit_logs_${Date.now()}.json`;
        break;
      default:
        throw new Error('Unsupported export format');
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(fileData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};