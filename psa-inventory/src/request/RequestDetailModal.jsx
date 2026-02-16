import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
// @ts-ignore
import { User, Calendar, Clock, Package, AlertTriangle } from "lucide-react";

const statusColors = {
    "Pending": "bg-amber-100 text-amber-700",
    "Approved": "bg-blue-100 text-blue-700",
    "Rejected": "bg-red-100 text-red-700",
    "Released": "bg-purple-100 text-purple-700",
    "Returned": "bg-emerald-100 text-emerald-700",
    "Overdue": "bg-red-100 text-red-700"
};

export default function RequestDetailModal({ open, onClose, request }) {
    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <
                // @ts-ignore
                DialogContent className="sm:max-w-lg">
                <
                    // @ts-ignore
                    DialogHeader>
                    <
                        // @ts-ignore
                        DialogTitle className="text-xl">Request Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <
                            // @ts-ignore
                            Badge className={cn("text-sm px-3 py-1", statusColors[request.status])}>
                            {request.status}
                        </Badge>
                        {request.issue_flag && request.issue_flag !== "None" && (
                            <Badge variant="destructive" className="text-sm px-3 py-1">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {request.issue_flag}
                            </Badge>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Package className="w-4 h-4" /> Equipment
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-slate-500">Name</p>
                                <p className="font-medium">{request.equipment_name}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Type</p>
                                <p className="font-medium">{request.equipment_type}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                            <User className="w-4 h-4" /> Borrower
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-slate-500">Name</p>
                                <p className="font-medium">{request.borrower_name}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Email</p>
                                <p className="font-medium">{request.borrower_email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Schedule
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-slate-500">Request Date</p>
                                <p className="font-medium">{format(new Date(request.request_date), "MMM d, yyyy")}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Duration</p>
                                <p className="font-medium">
                                    {format(new Date(request.needed_from), "MMM d")} - {format(new Date(request.needed_until), "MMM d, yyyy")}
                                </p>
                            </div>
                            {request.released_date && (
                                <div>
                                    <p className="text-slate-500">Released</p>
                                    <p className="font-medium">{format(new Date(request.released_date), "MMM d, yyyy")}</p>
                                </div>
                            )}
                            {request.returned_date && (
                                <div>
                                    <p className="text-slate-500">Returned</p>
                                    <p className="font-medium">{format(new Date(request.returned_date), "MMM d, yyyy")}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Purpose</p>
                        <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{request.purpose}</p>
                    </div>

                    {request.condition_on_release && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-700 mb-1">Condition on Release</p>
                                <
                                    // @ts-ignore
                                    Badge variant="outline">{request.condition_on_release}</Badge>
                            </div>
                            {request.condition_on_return && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-1">Condition on Return</p>
                                    <
                                        // @ts-ignore
                                        Badge variant="outline">{request.condition_on_return}</Badge>
                                </div>
                            )}
                        </div>
                    )}

                    {request.admin_remarks && (
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-2">Admin Remarks</p>
                            <p className="text-sm text-slate-600 bg-amber-50 rounded-lg p-3 border border-amber-100">{request.admin_remarks}</p>
                        </div>
                    )}

                    {request.return_remarks && (
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-2">Return Notes</p>
                            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{request.return_remarks}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}