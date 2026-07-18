import React, { useState, useEffect } from 'react';
import { AuditLogService } from '../services/api';
import { AuditLog } from '../types';
import { ShieldAlert, User, Activity } from 'lucide-react';

export default function AuditLogsView() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await AuditLogService.getAllLogs();
        setLogs(res.data || []);
      } catch (e) {
        console.error('Failed to fetch audit logs', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-cyan-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Audit Logs</h1>
          <p className="text-slate-500 mt-2">Platform activity and security auditing.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No audit logs found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Entity</th>
                <th className="px-6 py-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <User className="w-3 h-3 text-slate-500" />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {log.user_name || `ID: ${log.user_id}` || 'System'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      log.action === 'EMERGENCY_STOP' ? 'bg-red-100 text-red-700' :
                      log.action.includes('CREATE') || log.action === 'START' ? 'bg-emerald-100 text-emerald-700' :
                      log.action.includes('UPDATE') || log.action === 'RESUME' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {log.entity} {log.entity_id ? `#${log.entity_id}` : ''}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono truncate max-w-xs" title={log.payload || ''}>
                    {log.payload || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
