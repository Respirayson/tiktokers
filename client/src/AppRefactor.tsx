import { useState, useEffect } from "react";
import Papa, { ParseResult } from "papaparse";
import "./AppRefactor.css";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ModeToggle } from "./components/mode-toggle";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/floating-navbar";
import Dropzone from "./components/input-file";
import axios from "axios";
import DataColumns from "./components/DataTable/DataColumns";
import AnalyticsColumns from "./components/AnalyticsTable/AnalyticsColumns";
import { DataTable } from "./components/DataTable/DataTable";
import {
    AnalyticsTable,
    StatisticData,
} from "./components/AnalyticsTable/AnalyticsTable";
import { statisticsTitles } from "./components/AnalyticsTable/AnalyticsMockData";
import { Separator } from "./components/ui/separator";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import 'react-toastify/dist/ReactToastify.css'

const socket = io("http://localhost:5001");

function AppRefactor() {
    const [headers, setHeaders] = useState<Array<string>>([]);
    const [dataBody, setDataBody] = useState<Array<object>>([]);
    const [analyticHeaders, setAnalyticHeaders] = useState<Array<string>>([]);
    const [fileName, setFileName] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [problem, setProblem] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statistics, setStatistics] = useState<Array<StatisticData<object>>>(
        []
    );
    const [heatmap, setHeatmap] = useState<string>("");
    const [hiddenLayers, setHiddenLayers] = useState<string>("128,64");
    const [epochs, setEpochs] = useState<number>(10);
    const [trainingProgress, setTrainingProgress] = useState<number>(0);
    const [currentEpoch, setCurrentEpoch] = useState<number>(0);
    const [currentLoss, setCurrentLoss] = useState<number>(0);
    const [confusionMatrix, setConfusionMatrix] = useState<string | null>(null);
    const [selectedButton, setSelectedButton] = useState("Data");

    const analyticsColumns = AnalyticsColumns(analyticHeaders);

    const csvUpload = async (files: FileList | null) => {
        if (files) {
            const file = files[0];
            setIsLoading(true);
            if (file) {
                Papa.parse<File, Papa.LocalFile>(file, {
                    complete: async (results: ParseResult<File>) => {
                        if (results.meta.fields) {
                            setHeaders(results.meta.fields);
                            setAnalyticHeaders(results.meta.fields);
                        }
                        setDataBody(results.data);

                        const newFileName = uuidv4() + ".csv";
                        console.log(newFileName);
                        setFileName(newFileName);
                        setDisplayName(file.name);

                        const formData = new FormData();
                        formData.append(
                            "file",
                            new File([file], newFileName, { type: "text/csv" })
                        );

                        try {
                            const response = await axios.post(
                                "http://localhost:5001/upload",
                                formData,
                                {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                }
                            );
                            console.log("File successfully uploaded:", response.data);
                            setStatistics(response.data.statistics);
                            setHeatmap(response.data.heatmap);
                            setSelectedButton("Analytics");
                            setIsLoading(false);
                            toast.success("File uploaded successfully!");
                            socket.emit("join", { room: newFileName });
                        } catch (error) {
                            toast.error("Error uploading file!");
                            console.error("Error uploading file:", error);
                            setIsLoading(false);
                        }
                    },
                    header: true,
                    worker: true,
                    skipEmptyLines: true,
                });
            }
        }
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server!");
        });

        socket.on("training_progress", (data: any) => {
            console.log("Training Progress:", data);
            setTrainingProgress((data.epoch / epochs) * 100);
            setCurrentEpoch(data.epoch);
            setCurrentLoss(data.loss);
        });

        socket.on("training_complete", (data: any) => {
            console.log("Training Complete:", data);
            toast.success("Training complete!");
            setConfusionMatrix(data.confusion_matrix);
        });

        socket.on("training_error", (data: any) => {
            console.error("Training Error:", data);
            toast.error("Training error: " + data.message);
        });

        socket.on("status", (data: any) => {
            console.log("Status:", data.msg);
        });

        return () => {
            socket.off("training_progress");
            socket.off("training_complete");
            socket.off("training_error");
        };
    }, [epochs]);

    return (
        <div className="flex w-screen h-screen border">
            <ToastContainer />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={25} maxSize={25} minSize={20}>
                    <div className="flex h-full items-center justify-center">
                        <Sidebar/>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <div className="flex h-full items-center justify-center">

                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default AppRefactor;
