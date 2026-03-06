import {
  LayoutDashboard, Package, Users, UserCheck, Receipt,
  LogOut, Store, UserCheck2, Calculator, TrendingDown
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useShop } from "@/contexts/ShopContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Sales", url: "/sales", icon: Receipt },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Buy / Sellers", url: "/sellers", icon: UserCheck },
  { title: "Expenditure", url: "/expenditure", icon: TrendingDown },
  { title: "Employees", url: "/employees", icon: UserCheck2 },
  { title: "Daily Tracker", url: "/daily-tracker", icon: Calculator },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { shopName, logout } = useShop();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`px-4 py-5 flex items-center gap-3 border-b border-sidebar-border ${collapsed ? 'justify-center' : ''}`}>
          <Store className="h-7 w-7 text-sidebar-primary shrink-0" />
          {!collapsed && <span className="font-bold text-lg text-sidebar-foreground truncate">{shopName || 'Verma Fancy Store'}</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
