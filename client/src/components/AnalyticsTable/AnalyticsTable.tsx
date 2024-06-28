import React from 'react'
import { AnalyticsTableProp } from './AnalyticsTable.type'

const AnalyticsTable = (prop: AnalyticsTableProp) => {
    const { headers, rowNames, rowData } = prop;

    const tableHeaderInfo = headers.map((value, index) => (
        <th key={index} className='px-2 py-2 border-2 border-white text-center text-lg'>
          {value}
        </th>
      ));

    const tableBodyInfo = rowNames.map((name, index) => (
        <tr key={index}>
            <td className='px-2 py-2 border-2 border-white text-center text-lg' key={`header-name-${index}`}>{name}</td>
            {rowData.map((analyticsPoint, dataIndex) => (
                <td className='px-2 py-2 border-2 border-white text-center text-lg' key={`${name}-${dataIndex}`}>{analyticsPoint[name]}</td>
            ))}
        </tr>
    ))

    return (
      <div className='max-h-[20vh] max-w-[60vw] m-2 overflow-auto'>
        <table className='table-auto mr-1'>
          <thead>
            <tr>
              <th key="blank" className='px-2 py-2 border-2 border-white text-center text-lg'></th>
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
