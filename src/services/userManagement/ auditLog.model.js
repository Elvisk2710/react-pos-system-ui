const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  ipAddress: { type: String },
  actionType: { 
    type: String, 
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ACCESS', 'OTHER']
  },
  entityType: { type: String, required: true }, // e.g., 'Product', 'User', 'Order'
  entityId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, required: true },
  changes: { type: Object }, // Stores before/after state for updates
  metadata: { type: Object } // Additional context
});

// Indexes for faster querying
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);