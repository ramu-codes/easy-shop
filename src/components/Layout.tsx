import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border bg-card px-3 shrink-0">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-sm font-semibold text-foreground">Verma Fancy Store</h1>
          </header>
          <main className="flex-1 overflow-auto p-3 md:p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
