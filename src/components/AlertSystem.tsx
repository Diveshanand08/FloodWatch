import { AlertTriangle, Bell, Clock, MapPin, ChevronRight, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  time: string;
  description: string;
  action?: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Imminent Flooding Alert',
    location: 'Chandni Chowk, Central Delhi',
    time: '2 min ago',
    description: 'Water level rising rapidly. Flood expected in 8 minutes. Drainage at 95% capacity.',
    action: 'Evacuate low-lying areas',
  },
  {
    id: '2',
    type: 'critical',
    title: 'Critical Waterlogging',
    location: 'Nehru Place, South Delhi',
    time: '5 min ago',
    description: 'Historical flood zone activated. 92% probability of severe waterlogging.',
    action: 'Deploy emergency pumps',
  },
  {
    id: '3',
    type: 'warning',
    title: 'High Risk Threshold Crossed',
    location: 'Karol Bagh, West Delhi',
    time: '12 min ago',
    description: 'Rainfall intensity exceeds 40mm/hr threshold. Monitoring escalated.',
    action: 'Alert local authorities',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Drain Capacity Warning',
    location: 'ITO, Central Delhi',
    time: '18 min ago',
    description: 'Storm drains at 85% capacity. Backup systems on standby.',
  },
  {
    id: '5',
    type: 'info',
    title: 'Weather Update',
    location: 'Delhi NCR Region',
    time: '25 min ago',
    description: 'Heavy rainfall expected to continue for next 2 hours. IMD Orange Alert active.',
  },
];

const getAlertStyles = (type: Alert['type']) => {
  switch (type) {
    case 'critical':
      return {
        border: 'border-destructive/50',
        bg: 'bg-destructive/10',
        icon: 'text-destructive',
        pulse: true,
      };
    case 'warning':
      return {
        border: 'border-warning/50',
        bg: 'bg-warning/10',
        icon: 'text-warning',
        pulse: false,
      };
    case 'info':
      return {
        border: 'border-primary/50',
        bg: 'bg-primary/10',
        icon: 'text-primary',
        pulse: false,
      };
  }
};

const AlertSystem = () => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-destructive/20">
              <Bell className="w-5 h-5 text-destructive" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-destructive-foreground font-bold">
              {alerts.filter(a => a.type === 'critical').length}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Early Warning Alerts</h2>
            <p className="text-sm text-muted-foreground">Automated threshold notifications</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Volume2 className="w-4 h-4" />
          Sound On
        </Button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
        {alerts.map((alert, index) => {
          const styles = getAlertStyles(alert.type);
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${styles.border} ${styles.bg} transition-all duration-300 hover:scale-[1.02] cursor-pointer ${styles.pulse ? 'animate-pulse' : ''}`}
              style={{ animationDelay: `${(index + 5) * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${styles.icon} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{alert.title}</h3>
                    <Badge variant={alert.type === 'critical' ? 'critical' : alert.type === 'warning' ? 'warning' : 'default'}>
                      {alert.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  {alert.action && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-primary">
                        Recommended: {alert.action}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertSystem;
