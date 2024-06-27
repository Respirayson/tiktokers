import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputFile() {
  return (
    <div className="flex flex-row justify-center items-center h-screen">
      <div className="flex flex-col justify-start w-full max-w-sm items-start gap-1.5">
        <Label className="flex justify-start dark:text-white" htmlFor="file">Upload File</Label>
        <Input className="dark:file:text-foreground" id="file" type="file" />
      </div>
    </div>
  );
}
