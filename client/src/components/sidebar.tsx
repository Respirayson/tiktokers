import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Sidebar = () => {
  return (
    <aside
      id="sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform"
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-primary-foreground">
        <a
          href="#"
          className="flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="h-5 w-5 lucide lucide-bot"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
          <span className="ml-3 text-base font-semibold">MLBB</span>
        </a>
        <span className="mb-10 ml-3 font-thin text-left">Machine Learning Basics for Beginners</span>

        <Accordion type="single" collapsible className="w-full">
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <a
                    href="#"
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-5 w-5 lucide lucide-brain-cog"
                    >
                      <path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588 4 4 0 0 0 7.636 2.106 3.2 3.2 0 0 0 .164-.546c.028-.13.306-.13.335 0a3.2 3.2 0 0 0 .163.546 4 4 0 0 0 7.636-2.106 4 4 0 0 0 .556-6.588 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5" />
                      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
                      <path d="M6 18a4 4 0 0 1-1.967-.516" />
                      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="m15.7 10.4-.9.4" />
                      <path d="m9.2 13.2-.9.4" />
                      <path d="m13.6 15.7-.4-.9" />
                      <path d="m10.8 9.2-.4-.9" />
                      <path d="m15.7 13.5-.9-.4" />
                      <path d="m9.2 10.9-.9-.4" />
                      <path d="m10.5 15.7.4-.9" />
                      <path d="m13.1 9.2.4-.9" />
                    </svg>
                    <span className="ml-3 whitespace-nowrap">
                      Select ML Problem
                    </span>
                  </a>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm font-medium">
                    <li>
                      <a
                        href="#"
                        className="flex items-start rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                      >
                        <span className="ml-3 whitespace-nowrap">
                          Classification
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-start rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                      >
                        <span className="ml-3 whitespace-nowrap">
                          Regression
                        </span>
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </li>

            <li>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <a
                    href="#"
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="w-5 h-5 lucide lucide-wrench"
                    >
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                    <span className="ml-3 whitespace-nowrap">
                      Preprocessing Operations
                    </span>
                  </a>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm font-medium">
                    <li>
                      <a
                        href="#"
                        className="flex items-start rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                      >
                        <span className="ml-3 whitespace-nowrap">
                          Data Cleaning
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-start rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                      >
                        <span className="ml-3 whitespace-nowrap">
                          Data Transformation
                        </span>
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </li>

            <li>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <a
                    href="#"
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 lucide lucide-package"
                      width="24"
                      height="24"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M16.5 9.4 7.55 4.24" />
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.29 7 12 12 20.71 7" />
                      <line x1="12" x2="12" y1="22" y2="12" />
                    </svg>
                    <span className="ml-3 whitespace-nowrap">Select Model</span>
                  </a>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm font-medium">
                    <li>
                      <a
                        href="#"
                        className="flex items-start rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                      >
                        <span className="ml-3 whitespace-nowrap">
                          Linear Regression
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-start rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                      >
                        <span className="ml-3 whitespace-nowrap">
                          Logistic Regression
                        </span>
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 lucide lucide-settings"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="ml-3 whitespace-nowrap">Settings</span>
              </a>
            </li>
          </ul>
        </Accordion>

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
              stroke-width="2"
              className="h-5 w-5 text-black dark:text-white lucide lucide-more-horizontal"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
