import React from 'react'
import { DataTable } from './DataTable'

const DataTableMain = (props: any) => {
    const { columns, data } = props

    return (
        <div className='container'>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default DataTableMain