import { DataTableProp } from './DataTable.type'

const DataTable = (data: DataTableProp) => {
  const tableHeaderInfo = data.headers.map((value, index) => (
    <th key={index} className='px-2 py-2 border-2 border-white text-center text-lg'>
      {value}
    </th>
  ));
  
  const tableBodyInfo = data.body.map((dataPoint, index) => (
    <tr key={index}>
      {Object.entries(dataPoint).map(([key, value]) => (
        <td className='px-2 py-2 border-2 border-white text-center text-lg' key={key}>{value}</td>
      ))}
    </tr>
  ));

  return (
    <div className='max-h-[85vh] max-w-[60vw] m-2 overflow-auto'>
      <table className='table-auto mr-1'>
        <thead>
          <tr>
            {tableHeaderInfo}
          </tr>
        </thead>
        <tbody>
          {tableBodyInfo}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
