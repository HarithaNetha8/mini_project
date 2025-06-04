import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import type { AppStats } from "@/lib/types";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<AppStats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const accuracyRate = stats ? 
    Math.round(((stats.safeCount + stats.phishingCount) / Math.max(stats.totalScans, 1)) * 100) : 0;

  const statsData = [
    {
      title: "URLs Scanned",
      value: stats?.totalScans.toLocaleString() || "0",
      icon: Shield,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Safe Sites",
      value: stats?.safeCount.toLocaleString() || "0",
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Threats Blocked",
      value: stats?.phishingCount.toLocaleString() || "0",
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Accuracy Rate",
      value: `${accuracyRate}%`,
      icon: TrendingUp,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
