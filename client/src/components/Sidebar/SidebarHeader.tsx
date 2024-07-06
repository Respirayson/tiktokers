const SidebarHeader = () => {
    return (
        <div>
            <a
                href="#"
                className="flex items-center rounded-lg py-2 text-slate-900 dark:text-white"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 lucide lucide-bot"
                >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                </svg>
                <span className="ml-3 text-base font-mono font-semibold">MLBB</span>
            </a>
            <span className="mb-10 font-mono text-left">
                Machine Learning Basics for Beginners
            </span>
        </div>
    )
}

export default SidebarHeader