import React, { useState, useEffect } from 'react';
import ActivityLogTable from './ActivityLogTable';
import LogDetailsModal from './LogDetailsModal';
import ExportLogsDialog from './ExportLogsDialog';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate realistic dummy data
  const generateDummyLogs = () => {
    const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];
    const entities = ['Product', 'Order', 'User', 'Inventory', 'Category'];
    const users = [
      { id: 1, name: 'Admin User', email: 'admin@example.com' },
      { id: 2, name: 'Manager', email: 'manager@example.com' },
      { id: 3, name: 'Cashier', email: 'cashier@example.com' }
    ];
    
    const dummyLogs = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      
      dummyLogs.push({
        id: `log-${i}`,
        timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
        userId: randomUser.id,
        userName: randomUser.name,
        userEmail: randomUser.email,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        actionType: randomAction,
        entityType: randomEntity,
        entityId: `item-${Math.floor(Math.random() * 1000)}`,
        description: `${randomAction} action performed on ${randomEntity}`,
        changes: randomAction === 'UPDATE' ? {
          before: { price: (Math.random() * 100).toFixed(2), stock: Math.floor(Math.random() * 100) },
          after: { price: (Math.random() * 100).toFixed(2), stock: Math.floor(Math.random() * 100) }
        } : null,
        metadata: {
          location: ['Main Store', 'Warehouse', 'Online'][Math.floor(Math.random() * 3)],
          device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)]
        }
      });
    }
    
    return dummyLogs.sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const dummyData = generateDummyLogs();
      setLogs(dummyData);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (params) => {
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Exporting ${logs.length} logs in ${params.format} format`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="p-4 relative">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <ActivityLogTable
            logs={logs}
            onViewDetails={(log) => {
              setSelectedLog(log);
              setIsDetailsOpen(true);
            }}
            onExport={() => setIsExportOpen(true)}
          />

          <LogDetailsModal
            log={selectedLog}
            open={isDetailsOpen}
            handleClose={() => setIsDetailsOpen(false)}
          />

          <ExportLogsDialog
            open={isExportOpen}
            handleClose={() => setIsExportOpen(false)}
            onExport={handleExport}
          />
        </>
      )}
    </div>
  );
};

export default AuditLogPage;