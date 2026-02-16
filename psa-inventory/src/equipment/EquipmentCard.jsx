import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Laptop, Tablet, Router, Printer, Projector, Speaker, Cpu, Network, Wifi, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const equipmentIcons = {
    "Laptop": Laptop,
    "Tablet": Tablet,
    "PC": Monitor,
    "Switch": Network,
    "Router": Router,
    "Modem": Server,
    "CPU": Cpu,
    "Printer": Printer,
    "Projector": Projector,
    "Speaker": Speaker,
    "Access Point": Wifi
};

const statusColors = {
    "Available": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Borrowed": "bg-blue-100 text-blue-700 border-blue-200",
    "Reserved": "bg-amber-100 text-amber-700 border-amber-200",
    "Under Maintenance": "bg-orange-100 text-orange-700 border-orange-200",
    "Condemned": "bg-red-100 text-red-700 border-red-200"
};

const conditionColors = {
    "Excellent": "text-emerald-600",
    "Good": "text-blue-600",
    "Fair": "text-amber-600",
    "Poor": "text-red-600"
};

export default function EquipmentCard({ equipment, onBorrow, onView, isAdmin }) {
    const Icon = equipmentIcons[equipment.type] || Monitor;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
                {equipment.image_url ? (
                    <img src={equipment.image_url} alt={equipment.name} className="h-full w-full object-cover" />
                ) : (
                    <Icon className="w-16 h-16 text-slate-300 group-hover:text-slate-400 transition-colors" />
                )}
                <Badge className={cn("absolute top-3 right-3 border", statusColors[equipment.status])}>
                    {equipment.status}
                </Badge>
            </div>
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-800 line-clamp-1">{equipment.name}</h3>
                    <span className={cn("text-xs font-medium", conditionColors[equipment.condition])}>
                        {equipment.condition}
                    </span>
                </div>
                <p className="text-slate-500 text-sm mb-1">{equipment.brand} {equipment.model}</p>
                <p className="text-slate-400 text-xs mb-4">PN: {equipment.property_number}</p>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onView(equipment)}
                    >
                        View
                    </Button>
                    {equipment.status === "Available" && !isAdmin && (
                        <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => onBorrow(equipment)}
                        >
                            Borrow
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}