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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {  useCallback, useState } from "react"
import axios from "axios"
import { exportDataToExcel } from "@/hooks/download-excel-data"
import DatePickerWithRange from "./DateRangePicker"
import { format } from "date-fns"
// Updated Type
type SaleData = {
    full_delivered: number
    empty_delivered: number
    empty_received: number
    total_amount_received: number
    bal_payment: number
    payment_mode: string
    created_at: string
    Employee: {
        emp_name: string
    }
    Customer: {
        cust_name: string
    }
    Truck: {
        truck_name: string
    }
}


// Updated Columns
export const columns: ColumnDef<SaleData>[] = [
    {
        header: "Sr. No",
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        id: "Customer.cust_name",
        header: "Customer Name",
        accessorKey: "Customer.cust_name",
    },
    {
        accessorKey: "full_delivered",
        header: "Full Delivered",
        cell: ({ row }) => <div>{row.getValue("full_delivered")}</div>,
    },
    {
        accessorKey: "empty_delivered",
        header: "Empty Delivered",
        cell: ({ row }) => <div>{row.getValue("empty_delivered")}</div>,
    },
    {
        accessorKey: "empty_received",
        header: "Empty Received",
        cell: ({ row }) => <div>{row.getValue("empty_received")}</div>,
    },
    {
        accessorKey: "total_amount_received",
        header: "Total Amt Received",
        cell: ({ row }) => <div>{row.getValue("total_amount_received")}</div>,
    },
    {
        accessorKey: "payment_mode",
        header: "Mode",
        cell: ({ row }) => <div>{row.getValue("payment_mode")}</div>,
    },
    {
        accessorKey: "bal_payment",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Balance Payment
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = row.getValue("bal_payment") as number
            const formatted = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(amount)
            return <div className="ml-10">{formatted}</div>
        },
    },
    {
        header: "Delivered By",
        accessorKey: "Employee.emp_name",
    },
    {
        header: "Date",
        accessorKey: "created_at",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))
            return <div>{date.toLocaleString()}</div>
        },
    },



]

const Index = () => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [sales, setSales] = useState<SaleData[]>([])

     // Debounce function
     const debounce = (func: (...args: any[]) => void, delay: number) => {
        let timer: NodeJS.Timeout
        return (...args: any[]) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                func(...args)
            }, delay)
        }
    }

    // Fetch sales data based on the selected date range
    const fetchSalesData = useCallback(
        debounce(async (from: Date | undefined, to: Date | undefined) => {
            if (from && to) {
                try {
                    const response = await axios.get(`/api/admin/sales/report?fromDate=${format(from, "yyyy-MM-dd")}&ToDate=${format(to, "yyyy-MM-dd")}`)
    
                    if (response.data?.statusCode === 200) {
                        setSales(response.data?.data || [])
                    }
                } catch (error) {
                    setSales([])
                }
            }
        }, 500), // 500ms debounce delay
        []
    )

    

    const table = useReactTable({
        data: sales,
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
    })


    const downloadSalesData = ()=>{
        exportDataToExcel(sales,"SalesData")
    }

    return (
        <>
            <div className="flex items-center justify-end gap-4 my-5">
                <Button
                onClick={downloadSalesData}
                    size={"sm"}
                >Download</Button>

                <DatePickerWithRange onDateRangeChange={fetchSalesData} />
            </div>


            <div className="w-full">
                <div className="flex items-center py-4">

                    <Input
                        placeholder="Filter by Customer Name..."
                        value={(table.getColumn("Customer.cust_name")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("Customer.cust_name")?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

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
                                    <TableRow key={row.id}>
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
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Index
