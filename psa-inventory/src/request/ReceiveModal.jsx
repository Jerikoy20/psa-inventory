import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RotateCcw, AlertTriangle } from "lucide-react";

export default function ReceiveModal({ open, onClose, request, onSubmit }) {
    const [loading, setLoading] = useState(false);
    const [condition, setCondition] = useState("Good");
    const [remarks, setRemarks] = useState("");
    const [issueFlag, setIssueFlag] = useState("None");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(request, condition, remarks, issueFlag);
        setLoading(false);
        setCondition("Good");
        setRemarks("");
        setIssueFlag("None");
        onClose();
    };

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <
                // @ts-ignore
                DialogContent className="sm:max-w-md">
                <
                    // @ts-ignore
                    DialogHeader>
                    <
                        // @ts-ignore
                        DialogTitle className="text-xl flex items-center gap-2">
                        <RotateCcw className="w-5 h-5 text-emerald-600" />
                        Receive Returned Equipment
                    </DialogTitle>
                    <
                        // @ts-ignore
                        DialogDescription>
                        {request.equipment_name} from {request.borrower_name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <
                            // @ts-ignore
                            Label>Equipment Condition</Label>
                        <Select value={condition} onValueChange={setCondition}>
                            <
                                // @ts-ignore
                                SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <
                                // @ts-ignore
                                SelectContent>
                                <
                                    // @ts-ignore
                                    SelectItem value="Excellent">Excellent</SelectItem>
                                <
                                    // @ts-ignore
                                    SelectItem value="Good">Good</SelectItem>
                                <
                                    // @ts-ignore
                                    SelectItem value="Fair">Fair</SelectItem>
                                <
                                    // @ts-ignore
                                    SelectItem value="Poor">Poor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <
                            // @ts-ignore
                            Label className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Issue Flag
                        </Label>
                        <Select value={issueFlag} onValueChange={setIssueFlag}>
                            <
                                // @ts-ignore
                                SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <
                                // @ts-ignore
                                SelectContent>
                                <
                                    // @ts-ignore
                                    SelectItem value="None">No Issues</SelectItem>
                                <
                                    // @ts-ignore
                                    SelectItem value="Damaged">Damaged</SelectItem>
                                <
                                    // @ts-ignore
                                    SelectItem value="Lost">Lost</SelectItem>
                                <
                                    // @ts-ignore
                                    SelectItem value="Missing Parts">Missing Parts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <
                            // @ts-ignore
                            Label>Return Notes</Label>
                        <Textarea
                            // @ts-ignore
                            placeholder="Any observations about the returned item..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <
                            // @ts-ignore
                            Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <
                            // @ts-ignore
                            Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Confirm Return
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}