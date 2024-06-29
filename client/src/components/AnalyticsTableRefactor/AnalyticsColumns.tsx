import { ColumnDef } from "@tanstack/react-table";

const AnalyticsColumns = <T extends Record<string, any>>(headers: string[]): ColumnDef<T>[] => {
  const columns: ColumnDef<T>[] = headers.map((header: string) => ({
    id: header,
    accessorKey: header,
    header: header,
    cell: ({ row }) => (
      <div className='lowercase'>{row.getValue(header)}</div>
    )
  }))

  return columns
}

export default AnalyticsColumns