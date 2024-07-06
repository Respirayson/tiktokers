import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bird, Rabbit } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const ModelsNavBody = ({
    model,
    handleSelectModel,
    hiddenLayers,
    handleSetHiddenLayers,
    epochs,
    handleSetEpochs,
    dropout,
    handleSetDropout,
    batchNorm,
    handleSetBatchNorm,
    handleTrain,
}: {
    model: string;
    handleSelectModel: any;
    hiddenLayers: string;
    handleSetHiddenLayers: any;
    epochs: number;
    handleSetEpochs: any;
    dropout: number;
    handleSetDropout: any;
    batchNorm: boolean;
    handleSetBatchNorm: any;
    handleTrain: any;
}) => {
    return (
        <div className='container flex flex-1 flex-col w-full h-full py-4 px-0'>
            <div className="flex flex-col w-full">
                <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Select Model
                        </legend>
                        <div className="grid gap-3">
                            <Label htmlFor="model">Model*</Label>
                            <Select value={model} onValueChange={handleSelectModel}>
                                <SelectTrigger
                                    id="model"
                                    className="items-start [&_[data-description]]:hidden"
                                >
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="classification">
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <Rabbit className="size-5" />
                                            <div className="grid gap-0.5">
                                                <p>
                                                    <span className="font-medium text-foreground">
                                                        Classification
                                                    </span>
                                                </p>
                                                <p className="text-xs" data-description>
                                                    Access to the power of neural networks.
                                                </p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="regression">
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <Bird className="size-5" />
                                            <div className="grid gap-0.5">
                                                <p>
                                                    <span className="font-medium text-foreground">
                                                        Regression
                                                    </span>
                                                </p>
                                                <p className="text-xs" data-description>
                                                    Make predictions and decisions with data.
                                                </p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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
                            disabled={model == "" || epochs <= 1 || hiddenLayers == ""}
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