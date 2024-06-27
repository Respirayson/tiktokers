import { Button } from "@/components/ui/button";

// Hook to manage button selection state
const useButtonSelection = (selectedButton: string, setSelectedButton: (buttonName: string) => void) => {
  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
  };

  const isSelected = (buttonName: string) => selectedButton === buttonName;

  return {
    selectedButton,
    handleButtonClick,
    isSelected,
  };
};

export default function Component({
  selectedButton,
  setSelectedButton,
} : {
  selectedButton: string;
  setSelectedButton: (buttonName: string) => void;
}) {
  const { handleButtonClick, isSelected } = useButtonSelection(selectedButton, setSelectedButton);

  return (
    <div className="fixed top-4 left-[18rem] flex gap-4 bg-gray-100 p-1 rounded-lg shadow-lg dark:bg-primary-foreground">
      <Button
        variant="nav"
        onClick={() => handleButtonClick("Data")}
        className={`text-md px-8 py-1 h-auto transition-all duration-300 ${
          isSelected("Data")
            ? "bg-white border border-gray-300 text-black"
            : "text-gray-500"
        }`}
      >
        <span>Data</span>
        <span className="slide-bg"></span>
      </Button>
      <Button
        variant="nav"
        onClick={() => handleButtonClick("Analytics")}
        className={`text-md px-8 py-1 h-auto transition-all duration-300 ${
          isSelected("Analytics")
            ? "bg-white border border-gray-300 text-black"
            : "text-gray-500"
        }`}
      >
        <span>Analytics</span>
        <span className="slide-bg"></span>
      </Button>
      <Button
        variant="nav"
        onClick={() => handleButtonClick("Results")}
        className={`text-md px-8 py-1 h-auto transition-all duration-300 ${
          isSelected("Results")
            ? "bg-white border border-gray-300 text-black"
            : " text-gray-500"
        }`}
      >
        <span>Results</span>
        <span className="slide-bg"></span>
      </Button>
    </div>
  );
}
