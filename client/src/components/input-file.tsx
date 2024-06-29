import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "./loading-spinner";

export function InputFile({
  handleChange,
  isLoading,
}: {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-row justify-center items-center h-screen">
      <div className="flex flex-col justify-start w-full max-w-sm items-start gap-1.5">
        <Label className="flex justify-start dark:text-white" htmlFor="file">
          Upload File
        </Label>
        <div className="flex flex-row items-center gap-4">
          <Input
            className="dark:file:text-foreground"
            id="file"
            type="file"
            accept=".csv"
            onChange={handleChange}
          />
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
}
