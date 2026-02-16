import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Check, X, Package, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
    "Pending": "bg-amber-100 text-amber-700 border-amber-200",
    "Approved": "bg-blue-100 text-blue-700 border-blue-200",
    "Rejected": "bg-red-100 text-red-700 border-red-200",
    "Released": "bg-purple-100 text-purple-700 border-purple-200",
    "Returned": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Overdue": "bg-red-100 text-red-700 border-red-200"
};

export default function RequestTable({
    requests,
    isAdmin,
    onApprove,
    onReject,
    onRelease,
    onReceive,
    onView,
    // @ts-ignore
    onFlag,
    showActions = true
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <
                // @ts-ignore
                Table>
                <
                    // @ts-ignore
                    TableHeader>
                    <
                        // @ts-ignore
                        TableRow className="bg-slate-50">
                        <
                            // @ts-ignore
                            TableHead className="font-semibold">Equipment</TableHead>
                        {isAdmin && <
                            // @ts-ignore
                            TableHead className="font-semibold">Borrower</TableHead>}
                        <
                            // @ts-ignore
                            TableHead className="font-semibold">Purpose</TableHead>
                        <
                            // @ts-ignore
                            TableHead className="font-semibold">Duration</TableHead>
                        <
                            // @ts-ignore
                            TableHead className="font-semibold">Status</TableHead>
                        {showActions && <
                            // @ts-ignore
                            TableHead className="font-semibold text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <
                    // @ts-ignore
                    TableBody>
                    {requests.length === 0 ? (
                        <
                            // @ts-ignore
                            TableRow>
                            <
                                // @ts-ignore
                                TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-slate-500">
                                No requests found
                            </TableCell>
                        </TableRow>
                    ) : (
                        requests.map((request) => (
                            <
                                // @ts-ignore
                                TableRow key={request.id} className="hover:bg-slate-50 transition-colors">
                                <
                                    // @ts-ignore
                                    TableCell>
                                    <div>
                                        <p className="font-medium text-slate-800">{request.equipment_name}</p>
                                        <p className="text-xs text-slate-500">{request.equipment_type}</p>
                                    </div>
                                </TableCell>
                                {isAdmin && (
                                    <
                                        // @ts-ignore
                                        TableCell>
                                        <div>
                                            <p className="font-medium text-slate-800">{request.borrower_name}</p>
                                            <p className="text-xs text-slate-500">{request.borrower_email}</p>
                                        </div>
                                    </TableCell>
                                )}
                                <
                                    // @ts-ignore
                                    TableCell className="max-w-[200px]">
                                    <p className="text-sm text-slate-600 truncate">{request.purpose}</p>
                                </TableCell>
                                <
                                    // @ts-ignore
                                    TableCell>
                                    <div className="text-sm">
                                        <p className="text-slate-700">{format(new Date(request.needed_from), "MMM d")}</p>
                                        <p className="text-slate-500 text-xs">to {format(new Date(request.needed_until), "MMM d, yyyy")}</p>
                                    </div>
                                </TableCell>
                                <
                                    // @ts-ignore
                                    TableCell>
                                    <
                                        // @ts-ignore
                                        Badge className={cn("border", statusColors[request.status])}>
                                        {request.status}
                                    </Badge>
                                    {request.issue_flag && request.issue_flag !== "None" && (
                                        <Badge variant="destructive" className="ml-2 text-xs">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {request.issue_flag}
                                        </Badge>
                                    )}
                                </TableCell>
                                {showActions && (
                                    <
                                        // @ts-ignore
                                        TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <
                                                // @ts-ignore
                                                Button size="sm" variant="ghost" onClick={() => onView(request)}>
                                                <Eye className="w-4 h-4" />
                                            </Button>

                                            {isAdmin && request.status === "Pending" && (
                                                <>
                                                    <
                                                        // @ts-ignore
                                                        Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => onApprove(request)}>
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <
                                                        // @ts-ignore
                                                        Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onReject(request)}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}

                                            {isAdmin && request.status === "Approved" && (
                                                <
                                                    // @ts-ignore
                                                    Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => onRelease(request)}>
                                                    <Package className="w-4 h-4 mr-1" /> Release
                                                </Button>
                                            )}

                                            {isAdmin && (request.status === "Released" || request.status === "Overdue") && (
                                                <
                                                    // @ts-ignore
                                                    Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onReceive(request)}>
                                                    <RotateCcw className="w-4 h-4 mr-1" /> Receive
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}