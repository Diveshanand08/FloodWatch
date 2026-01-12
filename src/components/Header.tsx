import { Droplets, Bell, Settings, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="glass-card border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Droplets className="w-7 h-7 text-primary" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Delhi <span className="gradient-text-primary">FloodWatch</span>
              </h1>
              <p className="text-sm text-muted-foreground">Predictive Waterlogging Intelligence System</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 glass-card px-4 py-2 rounded-lg">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">System Status:</span>
              <Badge variant="success">Online</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
