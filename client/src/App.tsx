import { useState, useEffect } from "react";
import Papa, { ParseResult } from "papaparse";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import Sidebar from "./components/sidebar";
import Navbar from "./components/floating-navbar";
import Dropzone from "./components/input-file";
import axios from "axios";
import DataColumns from "./components/DataTable/DataColumns";
import AnalyticsColumns from "./components/AnalyticsTableRefactor/AnalyticsColumns";
import { DataTable } from "./components/DataTable/DataTable";
import {
  AnalyticsTable,
  StatisticData,
} from "./components/AnalyticsTableRefactor/AnalyticsTable";
import { statisticsTitles } from "./components/AnalyticsTableRefactor/AnalyticsMockData";
import { Separator } from "./components/ui/separator";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

function App() {
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [analyticHeaders, setAnalyticHeaders] = useState<Array<string>>([]);
  const [body, setBody] = useState<Array<object>>([]);
  const [fileName, setFileName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<Array<StatisticData<object>>>(
    []
  );
  const [hiddenLayers, setHiddenLayers] = useState<string>("128,64");
  const [epochs, setEpochs] = useState<number>(10);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentLoss, setCurrentLoss] = useState<number>(0);
  const [confusionMatrix, setConfusionMatrix] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server!");
    });

    socket.on("training_progress", (data) => {
      console.log("Training Progress:", data);
      setTrainingProgress((data.epoch / epochs) * 100);
      setCurrentEpoch(data.epoch);
      setCurrentLoss(data.loss);
    });

    socket.on("training_complete", (data) => {
      console.log("Training Complete:", data);
      toast.success("Training complete!");
      setConfusionMatrix(data.confusion_matrix);
    });

    socket.on("training_error", (data) => {
      console.error("Training Error:", data);
      toast.error("Training error: " + data.message);
    });

    socket.on("status", (data) => {
      console.log("Status:", data.msg);
    });

    return () => {
      socket.off("training_progress");
      socket.off("training_complete");
      socket.off("training_error");
    };
  }, [epochs]);
  const [heatmap, setHeatmap] = useState<string>("");

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
            setBody(results.data);

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

  const [selectedButton, setSelectedButton] = useState("Data");

  const analyticsColumns = AnalyticsColumns(analyticHeaders);

  return (
    <>
      <ToastContainer />
      <Sidebar
        hiddenLayers={hiddenLayers}
        setHiddenLayers={setHiddenLayers}
        epochs={epochs}
        setEpochs={setEpochs}
        setBody={setBody}
        fileName={fileName}
        displayName={displayName}
        selectedButton={selectedButton}
        columnsList={headers}
        setColumnsList={setHeaders}
        setSelectedButton={setSelectedButton}
      />
      <Navbar
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />
      <div className="fixed top-4 right-16">
        <ModeToggle />
      </div>

      {/* body */}
      <div className="pl-[16rem]">
        {selectedButton === "Data" && (
          <div className="flex flex-row justify-center items-center w-full h-screen">
            <Dropzone
              fileName={displayName}
              handleOnDrop={csvUpload}
              isLoading={isLoading}
            />
          </div>
        )}

        {selectedButton === "Analytics" && (
          <div className="flex flex-col pt-20">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-[70vw]">
                <DataTable
                  columns={DataColumns(headers)}
                  data={body}
                  filename={displayName}
                />
              </div>
              <Separator className="my-4" />
              <div className="w-[70vw]">
                {/* Analytics Table */}
                <AnalyticsTable
                  columns={analyticsColumns}
                  data={statistics}
                  statisticTitles={statisticsTitles}
                />
              </div>

              <img
                src={`data:image/png;base64,${heatmap}`}
                alt={`Heatmap of all variables`}
                className="w-[70vw] mt-10"
              />
            </div>
          </div>
        )}

        {selectedButton === "Results" && (
          <div className="w-full flex flex-col items-center justify-center h-screen">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              Epoch: {currentEpoch} - Loss: {currentLoss.toFixed(4)}
            </div>
            {confusionMatrix && (
              <div className="w-full mt-4">
                <img
                  src={`data:image/png;base64,${confusionMatrix}`}
                  alt="Confusion Matrix"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
