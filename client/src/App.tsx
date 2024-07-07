import { useState, useEffect } from "react";
import Papa, { ParseResult } from "papaparse";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import Sidebar from "./components/sidebar";
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
import { SortableList } from "./components/SortableList/SortableList";
import { Input } from "./components/ui/input";

const API_URL = import.meta.env.VITE_SERVER_URL;

const socket = io(API_URL);

function App() {
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [dataBody, setDataBody] = useState<Array<object>>([]);
  const [analyticHeaders, setAnalyticHeaders] = useState<Array<string>>([]);
  const [fileName, setFileName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [problem, setProblem] = useState<string>("");
  const [dropout, setDropout] = useState<number>(0);
  const [batchNorm, setBatchNorm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<Array<StatisticData<object>>>(
    []
  );
  const [heatmap, setHeatmap] = useState<string>('');
  const [hiddenLayers, setHiddenLayers] = useState<string>("128,64");
  const [epochs, setEpochs] = useState<number>(10);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentLoss, setCurrentLoss] = useState<number>(0);
  const [confusionMatrix, setConfusionMatrix] = useState<string | null>(null);
  const [selectedButton, setSelectedButton] = useState("Data");
  
  const analyticsColumns = AnalyticsColumns(analyticHeaders);
  
  const [items, setItems] = useState<{ id: number }[]>([]);
  const handleRemove = (id: number) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

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
                `${API_URL}/upload`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              if (typeof response.data === "string") {
                response.data = JSON.parse(response.data);
              }
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
    <>
      <ToastContainer />
      <Sidebar
        hiddenLayers={hiddenLayers}
        setHiddenLayers={setHiddenLayers}
        epochs={epochs}
        setEpochs={setEpochs}
        setBody={setDataBody}
        fileName={fileName}
        selectedButton={selectedButton}
        columnsList={headers}
        setColumnsList={setHeaders}
        setSelectedButton={setSelectedButton}
        problem={problem}
        setProblem={setProblem}
        dropout={dropout}
        setDropout={setDropout}
        batchNorm={batchNorm}
        setBatchNorm={setBatchNorm}
      />
      <Navbar
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />
      <div className="fixed top-4 right-16">
        <ModeToggle />
      </div>

      {/* body */}
      <div className="pl-[16rem] w-full flex flex-col items-center h-screen">
        {/* Data Tab */}
        {selectedButton === "Data" && (
          <div className="flex flex-row justify-center items-center w-full h-screen">
            <Dropzone
              fileName={displayName}
              handleOnDrop={csvUpload}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Analytics Tab */}
        {selectedButton === "Analytics" && (
          <div>
            <div className="pt-16 w-[70vw]">
              <div className="flex m-2 text-3xl font-semibold">
                {displayName ? displayName : "Data Table"}
              </div>
              <DataTable
                columns={DataColumns(headers)}
                data={dataBody}
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

            {heatmap.length > 0 && (
              <img
                src={`data:image/png;base64,${heatmap}`}
                alt={`Heatmap of all variables`}
                className="w-[70vw] mt-10"
              />
            )}
          </div>
        )}

        {/* Results Tab */}
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

            <div className="flex flex-col h-4 w-[75%]">
              <SortableList
                items={items}
                onChange={setItems}
                renderItem={(item) => (
                  <SortableList.Item id={item.id}>
                    <p>Linear Layer {item.id}</p>
                    <Input
                      placeholder="Enter the number of hidden units"
                      type="text"
                    />
                    <button
                      className="h-8 w-8 ml-2"
                      onClick={() => handleRemove(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 50 50"
                        className="h-4 w-4"
                      >
                        <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                      </svg>
                    </button>
                    <SortableList.DragHandle />
                  </SortableList.Item>
                )}
              />
            </div>
            <button
              onClick={() => {
                setItems([...items, { id: items.length + 1 }]);
              }}
            >Click me</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
