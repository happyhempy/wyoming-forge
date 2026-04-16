import { Users, DollarSign, Clock, CheckCircle } from "lucide-react";

interface AdminStatsProps {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  revenue: number;
}

export function AdminStats({ totalCases, activeCases, completedCases, revenue }: AdminStatsProps) {
  const stats = [
    { label: "Total Clients", value: totalCases, icon: Users, color: "text-blue-400" },
    { label: "Active Cases", value: activeCases, icon: Clock, color: "text-gold" },
    { label: "Completed", value: completedCases, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Est. Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-muted/50 ${s.color}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
