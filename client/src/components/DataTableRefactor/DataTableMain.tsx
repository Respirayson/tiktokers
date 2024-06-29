import React from 'react'
import { DataTable } from './DataTable'

const DataTableMain = (props: any) => {
    const { columns, data } = props

    return (
        <div className='w-[60vw]'>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default DataTableMain