import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Package } from "lucide-react";

export default function ReleaseModal({ open, onClose, request, onSubmit }) {
    const [loading, setLoading] = useState(false);
    const [condition, setCondition] = useState("Good");
    const [remarks, setRemarks] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(request, condition, remarks);
        setLoading(false);
        setCondition("Good");
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
                        <Package className="w-5 h-5 text-purple-600" />
                        Release Equipment
                    </DialogTitle>
                    <
                        // @ts-ignore
                        DialogDescription>
                        {request.equipment_name} to {request.borrower_name}
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
                            Label>Remarks (Optional)</Label>
                        <Textarea
                            // @ts-ignore
                            placeholder="Any notes about the release..."
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
                            Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Confirm Release
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}