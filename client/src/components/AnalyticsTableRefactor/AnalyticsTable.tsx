"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface AnalyticsTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    statisticTitles: String[]
}

export function AnalyticsTable<TData, TValue>({
    columns,
    data,
    statisticTitles,
}: AnalyticsTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="flex rounded-md border">
            <div className="w-30">
                <Table>
                    <TableHeader>
                        <TableRow className="standard-row-height">
                            <TableHead className="text-center">Statistic</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            statisticTitles.map((statTitle) => (
                                <TableRow className="standard-row-height">
                                    <TableCell className="standard-cell-height">
                                        {statTitle}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="flex-1 flex-grow flex-col">
                {data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="standard-row-height">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="text-center">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="standard-row-height"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="standard-cell-height">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="h-full">
                                    <TableCell colSpan={columns.length} className="text-center">
                                        Empty data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex h-full justify-center items-center text-sm">
                        No data uploaded.
                    </div>
                )}
            </div>
        </div>
    )
}
