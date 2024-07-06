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

// Define a utility type that extends TData to include the statistic property
export type StatisticData<TData> = TData & {
    statistic: string;
};

interface AnalyticsTableProps<TData, TValue> {
    columns: ColumnDef<StatisticData<TData>, TValue>[]
    data: StatisticData<TData>[]
    statisticTitles: string[]
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
        <>
            <div className="flex m-2 pb-2 text-3xl font-semibold">
                <span>Analytics Table</span>
            </div>
            <div className="flex flex-col rounded-md border">
                <div className="flex-1 flex-grow flex-col overflow-auto">
                    {data.length > 0 ? (
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="standard-row-height">
                                        <TableHead className="text-center">Statistic</TableHead>
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
                                            <TableCell>
                                                {statisticTitles[row.index]}
                                            </TableCell>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="standard-cell-height">
                                                    {row.original.statistic === "histogram" ? (
                                                        <img
                                                            src={`data:image/png;base64,${cell.getValue()}`}
                                                            alt={`Histogram of ${cell.column.id}`}
                                                            style={{ maxWidth: '180px', maxHeight: '125px' }}
                                                        />
                                                    ) : (
                                                        flexRender(cell.column.columnDef.cell, cell.getContext())
                                                    )}
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
        </>

    )
}
