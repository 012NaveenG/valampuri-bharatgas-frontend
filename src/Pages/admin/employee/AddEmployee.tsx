import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import Btnloader from "@/components/Btnloader";
import { Switch } from "@/components/ui/switch";

// Define Zod schema for form validation
const formSchema = z.object({
    emp_name: z.string().min(2, { message: "Employee name must be at least 2 characters" }).max(50),
    contact: z.string().min(10, { message: "Contact must be at least 10 characters" }).max(12),
    username: z.string().min(5, { message: "Username must be at least 5 characters" }).max(50),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(50),
    isAdmin: z.boolean().optional(),
});

type AddEmployeeFormValues = z.infer<typeof formSchema>;

const AddEmployee = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<AddEmployeeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emp_name: "",
            contact: "",
            username: "",
            password: "",
            isAdmin: false,
        },
    });

    const onSubmit = async (data: AddEmployeeFormValues) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/admin/employee`, data);
            if (response.data.statusCode === 200 || response.data.statusCode === 201) {
                toast({ title: "Success", description: "Employee added successfully." });
                form.reset();
                setDialogOpen(false);
            }
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            const errorMessage =
                axiosError.response?.data?.message || "An unexpected error occurred.";
            form.setError("root", { type: "manual", message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogDescription>Fill the form and click Add when done.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="emp_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter employee name"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter employee contact"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter username"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isAdmin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Is Admin</FormLabel>
                                    <FormControl>
                                        <Switch
                                        className="mx-2"
                                            id="isAdmin"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.formState.errors.root && (
                            <p className="text-red-500 mt-2">{form.formState.errors.root.message}</p>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? <Btnloader /> : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEmployee;
