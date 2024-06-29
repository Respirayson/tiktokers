import { DataTableProp } from './DataTable.type'

const DataTable = (data: DataTableProp) => {
  const { headers, body, fileName } = data;
  
  const tableHeaderInfo = headers.map((value, index) => (
    <th key={index} className='px-2 pb-3 text-center text-base text-stone-400'>
      {value}
    </th>
  ));
  
  const tableBodyInfo = body.map((dataPoint, index) => (
    <tr key={index}>
      {Object.entries(dataPoint).map(([key, value]) => (
        <td className='px-2 py-3 border-t-2 text-center text-base' key={key}>{value}</td>
      ))}
    </tr>
  ));

  return (
    <div className='h-[50vh] w-[60vw] flex flex-col items-center border-2 rounded-lg shadow-md overflow-auto no-vertical-scrollbar'>
      <div className='w-11/12 flex flex-row justify-start'>
        <h3 className='py-6 text-xl font-bold text-left'>{fileName}*</h3>
      </div>
      <table className='h-full w-11/12 table-auto'>
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
