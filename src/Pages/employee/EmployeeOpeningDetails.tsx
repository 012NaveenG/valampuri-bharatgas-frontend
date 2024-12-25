import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Btnloader from "@/components/Btnloader.tsx";
import { getItemWithExpiry } from "@/middleware/localstorage.middleware.ts";


// Zod schema for form validation
const formSchema = z.object({
    emp_id: z.string(),
    emp_name: z.string().min(1, "Employee name is required."),
    truck_id: z.string().min(1, "Truck selection is required."),
    total_full: z.number().int().nonnegative("Total full must be a non-negative number."),
    total_empty: z.number().int().nonnegative("Total empty must be a non-negative number."),
    assigned_area: z.string().min(1, "Assigned area is required."),
});

interface SignedEmployee {
    emp_id: string
    emp_name: string; // Add other properties if needed
}

interface Trucks {
    truck_id: string
    truck_name: string
    truck_number: string
}
interface Areas {
    area_name: string
    area_no: number
}

type OpeningDetailsFormValues = z.infer<typeof formSchema>;

const EmployeeOpeningDetails = () => {
    const signedEmployee = getItemWithExpiry("signedIn") as SignedEmployee | null;// Retrieve the signed-in employee details
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Constants
    const [Trucks, setTrucks] = useState<Trucks[]>([]); // Array of Truck objects
    const [Areas, setAreas] = useState<Areas[]>([]);


    // Initialize form with default values
    const form = useForm<OpeningDetailsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emp_id: signedEmployee?.emp_id || "",
            emp_name: signedEmployee?.emp_name || "", // Use signedEmployee.emp_name or an empty string
            truck_id: "",
            total_full: 0,
            total_empty: 0,
            assigned_area: "",
        },
    });

    const onSubmit = async (data: OpeningDetailsFormValues) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("/api/employee/opening-details", data)

            if (response.data.statusCode === 200) {
                toast({
                    title: "Opening Details Filled",
                    description: "Details filled successfully!",
                });

                navigate("/employee/dashboard", { replace: true })
            }
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

    useEffect(() => {
        const fetchAreasAndTrucks = async () => {
            const response = await axios.get("/api/employee/areas-trucks")

            if (response.data.statusCode === 200) {
                setTrucks(response.data.data.trucks)
                setAreas(response.data.data.areas)
            }
        }
        fetchAreasAndTrucks()
    }, [])

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center p-2 mt-10">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="text-xl">Opening Details</CardTitle>
                        <CardDescription>
                            Fill opening details before going for delivery
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Employee Name */}
                                <FormField
                                    control={form.control}
                                    name="emp_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Employee Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Name"
                                                    value={field.value} // Prepopulate the value
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Truck Selection */}
                                <FormField
                                    control={form.control}
                                    name="truck_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Truck</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Truck" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Trucks.map((truck) => (
                                                            <SelectItem key={truck.truck_id} value={truck.truck_id}>
                                                                {truck.truck_name} - {truck.truck_number}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Total Full */}
                                <FormField
                                    control={form.control}
                                    name="total_full"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Full</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="Total Full" value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Total Empty */}
                                <FormField
                                    control={form.control}
                                    name="total_empty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Empty</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="Total Empty" value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Assigned Area */}
                                <FormField
                                    control={form.control}
                                    name="assigned_area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assigned Area</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Area" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Areas.map((area) => (
                                                            <SelectItem key={area.area_no} value={area.area_name}>
                                                                {area.area_name} , Area No: {area.area_no}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {error && <p className="text-red-500 mt-2">{error}</p>}

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? <Btnloader /> : "Submit"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};


export default EmployeeOpeningDetails;
