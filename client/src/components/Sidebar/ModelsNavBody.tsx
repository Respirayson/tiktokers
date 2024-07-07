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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  

const ModelsNavBody = ({
    epochs,
    handleSetEpochs,
    learningRate,
    handleSetLearningRate,
    gradClipping,
    handleSetGradClipping,
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
    handleRateChange,
}: {
    epochs: number;
    handleSetEpochs: any;
    learningRate: number;
    handleSetLearningRate: any;
    gradClipping: boolean;
    handleSetGradClipping: any;
    handleTrain: any;
    columnsList: string[],
    selectedColumns: string[],
    setSelectedColumns: any,
    targetColumn: string,
    setTargetColumn: any,
    items: { name: string; id: number; units?: number, rate?: number }[];
    setItems: React.Dispatch<React.SetStateAction<{ name: string; id: number; units?: number, rate?: number | undefined; }[]>>;
    handleRemove: (id: number) => void;
    handleUnitsChange: (id: number, units: number) => void;
    handleRateChange: (id: number, rate: number) => void;
}) => {
    const renderItem = (item: { name: string; id: number; units?: number, rate?: number }) => (
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
            {item.name === "Dropout" && (
                <Input
                    type="number"
                    placeholder="Rate"
                    min="0" max="1" step="0.1" 
                    className="ml-3 text-xs w-[85%]"
                    value={item.rate || ""}
                    onChange={(e) => handleRateChange(item.id, Number(e.target.value))}
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

    const layers = [
        {
            name: "Linear",
            description: "A linear layer applies a linear transformation to the incoming data. It is defined by its weights and biases, which are learned during training."
        },
        {
            name: "ReLU",
            description: "ReLU (Rectified Linear Unit) is an activation function that introduces non-linearity by setting all negative values to zero and keeping positive values unchanged. It helps the network learn complex patterns."
        },
        {
            name: "LeakyReLU",
            description: "LeakyReLU is a variant of ReLU that allows a small, non-zero gradient for negative inputs, addressing the 'dying ReLU' problem. It helps the network learn more effectively by avoiding dead neurons."
        },
        {
            name: "BatchNorm",
            description: "Batch Normalization normalizes the output of a previous activation layer by subtracting the batch mean and dividing by the batch standard deviation. It helps stabilize and accelerate training by reducing internal covariate shift."
        },
        {
            name: "Dropout",
            description: "Dropout is a regularization technique that randomly sets a fraction of input units to 0 at each update during training. This prevents overfitting and improves the generalization of the model."
        },
    ];
    

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
                                options={columnsList.filter(column => column != targetColumn).map((column) => ({
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
                                    {layers.map((layer, index) => (
                                        <Sheet key={index}>
                                            <div
                                            key={index}
                                            className="flex flex-row justify-between items-center w-full px-5 py-2 hover:bg-gray-100"
                                        >
                                            <p>{layer.name}</p>
                                            <div className="flex flex-row gap-3">
                                            <SheetTrigger className="h-auto w-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 50 50">
<path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
</svg>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>{layer.name}</SheetTitle>
                                                    <SheetDescription>{layer.description}</SheetDescription>
                                                </SheetHeader>
                                            </SheetContent>
                                            <button
                                            className="h-auto"
                                            type="button"
                                            onClick={() => {
                                                setItems([...items, { name: layer.name, id: items.length + 1 }]);
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
                                        </div>
                                        </Sheet>
                                    ))}

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
                                <Label htmlFor="dropout">Learning Rate</Label>
                                <Input id="dropout" type="number" min="0" max="1" step="0.001" value={learningRate}
                                    onChange={(e) => handleSetLearningRate(Math.min(Math.max(Number(e.target.value), 0.0000000001), 1))} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="batchnorm">Gradient Clipping</Label>
                                <div className="flex gap-3 items-center">
                                    <Checkbox id="batch-norm" checked={gradClipping}
                                        onCheckedChange={() => handleSetGradClipping(!gradClipping)} />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Toggle for gradient clipping
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