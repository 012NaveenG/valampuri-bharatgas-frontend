
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Users } from 'lucide-react';

type TotalCustomer = {
    totalCustomers:number
}

const TotalCustomers = ({totalCustomers}:TotalCustomer) => {
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <div className="flex justify-between">

                    <CardTitle>Total Customers</CardTitle>
                    <CardDescription>
                        <Users />
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold flex items-center ">{totalCustomers}</h1>
            </CardContent>

        </Card>
    )
}


export default TotalCustomers
