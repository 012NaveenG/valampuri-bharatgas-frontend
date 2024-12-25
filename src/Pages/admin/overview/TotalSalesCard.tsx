import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { IndianRupee } from 'lucide-react';

type SaleAmt = {
    todaysSalesAmt: number; // Adjusted prop name to be consistent
}

const TotalSalesCard = ({ todaysSalesAmt }: SaleAmt) => {
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle>Today's Sales</CardTitle>
                    <CardDescription>
                        <IndianRupee />
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {/* Display the dynamic total sales amount */}
                <h1 className="text-3xl font-bold flex items-center">
                    <IndianRupee /> {todaysSalesAmt.toLocaleString()}
                </h1>
            </CardContent>
        </Card>
    )
}

export default TotalSalesCard;
