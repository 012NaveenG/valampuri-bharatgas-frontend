import { useEffect, useState } from "react"
import AreaGraph from "../charts/AreaGraph.tsx"
import SalesTable from "../tables/SalesTable.tsx"
import TotalCustomers from "./TotalCustomers.tsx"
import TotalEmployee from "./TotalEmployee.tsx"
import TotalSalesCard from "./TotalSalesCard.tsx"
import axios from "axios"

interface OverviewData {
    todaysSales: any[]; // Define more specific types based on expected data structure
    todaystotalSalesAmt: number;
    monthlySales: any[]; // Define more specific types based on expected data structure
    totalEmployees: number;
    totalCustomers: number;
}

const Index = () => {
    const [overviewData, setOverviewData] = useState<OverviewData | null>(null); // State initialized as null

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                const response = await axios.get(`/api/admin/overview`);
                if (response.data?.statusCode === 200) {
                    setOverviewData(response.data?.data);
                }
            } catch (error) {
                console.error("Failed to fetch overview data:", error);
            }
        };

        fetchOverviewData(); // Ensure this is called to fetch the data
    }, []);

    // Ensure safe access to data properties by using optional chaining
    return (
        <div className="flex w-full h-screen justify-center items-center mt-5">
            <div className="h-full w-full grid grid-cols-6 grid-rows-4 gap-4">
                <div className="col-span-2 row-span-1 flex items-center justify-center">
                    {overviewData && (
                        <TotalSalesCard todaysSalesAmt={overviewData.todaystotalSalesAmt} />
                    )}
                </div>
                <div className="col-span-2 row-span-1 flex items-center justify-center">
                    {overviewData && (
                        <TotalEmployee totalEmployees={overviewData.totalEmployees} />
                    )}
                </div>
                <div className="col-span-2 row-span-1 rounded-xl bg-muted/50 flex items-center justify-center">
                    {overviewData && (
                        <TotalCustomers totalCustomers={overviewData.totalCustomers} />
                    )}
                </div>
                <div className="col-span-2 row-span-2 rounded-xl flex items-center justify-center">
                    {overviewData && (
                        <AreaGraph monthlySales={overviewData.monthlySales} />
                    )}
                </div>
                <div className="col-span-4 row-span-3 rounded-xl flex items-center justify-center">
                    {overviewData && (
                        <SalesTable todaysSales={overviewData.todaysSales} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Index;
