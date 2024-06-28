import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import DataTable from "./components/DataTable/DataTable";
import Sidebar from "./components/sidebar";
import Navbar from "./components/floating-navbar";
import { InputFile } from "./components/input-file";

function App() {
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [body, setBody] = useState<Array<object>>([]);
  const [showTable, setShowTable] = useState<boolean>(false);

  const csvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        Papa.parse<File, Papa.LocalFile>(file, {
          complete: (results: ParseResult<File>) => {
            console.log(results);
            if (results.meta.fields) {
              setHeaders(results.meta.fields);
            }
            setBody(results.data);
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
        {selectedButton === "Data" && <InputFile />}
      </div>

      <div className="flex flex-col items-center">
        <p>CSV File</p>
        <input id="csv" type="file" accept=".csv" onChange={csvUpload} />
        {showTable ? (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowTable(false)}
              className="px-4 py-2 border-2 border-white m-2"
            >
              Hide
            </button>
            <DataTable headers={headers} body={body} />
          </div>
        ) : (
          <button
            onClick={() => setShowTable(true)}
            className="px-4 py-2 border-2 border-white m-2"
          >
            Show
          </button>
        )}
      </div>
    </>
  );
}

export default App;
