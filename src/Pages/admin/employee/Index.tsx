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
import { ChevronDown, MoreHorizontal } from "lucide-react"

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
import axios from "axios"
import { exportDataToExcel } from "@/hooks/download-excel-data"
import EditEmployee from "./EditEmployee.tsx"
import AddEmployee from "./AddEmployee.tsx"

// Updated Type
export type Employee = {
    emp_id: string
    emp_name: string
    emp_contact: string
    username: string
    password: string
    isAdmin: boolean
}



// Updated Columns
export const columns: ColumnDef<Employee>[] = [
    {
        header: "Sr. No",
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        id:"emp_name",
        accessorKey: "emp_name",
        header: "Employee Name",
        cell: ({ row }) => <div>{row.getValue("emp_name")}</div>,
    },
    {
        accessorKey: "emp_contact",
        header: "Contact",
        cell: ({ row }) => <div>{row.getValue("emp_contact")}</div>,
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => <div>{row.getValue("username")}</div>,
    },
    {
        accessorKey: "password",
        header: "Password",
        cell: ({ row }) => <div>{row.getValue("password")}</div>,
    },
    {
        accessorKey: "isAdmin",
        header: "Role",
        cell: ({ row }) => <div>{row.getValue("isAdmin")?<span className="bg-green-500 p-1 rounded-md font-bold">Admin</span>:""}</div>,
    },

    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const Employee = row.original; // Access the row's original data

           
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="grid grid-cols-1 gap-2">
                        <EditEmployee employee={Employee}/>
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
    const [Employees, setEmployees] = useState<Employee[]>([])

    const table = useReactTable({
        data: Employees,
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
        exportDataToExcel(Employees, "Employee")
    }

    useEffect(() => {

        const fetchallEmployees = async () => {
            const response = await axios.get(`/api/admin/employee`)

            if (response.data.statusCode === 200) {
                setEmployees(response.data?.data)
            }
        }

        fetchallEmployees()

    }, [])

    return (
        <>
            <div className="flex items-center justify-end gap-4 my-5">
                <Button
                    size={"sm"}
                    onClick={downloadData}
                >Download</Button>
                <AddEmployee/>
            </div>


            <div className="w-full">
                <div className="flex items-center py-4">

                    <Input
                        placeholder="Filter Employees..."
                        value={(table.getColumn("emp_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("emp_name")?.setFilterValue(event.target.value)
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
