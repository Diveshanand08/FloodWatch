import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Droplets, 
  Map, 
  LayoutDashboard, 
  Database, 
  PieChart, 
  ClipboardCheck,
  Menu,
  X,
  Bell,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'default' | 'warning' | 'critical';
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Crowdsourced Map', href: '/crowdsourced-map', icon: Map, badgeVariant: 'warning' },
  { label: 'Ward Risk Dashboard', href: '/ward-dashboard', icon: PieChart },
  { label: 'Report Flood', href: '/report-flood', icon: Database, badgeVariant: 'default' },
  { label: 'Drainage Analytics', href: '/drainage-analytics', icon: Droplets },
  { label: 'Preparedness Scorecard', href: '/preparedness', icon: ClipboardCheck },
];

const Navigation = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 glass-card border-r border-border/50 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Delhi <span className="gradient-text-primary">FloodWatch</span>
              </h1>
              <p className="text-xs text-muted-foreground">Intelligence System</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )} />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <Badge variant={item.badgeVariant || 'default'} className="text-[10px] px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <p className="text-center text-xs text-muted-foreground tracking-wide">
            Created by <span className="font-semibold text-foreground">DELHI_FLOODWATCH</span>
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-foreground">FloodWatch</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 glass-card border-l border-border/50 animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <span className="font-semibold text-foreground">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-primary/20 text-primary border border-primary/30" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge variant={item.badgeVariant || 'default'} className="text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;