const AuditLog = require('./auditLog.model');

const auditMiddleware = (actionType, entityType, options = {}) => {
  return async (req, res, next) => {
    const oldSend = res.send;
    res.send = async function (data) {
      try {
        if (res.statusCode < 400) { // Only log successful actions
          const changes = options.trackChanges 
            ? { 
                before: req._originalData, 
                after: data 
              } 
            : undefined;

          await AuditLog.create({
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            actionType,
            entityType,
            entityId: req.params.id || data?._id,
            description: options.description || `${actionType} ${entityType}`,
            changes,
            metadata: options.metadata || {}
          });
        }
      } catch (err) {
        console.error('Audit logging failed:', err);
      }
      oldSend.apply(res, arguments);
    };

    // For UPDATE actions, store original data
    if (options.trackChanges && actionType === 'UPDATE') {
      const entity = await mongoose.model(entityType).findById(req.params.id);
      req._originalData = entity;
    }

    next();
  };
};

module.exports = auditMiddleware;