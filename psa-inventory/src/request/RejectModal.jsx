import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

export default function RejectModal({ open, onClose, request, onSubmit }) {
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(request, remarks);
        setLoading(false);
        setRemarks("");
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
                        <X className="w-5 h-5 text-red-600" />
                        Reject Request
                    </DialogTitle>
                    <
                        // @ts-ignore
                        DialogDescription>
                        {request.equipment_name} requested by {request.borrower_name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <
                            // @ts-ignore
                            Label>Reason for Rejection *</Label>
                        <Textarea
                            // @ts-ignore
                            placeholder="Please provide the reason for rejection..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            required
                            className="min-h-[100px]"
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
                            Button type="submit" variant="destructive" className="flex-1" disabled={loading || !remarks.trim()}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Reject Request
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}