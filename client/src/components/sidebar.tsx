import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "./multi-select";
import { useState } from "react";
import { Operation, OperationsBoxResponsive } from "./operations-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { DataTable } from "./DataTable/DataTable";
import DataColumns from "./DataTable/DataColumns";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5001";

const Sidebar = ({
  fileName,
  columnsList,
  setColumnsList,
  selectedButton,
  setBody,
  hiddenLayers,
  epochs,
  setHiddenLayers,
  setEpochs,
  setSelectedButton,
  problem,
  setProblem,
  dropout,
  setDropout,
  batchNorm,
  setBatchNorm,
}: {
  fileName: string;
  columnsList: string[];
  setColumnsList: React.Dispatch<React.SetStateAction<string[]>>;
  selectedButton: string;
  setBody: React.Dispatch<React.SetStateAction<object[]>>;
  hiddenLayers: string;
  epochs: number;
  setHiddenLayers: React.Dispatch<React.SetStateAction<string>>;
  setEpochs: React.Dispatch<React.SetStateAction<number>>;
  setSelectedButton: React.Dispatch<React.SetStateAction<string>>;
  problem: string;
  setProblem: React.Dispatch<React.SetStateAction<string>>;
  dropout: number;
  setDropout: React.Dispatch<React.SetStateAction<number>>;
  batchNorm: boolean;
  setBatchNorm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [previewColumnsList, setPreviewColumnsList] =
    useState<string[]>(columnsList);
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null
  );
  const [data, setData] = useState<object[]>([]);
  const [open, setOpen] = useState(false);
  const isSingleOperation = [
    "exploration/oversample",
    "exploration/smote",
    "exploration/undersample",
  ];

  const handleTrain = async () => {
    try {
      let api_url = ""
      switch(problem) {
        case "classification":
          api_url = "http://localhost:5001/train"
          break;
        case "regression":
          api_url = "http://localhost:5001/train/linreg"
          break;
        default:
          alert("Select ML problem")
          return
      }
      setSelectedButton("Results")
      const response = await axios.post(`${api_url}`, {
        filename: fileName,
        target_column: targetColumn,
        hidden_layers: hiddenLayers.split(",").map((v) => parseInt(v.trim())),
        epochs: epochs,
        selected_columns: selectedColumns,
        dropout: dropout,
        batchNorm: batchNorm,
      });
      console.log(response.data);
      toast.info("Training started!");
    } catch (error) {
      toast.error("Error starting training!");
      console.error("Error starting training:", error);
    }
  };

  const handlePreviewClick = async () => {
    const reqBody: {
      filename: string;
      target_column?: string;
      columns?: string[];
      strategy?: string;
      threshold?: number;
    } = {
      filename: fileName,
    };

    if (isSingleOperation.includes(selectedOperation?.value ?? "")) {
      reqBody.target_column = targetColumn;
    } else if (selectedOperation?.value === "exploration/impute") {
      reqBody.strategy = targetColumn;
    } else if (selectedOperation?.value === "preprocessing/features") {
      reqBody.threshold = parseFloat(targetColumn);
    } else {
      reqBody.columns = selectedColumns;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/${selectedOperation?.value}`,
        reqBody
      );
      let responseData = response.data;

      // Check if responseData is a JSON string
      if (typeof responseData === "string") {
        responseData = JSON.parse(responseData);
      }

      setPreviewColumnsList(Object.keys(responseData.data[0]));
      setData(responseData.data);
      toast.success("Preview generated successfully!");
    } catch (error) {
      console.error("Error generating preview:", error);
      toast.error("Error generating preview!");
    }
  };

  const handleClick = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/update`, {
        filename: fileName,
        data: data,
      });
      console.log(response.data);
      setBody(data);
      setColumnsList(previewColumnsList);
      setOpen(false);
      setSelectedColumns([]);
      setTargetColumn("");
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("Error saving changes!");
    }
  };

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
          <span className="ml-3 text-base font-semibold">MLBB</span>
        </a>
        <span className="mb-10 ml-3 font-thin text-left">
          Machine Learning Basics for Beginners
        </span>

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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                          <button onClick={() => setProblem("classification")}>
                            Classification
                          </button>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-start rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                      >
                        <span className="ml-3 whitespace-nowrap">
                          <button onClick={() => setProblem("regression")}>
                            Regression
                          </button>
                        </span>
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </li>

            {selectedButton === "Analytics" && (
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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                      {!selectedOperation && (
                        <li>
                          <OperationsBoxResponsive
                            selectedOperation={selectedOperation}
                            setSelectedOperation={setSelectedOperation}
                          />
                        </li>
                      )}
                      <li>
                        {selectedOperation && (
                          <div className="flex flex-col justify-center gap-4">
                            <div className="flex flex-row gap-8">
                              <a
                                className="cursor-pointer"
                                onClick={() => setSelectedOperation(null)}
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
                                  className=" h-5 w-5 lucide lucide-arrow-left"
                                >
                                  <path d="m12 19-7-7 7-7" />
                                  <path d="M19 12H5" />
                                </svg>
                              </a>
                              <h3>{selectedOperation.label}</h3>
                            </div>
                            {selectedOperation?.value ===
                              "exploration/impute" ||
                            selectedOperation?.value ===
                              "preprocessing/features" ? (
                              <>
                                <Input
                                  type="string"
                                  placeholder={
                                    selectedOperation.value ===
                                    "exploration/impute"
                                      ? "Eg. mean / median / mode" // for impute strategy
                                      : "Enter threshold" // for select features threshold
                                  }
                                  value={targetColumn}
                                  onChange={(e) =>
                                    setTargetColumn(e.target.value)
                                  }
                                />
                              </>
                            ) : isSingleOperation.includes(
                                selectedOperation?.value
                              ) ? (
                              <Select
                                onValueChange={setTargetColumn}
                                value={targetColumn}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select the target column" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Columns</SelectLabel>
                                    {columnsList.map((column) => (
                                      <SelectItem key={column} value={column}>
                                        {column}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            ) : (
                              <MultiSelect
                                options={columnsList.map((column) => ({
                                  value: column,
                                  label: column,
                                }))}
                                onValueChange={setSelectedColumns}
                                defaultValue={selectedColumns}
                                placeholder="Select columns"
                                variant="inverted"
                                animation={2}
                                maxCount={3}
                              />
                            )}
                            {/* <Button onClick={handleClick} variant="default">Apply</Button> */}
                            <Dialog open={open} onOpenChange={setOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  onClick={handlePreviewClick}
                                >
                                  Apply
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="min-w-[80%] overflow-auto h-[80%]">
                                <DialogHeader>
                                  <DialogTitle>Preview</DialogTitle>
                                  <DialogDescription>
                                    Preview you changes here. Click save when
                                    you're done.
                                  </DialogDescription>
                                </DialogHeader>
                                <DataTable
                                  data={data}
                                  columns={DataColumns(previewColumnsList)}
                                />
                                <DialogFooter>
                                  <Button onClick={handleClick}>
                                    Save changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </li>
            )}

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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                    {/* <li>
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
                    </li> */}
                    <li className="flex flex-col gap-2">
                      <Select
                        onValueChange={setTargetColumn}
                        value={targetColumn}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select the target column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Columns</SelectLabel>
                            {columnsList.map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <MultiSelect
                        options={columnsList.map((column) => ({
                          value: column,
                          label: column,
                        }))}
                        onValueChange={setSelectedColumns}
                        defaultValue={selectedColumns}
                        placeholder="Select columns"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                      />
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left mt-1">
                        Epochs
                      </label>
                      <Input
                        type="number"
                        placeholder="Number of epochs"
                        value={epochs}
                        onChange={(e) => setEpochs(Number(e.target.value))}
                      />
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left mt-1">
                        Hidden Layers (eg: 128,64)
                      </label>
                      <Input
                        type="string"
                        placeholder="Hidden layers (comma separated)"
                        value={hiddenLayers}
                        onChange={(e) => setHiddenLayers(e.target.value)}
                      />
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left mt-1">
                        Dropout (0 to 1)
                      </label>
                      <Input
                        type="number"
                        placeholder="Dropout Rate"
                        min="0"
                        max="1"
                        step="0.1"
                        value={dropout}
                        onChange={(e) => setDropout(Math.min(Math.max(Number(e.target.value), 0), 1))}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="batch-norm"
                          checked={batchNorm}
                          onCheckedChange={() => setBatchNorm(!batchNorm)}
                        />
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Apply Batch Normalisation
                        </label>
                      </div>
                      <Button onClick={handleTrain} className="mt-4">
                        Start Training
                      </Button>
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="ml-3 whitespace-nowrap">Settings</span>
              </a>
            </li>
          </ul>
        </Accordion>

        <div className="flex flex-col mt-12 gap-4"></div>

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
      </div>
    </aside>
  );
};

export default Sidebar;
