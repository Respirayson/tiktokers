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

const BASE_URL = "http://localhost:5001";

const SidebarBody = ({
    fileName,
    columnsList,
    setColumnsList,
    setSelectedButton,
    setBody,
    hiddenLayers,
    setHiddenLayers,
    epochs,
    setEpochs,
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
    setSelectedButton: React.Dispatch<React.SetStateAction<string>>;
    setBody: React.Dispatch<React.SetStateAction<object[]>>;
    hiddenLayers: string;
    setHiddenLayers: React.Dispatch<React.SetStateAction<string>>;
    epochs: number;
    setEpochs: React.Dispatch<React.SetStateAction<number>>;
    problem: string;
    setProblem: React.Dispatch<React.SetStateAction<string>>;
    dropout: number;
    setDropout: React.Dispatch<React.SetStateAction<number>>;
    batchNorm: boolean;
    setBatchNorm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    // Handle side nav bar button changes
    const [selectedNavButton, setSelectedNavButton] = useState('settings') // Possible states: problems, models, operations, settings
    const [selectedModel, setSelectedModel] = useState('');

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

    // Training function
    const handleTrain = async () => {
        try {
            let api_url = ""
            switch (problem) {
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

    // Handle Click
    const handleSaveChanges = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/update`, {
                filename: fileName,
                data: data,
            });
            console.log(response.data);
            setBody(data);
            setColumnsList(previewColumnsList);
            setSelectedColumns([]);
            setTargetColumn("");
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

    // ProblemsNavBody functions
    const handleSelectProblem = (value: string) => {
        setProblem(value)
    }

    // ModelsNavBody functions
    const handleSelectModel = (value: string) => {
        setSelectedModel(value)
    }
    const handleSetHiddenLayers = (value: string) => {
        setHiddenLayers(value)
    }
    const handleSetEpochs = (value: number) => {
        setEpochs(value)
    }
    const handleSetDropout = (value: number) => {
        setDropout(value)
    }
    const handleSetBatchNorm = (value: boolean) => {
        setBatchNorm(value)
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
            <div className='flex flex-1'>
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
                        model={selectedModel}
                        handleSelectModel={handleSelectModel}
                        hiddenLayers={hiddenLayers}
                        handleSetHiddenLayers={handleSetHiddenLayers}
                        epochs={epochs}
                        handleSetEpochs={handleSetEpochs}
                        dropout={dropout}
                        handleSetDropout={handleSetDropout}
                        batchNorm={batchNorm}
                        handleSetBatchNorm={handleSetBatchNorm}
                        handleTrain={handleTrain}
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