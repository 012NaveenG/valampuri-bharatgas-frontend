import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Customer {
    cust_id: string;
    cust_name: string;
    pending_empty: number;
    pending_payment: number;
    area_name: string;
    area_no: number;
    deposit: number;
}

interface EditCustomerProps {
    customer: Customer;
}

const EditCustomer = ({ customer }: EditCustomerProps) => {
    const [formData, setFormData] = useState({
        cust_id:customer.cust_id,
        cust_name: customer.cust_name,
        pending_empty: customer.pending_empty,
        pending_payment: customer.pending_payment,
        area_name: customer.area_name,
        area_no: customer.area_no,
        deposit: customer.deposit,
    });
    const [dialogOpen, setDialogOpen] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    // Function to handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`/api/admin/customer`, formData);

            if (response.data.statusCode === 200) {
                toast({ title: "Success", description: "Customer details updated successfully." });
                setDialogOpen(false)
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update customer details." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog  open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={"warning"}>Edit Customer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cust_name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="cust_name"
                                name="cust_name"
                                value={formData.cust_name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="area_name" className="text-right">
                                Area Name
                            </Label>
                            <Input
                                id="area_name"
                                name="area_name"
                                value={formData.area_name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="area_no" className="text-right">
                                Area No
                            </Label>
                            <Input
                                id="area_no"
                                name="area_no"
                                value={formData.area_no}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="deposit" className="text-right">
                                Deposit
                            </Label>
                            <Input
                                id="deposit"
                                name="deposit"
                                type="number"
                                value={formData.deposit}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                       
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pending_empty" className="text-right">
                            Pending Empty
                            </Label>
                            <Input
                                id="pending_empty"
                                name="pending_empty"
                                type="number"
                                value={formData.pending_empty}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pending_empty" className="text-right">
                            Pending Payment
                            </Label>
                            <Input
                                id="pending_payment"
                                name="pending_payment"
                                type="number"
                                value={formData.pending_payment}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCustomer;
