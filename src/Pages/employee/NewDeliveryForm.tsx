import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Btnloader from "@/components/Btnloader.tsx";
import { z } from "zod";
import axios from "axios";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";

// Define the types for customers
type Customer = {
    cust_id: string;
    cust_name: string;
    area_no: number;
    area_name: string;
};

// Zod schema for form validation
const formSchema = z.object({
    cust_id: z.string().min(1, { message: "Customer selection is required" }),
    full_cylinder_delivered: z.number().min(1, { message: "Full cylinders must be at least 1" }).max(100, { message: "Cannot deliver more than 100 cylinders" }).nonnegative(),
    empty_cylinder_delivered: z.number().min(0, { message: "Empty cylinders must be at least 0" }).nonnegative(),
    empty_received: z.number().min(0, { message: "Empty cylinders received must be at least 0" }).nonnegative(),
    total_payment_amount: z.number().min(1, { message: "Total payment must be at least 1" }).nonnegative(),
    payment_received: z.number().min(0, { message: "Payment received cannot be negative" }).nonnegative(),
    payment_mode: z.string().min(1, { message: "Payment mode is required" }),
    rate_per_unit: z.number().min(1, { message: "Rate per unit must be at least 1" }).nonnegative(),
});

// TypeScript types inferred from the Zod schema
type DeliveryFormValues = z.infer<typeof formSchema>;

type NewDeliveryFormProps = {
    emp_id: string;
    truck_id: string;
    onDeliveryAdded: () => void
};


const NewDeliveryForm: React.FC<NewDeliveryFormProps> = ({ emp_id, truck_id, onDeliveryAdded }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]); // Customer list
    const paymentMode = ["UPI", "Cash", "Both"]

    const form = useForm<DeliveryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cust_id: "",
            full_cylinder_delivered: 0,
            empty_cylinder_delivered: 0,
            empty_received: 0,
            total_payment_amount: 0,
            payment_received: 0,
            payment_mode: "",
            rate_per_unit: 0,
        },
    });

    // Calculate total payment dynamically based on full_cylinder_delivered and rate_per_unit
    useEffect(() => {
        const { full_cylinder_delivered, rate_per_unit } = form.getValues();
        const totalPaymentAmount = full_cylinder_delivered * rate_per_unit;
        form.setValue("total_payment_amount", totalPaymentAmount); // Update total_payment_amount field
    }, [form.watch("full_cylinder_delivered"), form.watch("rate_per_unit")]);


    // Fetch customers dynamically
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get("/api/admin/customer");
                setCustomers(response.data?.data); // Use the nested structure
            } catch (err) {
                console.error("Failed to fetch customers:", err);
            }
        };

        fetchCustomers();
    }, []);

    const onSubmit = async (data: DeliveryFormValues) => {
        setLoading(true);
        setError(null);

        const payload = {
            emp_id,
            truck_id,
            ...data,
        };

        try {
            const response = await axios.post("/api/employee/delivery", payload);

            if (response.status === 200) {
                toast({
                    title: "Success!",
                    description: "Cylinder delivered successfully.",
                });
                form.reset();
                setOpen(false)
                onDeliveryAdded()
            } else {
                throw new Error(response.data?.message || "Cylinder delivery failed.");
            }
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            const errorMessage = axiosError.response?.data?.message || "An unexpected error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);

        }
    };

    return (
        <>
            <Dialog onOpenChange={setOpen} open={open} >
                <DialogTrigger asChild>
                    <Button >New Delivery</Button>
                </DialogTrigger>
                <DialogContent>
                    <ScrollArea className="h-[500px] w-full sm:max-w-[425px] rounded-md p-4">
                        <DialogHeader>
                            <DialogTitle>Delivery Details</DialogTitle>
                            <DialogDescription>
                                Fill the delivery details
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form} >
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8 mt-5"
                            >
                                {/* Customer Selection */}
                                <FormField
                                    control={form.control}
                                    name="cust_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Shop Name</FormLabel>
                                            <FormControl >
                                                <div className="px-1">
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selct a customer" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {customers && customers.map((customer) => (
                                                                <SelectItem key={customer.cust_id} value={customer.cust_id} onClick={() => {
                                                                    field.onChange(customer.cust_id);
                                                                }}>
                                                                    {customer.cust_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>


                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Full Cylinders Delivered */}
                                <FormField
                                    control={form.control}
                                    name="full_cylinder_delivered"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Cylinders Delivered</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter number"
                                                    {...field}
                                                    value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Empty Cylinders Delivered */}
                                <FormField
                                    control={form.control}
                                    name="empty_cylinder_delivered"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Empty Cylinders Delivered</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter number"
                                                    {...field}
                                                    value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Empty Cylinders Received */}
                                <FormField
                                    control={form.control}
                                    name="empty_received"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Empty Cylinders Received</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter number"
                                                    {...field}
                                                    value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Rate per Unit */}
                                <FormField
                                    control={form.control}
                                    name="rate_per_unit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rate per Unit</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter rate"
                                                    {...field}
                                                    value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Total Payment Amount */}
                                <FormField
                                    control={form.control}
                                    name="total_payment_amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Payment Amount</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    {...field}

                                                    onChange={(e) => {
                                                        field.onChange(Number(e.target.value));
                                                        setError(null);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Payment Received */}
                                <FormField
                                    control={form.control}
                                    name="payment_received"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Received</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    {...field}
                                                    value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Payment Mode */}
                                <FormField
                                    control={form.control}
                                    name="payment_mode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Mode</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selct Payment Mode" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            paymentMode.map((mode, idx) => (

                                                                <SelectItem value={mode} key={idx}>{mode}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>

                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                {/* Error Message */}
                                {error && <p className="text-red-500 mt-2">{error}</p>}

                                <DialogFooter>
                                    {/* Submit Button */}
                                    <DialogClose asChild>
                                        <Button type="submit" className="w-full" disabled={loading}>
                                            {loading ? <Btnloader /> : "Deliver"}
                                        </Button>
                                    </DialogClose>

                                </DialogFooter>
                            </form>
                        </Form>
                    </ScrollArea>


                </DialogContent>

            </Dialog>


        </>
    );
};

export default NewDeliveryForm;
