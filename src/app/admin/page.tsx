import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";
import { Card, CardContent } from "@/components/ui/card";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/prisma";

export const metadata: Metadata = { title: "Painel Administrativo" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (
    !isDatabaseConfigured() ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.SESSION_SECRET
  ) {
    return (
      <div className="page-shell grid min-h-[70vh] place-items-center py-12">
        <Card className="glass max-w-xl">
          <CardContent className="flex gap-4 p-6">
            <AlertTriangle className="size-6 shrink-0 text-amber-600" />
            <div>
              <h1 className="font-bold">Configuracao necessaria</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Configure DATABASE_URL, ADMIN_PASSWORD e SESSION_SECRET para acessar o painel da arena.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (await isAdminAuthenticated()) ? <AdminDashboard /> : <AdminLogin />;
}
