import { AnalyticsTableProp } from './AnalyticsTable.type'

const AnalyticsTable = (prop: AnalyticsTableProp) => {
    const { headers, rowNames, rowData } = prop;

    const tableHeaderInfo = headers.map((value, index) => (
        <th key={index} className='py-2'>
          {value}
        </th>
      ));

    const tableBodyInfo = rowNames.map((name, index) => (
        <tr key={index}>
            <td className='border-t-2 text-end text-sm font-semibold' key={`header-name-${index}`}>{name}</td>
            {rowData.map((analyticsPoint, dataIndex) => (
                <td className='border-t-2 text-center text-sm' key={`${name}-${dataIndex}`}>{analyticsPoint[name]}</td>
            ))}
        </tr>
    ))

    return (
      <div className='h-[30vh] w-[60vw] flex flex-col items-center border-2 rounded-lg shadow-md overflow-auto no-vertical-scrollbar'>
        <table className='h-full w-11/12 table-auto'>
          <thead>
            <tr className='text-center text-sm text-stone-400'>
              <th key="headers" className='w-1/6 py-2'></th>
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

export default AnalyticsTable
