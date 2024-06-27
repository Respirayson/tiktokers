import { useState } from "react";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import Sidebar from "./components/sidebar";
import Navbar from "./components/floating-navbar";
import { InputFile } from "./components/input-file";

function App() {
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
    </>
  );
}

export default App;
