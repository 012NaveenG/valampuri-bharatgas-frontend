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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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
import { useEffect, useState } from "react"
import AddCustomer from "./AddCustomer"
import axios from "axios"
import { exportDataToExcel } from "@/hooks/download-excel-data"

import EditCustomer from "./EditCustomer.tsx"

// Updated Type
export type Customer = {
    cust_id: string
    cust_name: string
    pending_empty: number
    pending_payment: number
    area_name: string
    area_no: number
    deposit: number
}



// Updated Columns
export const columns: ColumnDef<Customer>[] = [
    {
        header: "Sr. No",
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        accessorKey: "cust_name",
        header: "Customer Name",
        cell: ({ row }) => <div>{row.getValue("cust_name")}</div>,
    },
    {
        accessorKey: "area_name",
        header: "Area Name",
        cell: ({ row }) => <div>{row.getValue("area_name")}</div>,
    },
    {
        accessorKey: "area_no",
        header: "Area No",
        cell: ({ row }) => <div>{row.getValue("area_no")}</div>,
    },

    {
        accessorKey: "pending_payment",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Pending Payment
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = row.getValue("pending_payment") as number
            const formatted = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(amount)
            return <div>{formatted}</div>
        },
    },

    {
        accessorKey: "deposit",
        header: "Deposit",
        cell: ({ row }) => {
            const deposit = row.getValue("deposit") as number
            const formatted = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(deposit)
            return <div>{formatted}</div>
        },
    },
    {
        accessorKey: "pending_empty",
        header: "Pending Empty",
        cell: ({ row }) => <div>{row.getValue("pending_empty")}</div>,
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const customer = row.original; // Access the row's original data

        
         

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="grid grid-cols-1 gap-2">
                        <EditCustomer customer={customer}/>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }

]

const Index = () => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [customers, setCustomers] = useState<Customer[]>([])

    const table = useReactTable({
        data: customers,
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

    const downloadData = () => {
        exportDataToExcel(customers, "customer")
    }

    useEffect(() => {

        const fetchallCustomers = async () => {
            const response = await axios.get(`/api/admin/customer`)

            if (response.data.statusCode === 200) {
                setCustomers(response.data?.data)
            }
        }

        fetchallCustomers()

    }, [])

    return (
        <>
            <div className="flex items-center justify-end gap-4 my-5">
                <Button
                    size={"sm"}
                    onClick={downloadData}
                >Download</Button>
                <AddCustomer />
            </div>


            <div className="w-full">
                <div className="flex items-center py-4">

                    <Input
                        placeholder="Filter customers..."
                        value={(table.getColumn("cust_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("cust_name")?.setFilterValue(event.target.value)
                        }
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
