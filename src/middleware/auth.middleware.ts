import { useEffect } from "react";
import { getItemWithExpiry } from "./localstorage.middleware";
import { useNavigate } from "react-router-dom";

// Define types for employee data
interface Emp {
    emp_id: string;
    emp_name: string;
    emp_contact: string;
    username: string;
    isAdmin: boolean;
    created_at: Date;
}

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve employee data from localStorage
        const emp_data = getItemWithExpiry("signedIn") as Emp | null;

        // If user is signed in
        if (emp_data) {
            const currentPath = window.location.pathname;

            // Redirect based on role
            if (emp_data.isAdmin) {
                if (currentPath === "/") {
                    navigate("/admin", { replace: true });
                }
            } else {
                if (currentPath === "/") {
                    navigate("/employee/dashboard", { replace: true });
                }
            }
        } else {
            // If user is not signed in, redirect to login page
            const currentPath = window.location.pathname;
            if (currentPath !== "/") {
                navigate("/", { replace: true });
            }
        }
    }, [navigate]);
};

export default useAuth;
