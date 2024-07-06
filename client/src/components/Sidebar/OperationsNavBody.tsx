import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Operation, OperationsBoxResponsive } from "../operations-box"
import { MultiSelect } from "../multi-select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "../DataTable/DataTable"
import DataColumns from "../DataTable/DataColumns"
import { useState } from "react"

const OperationsNavBody = ({
    columnsList,
    selectedColumns,
    setSelectedColumns,
    targetColumn,
    setTargetColumn,
    selectedOperation,
    setSelectedOperation,
    previewColumnsList,
    previewData,
    handlePreviewClick,
    handleSaveChanges,
}: {
    columnsList: string[];
    selectedColumns: string[];
    setSelectedColumns: any;
    targetColumn: string;
    setTargetColumn: any;
    selectedOperation: Operation | null;
    setSelectedOperation: any;
    previewColumnsList: string[];
    previewData: object[];
    handlePreviewClick: any;
    handleSaveChanges: any;
}) => {
    const [open, setOpen] = useState(false);

    const isSingleOperation = [
        "exploration/oversample",
        "exploration/smote",
        "exploration/undersample",
    ];

    const handleSaveButton = () => {
        setOpen(false)
        handleSaveChanges()
    }

    return (
        <div className='container flex flex-1 flex-col w-full h-full py-4 px-0'>
            <div className="flex w-full">
                <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Preprocessing
                        </legend>
                        <div className="grid gap-3">
                            <Label htmlFor="operations">Operations</Label>
                            <OperationsBoxResponsive
                                selectedOperation={selectedOperation}
                                setSelectedOperation={setSelectedOperation}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="operation-parameters">Parameters</Label>
                            {selectedOperation?.value ===
                                "exploration/impute" ||
                                selectedOperation?.value ===
                                "preprocessing/features" ? (
                                <>
                                    <Input
                                        type="string"
                                        placeholder={
                                            selectedOperation.value ===
                                                "exploration/impute"
                                                ? "Eg. mean / median / mode" // for impute strategy
                                                : "Enter threshold" // for select features threshold
                                        }
                                        value={targetColumn}
                                        onChange={(e) =>
                                            setTargetColumn(e.target.value)
                                        }
                                    />
                                </>
                            ) : isSingleOperation.includes(
                                selectedOperation?.value ? selectedOperation?.value : ""
                            ) ? (
                                <Select
                                    onValueChange={setTargetColumn}
                                    value={targetColumn}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select the target column" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectGroup>
                                            <SelectLabel>Columns</SelectLabel>
                                            {columnsList.map((column) => (
                                                <SelectItem key={column} value={column}>
                                                    {column}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <MultiSelect
                                    className="flex w-full"
                                    options={columnsList.map((column) => ({
                                        value: column,
                                        label: column,
                                    }))}
                                    onValueChange={setSelectedColumns}
                                    defaultValue={selectedColumns}
                                    placeholder="Select columns"
                                    variant="inverted"
                                    animation={2}
                                    maxCount={3}
                                />
                            )}
                        </div>
                    </fieldset>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                disabled={selectedOperation?.value == "" || (selectedColumns.length <= 0 && targetColumn == "")}
                                variant="default"
                                onClick={handlePreviewClick}
                            >
                                Apply
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-[80%] overflow-auto h-[80%]">
                            <DialogHeader>
                                <DialogTitle>Preview</DialogTitle>
                                <DialogDescription>
                                    Preview you changes here. Click save when
                                    you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <DataTable
                                data={previewData}
                                columns={DataColumns(previewColumnsList)}
                            />
                            <DialogFooter>
                                <Button onClick={handleSaveButton}>
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </div>
        </div>
    )
}

export default OperationsNavBody