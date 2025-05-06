const express = require('express');
const router = express.Router();
const auditController = require('./auditLog.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

router.get('/audit-logs', 
  authenticate,
  authorize('admin', 'auditor'),
  auditController.getActivityLogs
);

router.post('/audit-logs/export', 
  authenticate,
  authorize('admin', 'auditor'),
  auditController.exportLogs
);

module.exports = router;