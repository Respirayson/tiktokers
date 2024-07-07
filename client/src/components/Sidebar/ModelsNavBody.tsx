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
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "../multi-select"
import { SortableList } from "../SortableList/SortableList"
import { ScrollArea } from "@/components/ui/scroll-area"

const ModelsNavBody = ({
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
    items,
    setItems,
    handleRemove,
    handleUnitsChange,
}: {
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
    items: { name: string; id: number; units?: number }[];
    setItems: React.Dispatch<React.SetStateAction<{ name: string; id: number; units?: number | undefined; }[]>>;
    handleRemove: (id: number) => void;
    handleUnitsChange: (id: number, units: number) => void;
}) => {
    const renderItem = (item: { name: string; id: number; units?: number }) => (
        <SortableList.Item id={item.id}>
          <div className="flex flex-row items-center">
            <p className="pl-1">{item.name} Layer</p>
            {item.name === "Linear" && (
              <Input
                type="number"
                placeholder="Units"
                className="ml-3 text-xs w-[85%]"
                value={item.units || ""}
                onChange={(e) => handleUnitsChange(item.id, Number(e.target.value))}
              />
            )}
            <button className="DragHandle pr-0" onClick={() => handleRemove(item.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="h-3 w-3">
                <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
              </svg>
            </button>
            <SortableList.DragHandle />
          </div>
        </SortableList.Item>
      );

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
                                <Label htmlFor="">Choose your layers*</Label>
                                <fieldset className="h-auto overflow-auto w-full grid rounded-lg border p-3">
                                    {["Linear", "ReLU", "LeakyReLU", "BatchNorm"].map(
                                        (layer, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-row justify-between items-center w-full px-8 py-2 hover:bg-gray-100"
                                        >
                                            <p>{layer}</p>
                                            <button
                                            className="h-auto"
                                            type="button"
                                            onClick={() => {
                                                setItems([...items, { name: layer, id: items.length + 1 }]);
                                            }}
                                            >
                                            <svg
                                                enableBackground="new 0 0 40 40"
                                                className="h-auto w-4"
                                                id="Layer_1"
                                                version="1.1"
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M256,512C114.625,512,0,397.391,0,256C0,114.609,114.625,0,256,0c141.391,0,256,114.609,256,256  C512,397.391,397.391,512,256,512z M256,64C149.969,64,64,149.969,64,256s85.969,192,192,192c106.047,0,192-85.969,192-192  S362.047,64,256,64z M288,384h-64v-96h-96v-64h96v-96h64v96h96v64h-96V384z"
                                                />
                                            </svg>
                                            </button>
                                        </div>
                                        )
                                    )}
                                    </fieldset>
                                    <fieldset className="h-40 max-h-72 w-full grid rounded-lg border p-3">
                                    <ScrollArea>
                                        {items.length > 0 ? (
                                        <SortableList
                                            items={items}
                                            onChange={setItems}
                                            renderItem={(item) => (
                                                renderItem(item)
                                            )}
                                        />
                                        ) : (
                                        <p className="text-sm justify-center items-center flex">
                                            No Layers Selected...
                                        </p>
                                        )}
                                    </ScrollArea>
                                </fieldset>
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
                            disabled={targetColumn == "" || selectedColumns.length <= 0 || epochs <= 0 || items.length == 0}
                            className="default"
                            onClick={handleTrain}
                            type="button"
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