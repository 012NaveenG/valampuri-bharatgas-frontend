
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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



// Define Zod schema for form validation
const formSchema = z.object({
    cust_name: z
        .string()
        .min(2, { message: "Customer/shop name must be at least 2 characters" })
        .max(50, { message: "Customer/shop name cannot exceed 50 characters" }),
    area_name: z
        .string()
        .min(2, { message: "Areaname must be at least 2 characters" })
        .max(50, { message: "Customer name cannot exceed 50 characters" }),
    area_no: z
        .number()
        .nonnegative()
});

// TypeScript types inferred from the Zod schema
type AddCustomerFormValues = z.infer<typeof formSchema>;


const AddCustomer = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Initialize React Hook Form
    const form = useForm<AddCustomerFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cust_name: "",
            area_name: "",

        },
    });

    // Handle form submission
    const onSubmit = async (data: AddCustomerFormValues) => {
        setLoading(true);
        setError(null);

        try {

            console.log(data)
            const response = await axios.post(`/api/admin/customer`, data)

            if (response.data.statusCode === 200 || response.data.statusCode === 201) {
                toast({
                    title: "Customer Added",
                    description: "Customer added successfully"
                })
            }

            setLoading(false)
            setDialogOpen(false)
        } catch (err: unknown) {
            // Handle backend error response
            const axiosError = err as { response?: { data?: { message?: string } } };
            const errorMessage =
                axiosError.response?.data?.message ||
                "An unexpected error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };




    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Customer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Customer</DialogTitle>
                    <DialogDescription>
                        Fill customer form. Click Add when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {/* Username Field */}
                            <FormField
                                control={form.control}
                                name="cust_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer/Shop Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter customer/shop name"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setError(null); // Clear error on input change
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="area_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Area Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter area name"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setError(null); // Clear error on input change
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="area_no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Area No</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter area number"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(Number(e.target.value));
                                                    setError(null); // Clear error on input change
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Error Message */}
                            {error && <p className="text-red-500 mt-2">{error}</p>}

                            <DialogFooter>
                                {/* Submit Button */}
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Btnloader /> : "Add"}
                                </Button>
                            </DialogFooter>

                        </form>
                    </Form>
                </div>

            </DialogContent>
        </Dialog>
    )
}


export default AddCustomer
