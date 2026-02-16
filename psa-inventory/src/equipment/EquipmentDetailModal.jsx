import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Monitor, Laptop, Tablet, Router, Printer, Projector, Speaker, Cpu, Network, Wifi, Server, MapPin, Hash, Tag } from "lucide-react";
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
    "Available": "bg-emerald-100 text-emerald-700",
    "Borrowed": "bg-blue-100 text-blue-700",
    "Reserved": "bg-amber-100 text-amber-700",
    "Under Maintenance": "bg-orange-100 text-orange-700",
    "Condemned": "bg-red-100 text-red-700"
};

export default function EquipmentDetailModal({ open, onClose, equipment }) {
    if (!equipment) return null;
    const Icon = equipmentIcons[equipment.type] || Monitor;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Icon className="w-5 h-5 text-slate-600" />
                        </div>
                        {equipment.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="flex items-center gap-3">
                        <Badge className={cn("text-sm px-3 py-1", statusColors[equipment.status])}>
                            {equipment.status}
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">
                            {equipment.condition} Condition
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem icon={Tag} label="Type" value={equipment.type} />
                        <InfoItem icon={Hash} label="Property No." value={equipment.property_number} />
                        <InfoItem label="Serial No." value={equipment.serial_number} />
                        <InfoItem label="Brand" value={equipment.brand || "N/A"} />
                        <InfoItem label="Model" value={equipment.model || "N/A"} />
                        <InfoItem icon={MapPin} label="Location" value={equipment.location || "N/A"} />
                    </div>

                    {equipment.notes && (
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-slate-700 mb-1">Notes</p>
                            <p className="text-sm text-slate-600">{equipment.notes}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-slate-500 flex items-center gap-1">
                {Icon && <Icon className="w-3 h-3" />}
                {label}
            </p>
            <p className="text-sm font-medium text-slate-800">{value}</p>
        </div>
    );
}