import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import DataTable from "./components/DataTable/DataTable";
import Sidebar from "./components/sidebar";
import Navbar from "./components/floating-navbar";
import { InputFile } from "./components/input-file";
import AnalyticsTable from "./components/AnalyticsTable/AnalyticsTable";
import {
  mockHeaders,
  mockRowData,
  mockRowNames,
} from "./components/AnalyticsTable/AnalyticsMockData";
import axios from "axios";

function App() {
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [body, setBody] = useState<Array<object>>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
            setSelectedButton("Analytics");
            setIsLoading(false);
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
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          },
          header: true,
        });
      }
    }
  };

  const [selectedButton, setSelectedButton] = useState("Data");

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
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-full flex flex-col items-center justify-center">
              <DataTable headers={headers} body={body} fileName={fileName} />
              <hr className="h-px w-full my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              <AnalyticsTable
                headers={mockHeaders}
                rowNames={mockRowNames}
                rowData={mockRowData}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
