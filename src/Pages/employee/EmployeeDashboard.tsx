import Navbar from "@/components/Navbar.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import axios from "axios";
import { getItemWithExpiry } from "@/middleware/localstorage.middleware.ts";
import NewDeliveryForm from "./NewDeliveryForm.tsx";

interface SignedEmployee {
  emp_id: string;
}

interface OpeningDetails {
  id: string;
  total_full_cylinders: number;
  total_empty_cylinders: number;
  assigned_area: string;
  Employee: {
    emp_name: string;
    emp_contact: string;
  };
  Truck: {
    truck_id: string
    truck_name: string;
    truck_number: string;
  };
}

interface Delivery {
  full_delivered: number;
  empty_delivered: number;
  Customer: {
    cust_id: string;
    cust_name: string;
  };
}
const EmployeeDashboard = () => {
  const [openingData, setOpeningData] = useState<OpeningDetails | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [refresh, setRefresh] = useState(false); // Refresh state to trigger useEffect
  const signedEmployee = getItemWithExpiry("signedIn") as SignedEmployee | null;

  // Fetch opening details
  useEffect(() => {
    const fetchOpeningData = async () => {
      try {
        const response = await axios.get(
          `/api/employee/opening-details/${signedEmployee?.emp_id}`
        );
        if (response.data.statusCode === 200) {
          setOpeningData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching opening details:", error);
      }
    };

    fetchOpeningData();
  }, [signedEmployee?.emp_id]);

  // Fetch deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(
          `/api/employee/delivery/${signedEmployee?.emp_id}`
        );
        if (response.data.statusCode === 200) {
          setDeliveries(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
  }, [signedEmployee?.emp_id, refresh]); // Depend on `refresh` state

  // Callback to handle delivery addition
  const handleDeliveryAdded = () => {
    setRefresh((prev) => !prev); // Toggle refresh state
  };

  return (
    <>
      <Navbar />
      <div className="sm:flex justify-center">
        <div className="flex items-center justify-center p-2 mt-10">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="text-xl">Employee Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between w-full">
                <p>Name</p>
                <p className="text-left">{openingData?.Employee.emp_name || "N/A"}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p>Contact</p>
                <p className="text-left">{openingData?.Employee.emp_contact || "N/A"}</p>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="text-xl">Truck Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between w-full">
                <p>Truck Name</p>
                <p>{openingData?.Truck.truck_name || "N/A"}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p>Truck No</p>
                <p>{openingData?.Truck.truck_number || "N/A"}</p>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="text-xl">Today's Opening</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between w-full">
                <p>Total Full</p>
                <p>{openingData?.total_full_cylinders || 0}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p>Total Empty</p>
                <p>{openingData?.total_empty_cylinders || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="px-6 mt-5 sm:w-full">
          <Separator />
          <div className="flex items-center justify-between my-2">
            <h1 className="text-lg font-bold">Today's Deliveries</h1>
            {/* Pass callback to NewDeliveryForm */}
            <NewDeliveryForm
              emp_id={String(signedEmployee?.emp_id)}
              truck_id={String(openingData?.Truck?.truck_id)}
              onDeliveryAdded={handleDeliveryAdded}
            />
          </div>
          <Table>
            <TableCaption>A list of your today's delivery.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sr.No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Full Del</TableHead>
                <TableHead className="text-right">Empty Del</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.length > 0 ? (
                deliveries.map((delivery, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{delivery.Customer.cust_name}</TableCell>
                    <TableCell>{delivery.full_delivered}</TableCell>
                    <TableCell className="text-right">
                      {delivery.empty_delivered}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No deliveries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
