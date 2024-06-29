import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import Sidebar from "./components/sidebar";
import Navbar from "./components/floating-navbar";
import { InputFile } from "./components/input-file";
import axios from "axios";
import DataColumns from "./components/DataTable/DataColumns";
import AnalyticsColumns from "./components/AnalyticsTableRefactor/AnalyticsColumns";
import { DataTable } from "./components/DataTable/DataTable";
import { AnalyticsTable } from "./components/AnalyticsTableRefactor/AnalyticsTable";
import { statisticsTitles } from "./components/AnalyticsTableRefactor/AnalyticsMockData";
import { Separator } from "./components/ui/separator";

function App() {
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [body, setBody] = useState<Array<object>>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<Array<object>>([]);

  const csvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setIsLoading(true);
      if (file) {
        Papa.parse<File, Papa.LocalFile>(file, {
          complete: async (results: ParseResult<File>) => {
            console.log(results);
            if (results.meta.fields) {
              setHeaders(results.meta.fields);
            }
            setBody(results.data);
            setFileName(file.name);

            const formData = new FormData();
            formData.append("file", file);

            try {
              const response = await axios.post(
                "http://localhost:5000/upload",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              console.log("File successfully uploaded:", response.data);
              setStatistics(response.data.statistics);
              setSelectedButton("Analytics");
              setIsLoading(false);
            } catch (error) {
              console.error("Error uploading file:", error);
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

  const dataColumns = DataColumns(headers);
  const analyticsColumns = AnalyticsColumns(headers);

  return (
    <>
      <Sidebar />
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
          <InputFile isLoading={isLoading} handleChange={csvUpload} />
        )}

        {selectedButton === "Analytics" && (
          <div className="flex flex-col pt-20">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-[70vw]">
                <DataTable
                  columns={dataColumns}
                  data={body}
                  filename={fileName}
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
              {/* <div className="w-[70vw] mt-4">
                <h3>Histograms</h3>
                <div className="flex flex-wrap">
                  {Object.keys(histograms).map((key) => (
                    <div key={key} className="p-2">
                      <h5>{key}</h5>
                      <img
                        src={`data:image/png;base64,${histograms[key]}`}
                        alt={`Histogram of ${key}`}
                        style={{ maxWidth: "200px", maxHeight: "150px" }}
                      />
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
