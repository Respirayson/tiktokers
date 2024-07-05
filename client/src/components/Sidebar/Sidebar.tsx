import React from "react"
import SidebarHeader from "./SidebarHeader"
import SidebarFooter from "./SidebarFooter"
import SidebarBody from "./SidebarBody";

const Sidebar = () => {
    return (
        <div id="sidebar" className="w-full h-full flex flex-col justify-between" aria-label="Sidebar">
            <div className="p-4"><SidebarHeader /></div>
            <div className="flex h-full border-y-2"><SidebarBody /></div>
            <div className="p-4"><SidebarFooter /></div>
        </div>
    )
}

export default Sidebar