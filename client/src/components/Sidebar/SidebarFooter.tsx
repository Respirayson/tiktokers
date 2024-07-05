import React from 'react'

const SidebarFooter = () => {
    return (
        <div className="mt-auto flex">
            <div className="flex w-full justify-between">
                <span className="text-sm font-medium text-black dark:text-white">
                    Tiktokers
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    aria-roledescription="more menu"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5 text-black dark:text-white lucide lucide-more-horizontal"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                </svg>
            </div>
        </div>
    )
}

export default SidebarFooter