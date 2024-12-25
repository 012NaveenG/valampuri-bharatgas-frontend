import AdminDashboard from "@/admin/dashboard/AdminDashboard"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
    return (
        <div>
            <AdminDashboard />
            <Outlet />
        </div>
    )
}

export default AdminLayout
