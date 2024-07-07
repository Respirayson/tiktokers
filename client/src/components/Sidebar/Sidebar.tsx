import SidebarHeader from "./SidebarHeader"
import SidebarFooter from "./SidebarFooter"
import SidebarBody from "./SidebarBody";

const Sidebar = ({
    fileName,
    columnsList,
    setColumnsList,
    setBody,
    epochs,
    setEpochs,
    setSelectedButton,
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
    setBody: React.Dispatch<React.SetStateAction<object[]>>;
    epochs: number;
    setEpochs: React.Dispatch<React.SetStateAction<number>>;
    setSelectedButton: React.Dispatch<React.SetStateAction<string>>;
    problem: string;
    setProblem: React.Dispatch<React.SetStateAction<string>>;
    dropout: number;
    setDropout: React.Dispatch<React.SetStateAction<number>>;
    batchNorm: boolean;
    setBatchNorm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <div id="sidebar" className="w-full h-full flex flex-col justify-between" aria-label="Sidebar">
            <div className="p-4"><SidebarHeader /></div>
            <div className="flex flex-1 h-screen border-y-2 overflow-hidden">
                <SidebarBody
                    epochs={epochs}
                    setEpochs={setEpochs}
                    setBody={setBody}
                    fileName={fileName}
                    columnsList={columnsList}
                    setColumnsList={setColumnsList}
                    setSelectedButton={setSelectedButton}
                    problem={problem}
                    setProblem={setProblem}
                    dropout={dropout}
                    setDropout={setDropout}
                    batchNorm={batchNorm}
                    setBatchNorm={setBatchNorm}
                />
            </div>
            <div className="p-4"><SidebarFooter /></div>
        </div>
    )
}

export default Sidebar