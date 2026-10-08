import { getUsers } from "@/features/auth/use-users";
import { RoleGuard } from "@/components/shared/role-guard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRoleSelect } from "@/features/auth/components/user-role-select";
import { ShieldCheck, Users } from "lucide-react";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <RoleGuard permission="system:settings">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono tracking-tight">USER MANAGEMENT</h1>
            <p className="text-sm text-muted-foreground">Manage user access and roles</p>
          </div>
        </div>

        <Card>
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Registered Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
                          alt="Avatar" 
                          className="h-8 w-8 rounded-full bg-muted border border-border" 
                        />
                        <span className="font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <UserRoleSelect 
                        userId={user.id} 
                        currentRole={user.role} 
                        isSuperAdmin={user.email === "danielle_acierda@urios.edu.ph" || user.email === "danielle.acierda@urios.edu.ph"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
