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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Btnloader from "@/components/Btnloader.tsx";
import { setItemWithExpiry } from "@/middleware/localstorage.middleware.ts";



// Define Zod schema for form validation
const formSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters" })
        .max(50, { message: "Username cannot exceed 50 characters" }),
    password: z
        .string()
        .min(2, { message: "Password must be at least 2 characters" })
        .max(50, { message: "Password cannot exceed 50 characters" }),
});

// TypeScript types inferred from the Zod schema
type LoginFormValues = z.infer<typeof formSchema>;

const Login: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    // Initialize React Hook Form
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    // Handle form submission
    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("/api/employee/login", data);

            if (response.data.statusCode === 200) {

                setItemWithExpiry("signedIn", response.data?.data, 12)

                toast({
                    title: "Login Successful",
                    description: "Welcome back!",
                });

                // Navigate based on user role
                if (response.data.data?.isAdmin === true) {
                    navigate("/admin");
                } else {
                    navigate("/employee/opening-details");
                }
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

        const fetchData = async () => {
            try {
                const response = await axios.get("/api/admin/customer/?page=1&limit=5");
                setData(response.data.data);
             
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }
        fetchData();
    }, []);

    console.dir(data)

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center p-2 mt-10">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="text-xl">Login</CardTitle>
                        <CardDescription>
                            Fill in your credentials to log in to the portal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                {/* Username Field */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Username"
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
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Password"
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

                                {/* Error Message */}
                                {error && <p className="text-red-500 mt-2">{error}</p>}

                                {/* Submit Button */}
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Btnloader /> : "Login"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Login;
