import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bird, Fish, Rabbit } from "lucide-react"



const ProblemsNavBody = ({ problem, handleSelectProblem }: { problem: string; handleSelectProblem: any }) => {
    return (
        <div className='container flex flex-1 flex-col w-full h-full py-4 px-0'>
            <div className="flex w-full">
                <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Select Problem
                        </legend>
                        <div className="grid gap-3">
                            <Label htmlFor="model">Problem</Label>
                            <Select value={problem} onValueChange={handleSelectProblem}>
                                <SelectTrigger
                                    id="model"
                                    className="items-start [&_[data-description]]:hidden"
                                >
                                    <SelectValue placeholder="Select a ML problem" />
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
                                    <SelectItem value="kmeans">
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <Fish className="size-5" />
                                            <div className="grid gap-0.5">
                                                <p>
                                                    <span className="font-medium text-foreground">
                                                        K-Means Clustering
                                                    </span>
                                                </p>
                                                <p className="text-xs" data-description>
                                                    Perform unsupervised clustering.
                                                </p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default ProblemsNavBody