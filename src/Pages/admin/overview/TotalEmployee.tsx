
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Users } from 'lucide-react';

type TotalEmployee ={
    totalEmployees:number
}

const TotalEmployee = ({totalEmployees}:TotalEmployee) => {
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <div className="flex justify-between">

                    <CardTitle>Total Employees</CardTitle>
                    <CardDescription>
                        <Users />
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold flex items-center ">{totalEmployees}</h1>
            </CardContent>

        </Card>
    )
}

export default TotalEmployee
