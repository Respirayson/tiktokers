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
import { Bird, Rabbit } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "../multi-select"

const ModelsNavBody = ({
    hiddenLayers,
    handleSetHiddenLayers,
    epochs,
    handleSetEpochs,
    dropout,
    handleSetDropout,
    batchNorm,
    handleSetBatchNorm,
    handleTrain,
    columnsList,
    selectedColumns,
    setSelectedColumns,
    targetColumn,
    setTargetColumn,
}: {
    hiddenLayers: string;
    handleSetHiddenLayers: any;
    epochs: number;
    handleSetEpochs: any;
    dropout: number;
    handleSetDropout: any;
    batchNorm: boolean;
    handleSetBatchNorm: any;
    handleTrain: any;
    columnsList: string[],
    selectedColumns: string[],
    setSelectedColumns: any,
    targetColumn: string,
    setTargetColumn: any,
}) => {
    return (
        <div className='container flex flex-1 flex-col w-full h-full py-4 px-0'>
            <div className="flex flex-col w-full">
                <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Data Columns
                        </legend>
                        <div className="grid gap-3">
                            <Label htmlFor="target-column">Target Column*</Label>
                            <Select
                                onValueChange={setTargetColumn}
                                value={targetColumn}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select the target column" />
                                </SelectTrigger>
                                <SelectContent>
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
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="selected-columns">Select Column(s)*</Label>
                            <MultiSelect
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
                        </div>
                    </fieldset>
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Model Parameters
                        </legend>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="epochs">Number of Epochs*</Label>
                                <Input id="epochs" type="number" placeholder="10" value={epochs}
                                    onChange={(e) => handleSetEpochs(Number(e.target.value))} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="hiddenlayers">Number of Hidden Layers*</Label>
                                <Input id="hiddenlayers" type="text" placeholder="128,64" value={hiddenLayers}
                                    onChange={(e) => handleSetHiddenLayers(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="dropout">Dropout Rate</Label>
                                <Input id="dropout" type="number" min="0" max="1" step="0.1" value={dropout}
                                    onChange={(e) => handleSetDropout(Math.min(Math.max(Number(e.target.value), 0), 1))} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="batchnorm">Batch Normalisation</Label>
                                <div className="flex gap-3 items-center">
                                    <Checkbox id="batch-norm" checked={batchNorm}
                                        onCheckedChange={() => handleSetBatchNorm(!batchNorm)} />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Toggle for batch normalisation
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <div className="flex flex-1 justify-end">
                        <Button
                            disabled={targetColumn == "" || selectedColumns.length <= 0 || epochs <= 0 || hiddenLayers == ""}
                            className="default"
                            onClick={handleTrain}
                        >
                            Train Model
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModelsNavBody