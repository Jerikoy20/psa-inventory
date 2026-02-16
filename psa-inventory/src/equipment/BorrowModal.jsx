import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function BorrowModal({ open, onClose, equipment, onSubmit, user }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        purpose: "",
        needed_from: format(new Date(), "yyyy-MM-dd"),
        needed_until: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit({
            ...formData,
            equipment_id: equipment.id,
            equipment_name: equipment.name,
            equipment_type: equipment.type,
            borrower_email: user.email,
            borrower_name: user.full_name,
            request_date: format(new Date(), "yyyy-MM-dd"),
            status: "Pending"
        });
        setLoading(false);
        onClose();
        setFormData({ purpose: "", needed_from: format(new Date(), "yyyy-MM-dd"), needed_until: "" });
    };

    if (!equipment) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Request to Borrow</DialogTitle>
                    <DialogDescription>
                        {equipment.name} - {equipment.property_number}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose / Reason</Label>
                        <Textarea
                            id="purpose"
                            placeholder="Please describe why you need this equipment..."
                            value={formData.purpose}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            required
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="from">Needed From</Label>
                            <Input
                                id="from"
                                type="date"
                                value={formData.needed_from}
                                onChange={(e) => setFormData({ ...formData, needed_from: e.target.value })}
                                required
                                min={format(new Date(), "yyyy-MM-dd")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="until">Needed Until</Label>
                            <Input
                                id="until"
                                type="date"
                                value={formData.needed_until}
                                onChange={(e) => setFormData({ ...formData, needed_until: e.target.value })}
                                required
                                min={formData.needed_from}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                        <p><strong>Borrower:</strong> {user?.full_name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Submit Request
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}