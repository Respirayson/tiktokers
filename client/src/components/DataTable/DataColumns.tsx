import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

const DataColumns = <T extends Record<string, any>>(headers: string[]): ColumnDef<T>[] => {
  const columns: ColumnDef<T>[] = headers.map((header: string) => ({
    id: header,
    accessorKey: header,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {header}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className='lowercase'>{row.getValue(header)}</div>
    )
  }))

  return columns
}

export default DataColumns