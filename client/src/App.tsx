import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import Sidebar from "./components/sidebar";
import Navbar from "./components/floating-navbar";
import { InputFile } from "./components/input-file";
import {
  mockHeaders,
  mockRowData,
  mockRowNames,
} from "./components/AnalyticsTable/AnalyticsMockData";
import axios from "axios";
import DataColumns from "./components/DataTable/DataColumns";
import AnalyticsColumns from "./components/AnalyticsTableRefactor/AnalyticsColumns";
import { DataTable } from "./components/DataTable/DataTable";
import { AnalyticsTable } from "./components/AnalyticsTableRefactor/AnalyticsTable";

function App() {
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [body, setBody] = useState<Array<object>>([]);
  const [fileName, setFileName] = useState<string>("");

  const csvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
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

            // Prepare the form data
            const formData = new FormData();
            formData.append("file", file);

            try {
              // Send the file to the backend
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

  const [selectedButton, setSelectedButton] = useState("Data")

  const dataColumns = DataColumns(headers)
  const analyticsColumns = AnalyticsColumns(headers)

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
        {selectedButton === "Data" && <InputFile handleChange={csvUpload} />}

        {selectedButton === "Analytics" && (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-full flex flex-col items-center justify-center">
              <div className='w-[70vw]'>
                <DataTable columns={dataColumns} data={body} />
              </div>
              <hr className="h-px w-full my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              <div className='w-[70vw]'>
                {/* Analytics Table */}
                <AnalyticsTable columns={analyticsColumns} data={body.slice(0,8)} statisticTitles={mockRowNames} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
