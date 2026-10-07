import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoleGuard } from "@/components/shared/role-guard";
import { ShieldCheck } from "lucide-react";
import { auditLogRepository } from "@/repositories";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const logs = await auditLogRepository.getAll();

  return (
    <RoleGuard permission="audit:read">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">AUDIT LOGS</h1>
          <p className="text-sm text-muted-foreground">Immutable record of system actions</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              SYSTEM AUDIT LOG ({logs.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {logs.reverse().map(log => (
                <div key={log.id} className="border-b pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{log.action} {log.entityType}</span>
                    <span className="text-[11px] text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm mt-1">User: {log.userName}</p>
                  <pre className="text-[10px] mt-1 bg-muted p-2 rounded">{JSON.stringify(log.changes, null, 2)}</pre>
                </div>
              ))}
              {logs.length === 0 && <p className="text-sm text-muted-foreground">No audit logs found.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
