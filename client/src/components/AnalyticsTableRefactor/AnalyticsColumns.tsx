import { ColumnDef } from "@tanstack/react-table";
import { StatisticData } from "./AnalyticsTable";

const AnalyticsColumns = (headers: string[]): ColumnDef<StatisticData<object>>[] => {
  const columns: ColumnDef<StatisticData<object>>[] = headers.map((header: string) => ({
    id: header,
    accessorKey: header,
    header: header,
    cell: ({ row }) => (
      <div className='lowercase'>{row.getValue(header)}</div>
    ),
  }));

  return columns;
};

export default AnalyticsColumns;