import { useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Binary, Package, Settings, Wrench } from 'lucide-react'
import ProblemsNavBody from './ProblemsNavBody'
import ModelsNavBody from './ModelsNavBody'
import { Operation } from '../operations-box'
import { toast } from 'react-toastify'
import axios from 'axios'
import OperationsNavBody from './OperationsNavBody'

const API_URL = import.meta.env.VITE_SERVER_URL;

const SidebarBody = ({
    fileName,
    columnsList,
    setColumnsList,
    setSelectedButton,
    setBody,
    epochs,
    setEpochs,
    problem,
    setProblem,
    learningRate,
    setLearningRate,
    gradClipping,
    setGradClipping,
}: {
    fileName: string;
    columnsList: string[];
    setColumnsList: React.Dispatch<React.SetStateAction<string[]>>;
    setSelectedButton: React.Dispatch<React.SetStateAction<string>>;
    setBody: React.Dispatch<React.SetStateAction<object[]>>;
    epochs: number;
    setEpochs: React.Dispatch<React.SetStateAction<number>>;
    problem: string;
    setProblem: React.Dispatch<React.SetStateAction<string>>;
    learningRate: number;
    setLearningRate: React.Dispatch<React.SetStateAction<number>>;
    gradClipping: boolean;
    setGradClipping: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    // Handle side nav bar button changes
    const [selectedNavButton, setSelectedNavButton] = useState('settings') // Possible states: problems, models, operations, settings

    // Coped from old Sidebar
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [previewColumnsList, setPreviewColumnsList] =
        useState<string[]>(columnsList);
    const [targetColumn, setTargetColumn] = useState<string>("");
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
        null
    );
    const [data, setData] = useState<object[]>([]);
    const isSingleOperation = [
        "exploration/oversample",
        "exploration/smote",
        "exploration/undersample",
    ];
    const [items, setItems] = useState<{ name: string; id: number; units?: number, rate?: number }[]>([]);
    

    // Training function
    const handleTrain = async () => {
        try {
            let api_url = ""
            switch (problem) {
                case "classification":
                    api_url = `${API_URL}/train`
                    break;
                case "regression":
                    api_url = `${API_URL}/train/linreg`
                    break;
                default:
                    alert("Select ML problem")
                    return
            }
            console.log(items)
            setSelectedButton("Results")
            const response = await axios.post(`${api_url}`, {
                filename: fileName,
                target_column: targetColumn,
                hidden_layers: items,
                epochs: epochs,
                selected_columns: selectedColumns,
                learning_rate: learningRate,
                grad_clipping: gradClipping,
            });
            console.log(response.data);
            toast.info("Training started!");
        } catch (error) {
            toast.error("Error starting training!");
            console.error("Error starting training:", error);
        } finally {
            resetTargetAndSelectedColumns();
        }
    };

    // Preview function
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

        console.log(fileName)

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
                `${API_URL}/${selectedOperation?.value}`,
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

    // Handle Click
    const handleSaveChanges = async () => {
        try {
            const response = await axios.post(`${API_URL}/update`, {
                filename: fileName,
                data: data,
            });
            console.log(response.data);
            setBody(data);
            setColumnsList(previewColumnsList);
            resetTargetAndSelectedColumns();
            toast.success("Changes saved successfully!");
        } catch (error) {
            console.error("Error updating file:", error);
            toast.error("Error saving changes!");
        }
    };

    // Helper functions
    const handleNavButtonClick = (buttonName: string) => {
        setSelectedNavButton(buttonName)
    }
    const navButtonClass = (buttonName: string) => `rounded-lg ${selectedNavButton === buttonName ? 'bg-muted' : ''}`;
    const resetTargetAndSelectedColumns = () => {
        setSelectedColumns([]);
        setTargetColumn("");
    }

    // ProblemsNavBody functions
    const handleSelectProblem = (value: string) => {
        setProblem(value)
    }

    // ModelsNavBody functions
    const handleSetEpochs = (value: number) => {
        setEpochs(value)
    }
    const handleSetLearningRate = (value: number) => {
        setLearningRate(value)
    }
    const handleSetGradClipping = (value: boolean) => {
        setGradClipping(value)
    }
    const handleRemove = (id: number) => {
        setItems((items) => items.filter((item) => item.id !== id));
    };
    const handleUnitsChange = (id: number, units: number) => {
        setItems((items) =>
        items.map((item) => (item.id === id ? { ...item, units } : item))
        );
    };
    const handleRateChange = (id: number, rate: number) => {
        setItems((items) =>
        items.map((item) => (item.id === id ? { ...item, rate } : item))
        );
    }

    return (
        <div className='flex flex-1'>
            {/* Side nav bar buttons */}
            <div className='border-r-2'>
                <div className="grid gap-1 p-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={navButtonClass('operations')}
                                    aria-label="Operations"
                                    disabled={columnsList.length <= 0}
                                    onClick={() => handleNavButtonClick('operations')}
                                >
                                    <Wrench className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Preprocessing Operations
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={navButtonClass('problems')}
                                    aria-label="Problems"
                                    disabled={columnsList.length <= 0}
                                    onClick={() => handleNavButtonClick('problems')}
                                >
                                    <Binary className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                ML Problems
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={navButtonClass('models')}
                                    aria-label="Models"
                                    disabled={columnsList.length <= 0 || problem == ""}
                                    onClick={() => handleNavButtonClick('models')}
                                >
                                    <Package className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Models
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={navButtonClass('settings')}
                                    aria-label="Settings"
                                    onClick={() => handleNavButtonClick('settings')}
                                >
                                    <Settings className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Settings
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Body for selected side nav bar button */}
            <div className='flex flex-1 overflow-y-auto'>
                {selectedNavButton == "problems" && (
                    <ProblemsNavBody problem={problem} handleSelectProblem={handleSelectProblem} />
                )}
                {selectedNavButton == "operations" && (
                    <OperationsNavBody
                        columnsList={columnsList}
                        selectedColumns={selectedColumns}
                        setSelectedColumns={setSelectedColumns}
                        targetColumn={targetColumn}
                        setTargetColumn={setTargetColumn}
                        selectedOperation={selectedOperation}
                        setSelectedOperation={setSelectedOperation}
                        previewColumnsList={previewColumnsList}
                        previewData={data}
                        handlePreviewClick={handlePreviewClick}
                        handleSaveChanges={handleSaveChanges} />
                )}
                {selectedNavButton == "models" && (
                    <ModelsNavBody
                        epochs={epochs}
                        handleSetEpochs={handleSetEpochs}
                        learningRate={learningRate}
                        handleSetLearningRate={handleSetLearningRate}
                        gradClipping={gradClipping}
                        handleSetGradClipping={handleSetGradClipping}
                        handleTrain={handleTrain}
                        columnsList={columnsList}
                        selectedColumns={selectedColumns}
                        setSelectedColumns={setSelectedColumns}
                        targetColumn={targetColumn}
                        setTargetColumn={setTargetColumn}
                        items={items}
                        setItems={setItems}
                        handleRemove={handleRemove}
                        handleUnitsChange={handleUnitsChange}
                        handleRateChange={handleRateChange}
                    />
                )}
                {/* {selectedNavButton == "settings" && (
                    <SettingsNavBody/>
                )} */}
            </div>
        </div>
    )
}

export default SidebarBody