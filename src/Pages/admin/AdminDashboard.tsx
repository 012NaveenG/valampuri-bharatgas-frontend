import Navbar from "@/components/Navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OverviewIndex from "./overview/Index"
import CustomerIndex from './customers/Index.tsx'
import SalesIndex from './sales/Index.tsx'
import EmployeeIndex from "./employee/Index.tsx"


const AdminDashboard = () => {
    return (
        <div >
            <Navbar/>
            <Tabs defaultValue="employee" className="w-full  p-4">
                <TabsList>
                    <TabsTrigger value="overview">overview</TabsTrigger>
                    <TabsTrigger value="customers">customers</TabsTrigger>
                    <TabsTrigger value="sales">sales</TabsTrigger>
                    <TabsTrigger value="employee">employee</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <OverviewIndex/>
                </TabsContent>
                <TabsContent value="customers">
                    <CustomerIndex/>
                </TabsContent>
                <TabsContent value="sales">
                    <SalesIndex/>
                </TabsContent>
                <TabsContent value="employee">
                    <EmployeeIndex/>
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default AdminDashboard
