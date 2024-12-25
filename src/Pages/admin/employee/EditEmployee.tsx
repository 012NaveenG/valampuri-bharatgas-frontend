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
import { Switch } from '@/components/ui/switch';

interface Employee {
    emp_id: string;
    emp_name: string;
    emp_contact: string;
    username: string;
    password: string;
    isAdmin: boolean;
}

interface EditEmployeeProps {
    employee: Employee;
}

const EditEmployee = ({ employee }: EditEmployeeProps) => {
    const [formData, setFormData] = useState({
        emp_id: employee.emp_id,
        emp_name: employee.emp_name,
        emp_contact: employee.emp_contact,
        username: employee.username,
        password: employee.password,
        isAdmin: employee.isAdmin ==true ? true : false // Ensure proper type for isAdmin
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
            const response = await axios.put(`/api/admin/employee`, formData); // Corrected endpoint

            if (response.data.statusCode === 200) {
                toast({ title: "Success", description: "Employee details updated successfully." });
                setDialogOpen(false);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update employee details." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={"warning"}>Edit Employee</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="emp_name" className="text-right">
                                Employee Name
                            </Label>
                            <Input
                                id="emp_name"
                                name="emp_name"
                                value={formData.emp_name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="emp_contact" className="text-right">
                                Employee Contact
                            </Label>
                            <Input
                                id="emp_contact"
                                name="emp_contact"
                                value={formData.emp_contact}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isAdmin" className="text-right">
                                Admin
                            </Label>
                            <Switch
                                id="isAdmin"
                                checked={formData.isAdmin == true}
                                onCheckedChange={(checked) => setFormData(prev => ({
                                    ...prev,
                                    isAdmin: checked ? true : false
                                }))}
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

export default EditEmployee;
