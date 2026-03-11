import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b border-border bg-card px-3 shrink-0">
            <div className="flex items-center">
              <SidebarTrigger className="mr-2" />
              <h1 className="text-sm font-semibold text-foreground">Verma Fancy Store</h1>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
                <Globe className="h-3.5 w-3.5" />
                {language === 'en' ? 'हिं' : 'EN'}
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-3 md:p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
