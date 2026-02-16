import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, icon: Icon, trend, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        red: "bg-red-50 text-red-600",
        purple: "bg-purple-50 text-purple-600"
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-800">{value}</p>
                    {trend && (
                        <p className={cn("text-xs mt-2 font-medium", trend > 0 ? "text-emerald-600" : "text-red-500")}>
                            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-xl", colorClasses[color])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}