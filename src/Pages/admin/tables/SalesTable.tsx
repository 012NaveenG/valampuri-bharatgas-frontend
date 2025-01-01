import React, { useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader } from "@/components/ui/card";

// Sale type definition
export type Sale = {
    sale_id: string;
    delivered_by: string;
    delivered_to: string;
    truck_id: string;
    full_delivered: number;
    empty_delivered: number;
    empty_received: number;
    total_amount_received: number;
    bal_payment: number;
    payment_mode: string;
    created_at: string;
    Customer: {
        cust_id: string;
        cust_name: string;
    };
    Employee: {
        emp_id: string;
        emp_name: string;
    };
};

// Column definitions with types
const columns: ColumnDef<Sale>[] = [
    {
        accessorKey: "sale_id",
        header: "Sr. No",
        cell: ({ row }) => <div className="ml-5">{row.index + 1}</div>, // Add 1 to the index to make it 1-based
    },
    {
        accessorKey: "Customer.cust_name",
        header: "Customer",
        cell: ({ row }) => <div className="capitalize">{row.original.Customer.cust_name}</div>,
    },
    {
        accessorKey: "Employee.emp_name",
        header: "Delivery Man",
        cell: ({ row }) => <div className="capitalize">{row.original.Employee.emp_name}</div>,
    },
    {
        accessorKey: "total_amount_received",
        header: "Total Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total_amount_received"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "bal_payment",
        header: ({ column }) => (
            <div className="flex items-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Balance Payment
                    <ArrowUpDown />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("bal_payment"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
            }).format(amount);

            return <div className="font-medium ml-5">{formatted}</div>;
        },
    },
];

// Prop type definition for the component
interface SalesTableProps {
    todaysSales: Sale[]; // The prop that receives the sales data
}

const SalesTable: React.FC<SalesTableProps> = ({ todaysSales }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: todaysSales, // Use today's sales data passed as a prop
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <Card className="w-full h-full px-2">
            <div>
            <CardHeader>Today's Sales</CardHeader>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end mt-5">
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default SalesTable;