import React, { useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Binary, Package, Settings, Wrench } from 'lucide-react'
import ProblemsNavBody from './ProblemsNavBody'

const SidebarBody = () => {
    // Handle side nav bar button changes
    const [ selectedNavButton, setSelectedNavButton ] = useState('problems') // Possible states: problems, models, operations, settings
    const [ selectedProblem, setSelectedProblem ] = useState('');

    // Helper functions
    const handleNavButtonClick = (buttonName: string) => {
        setSelectedNavButton(buttonName)
    }
    const navButtonClass = (buttonName: string) => `rounded-lg ${selectedNavButton === buttonName ? 'bg-muted' : ''}`;

    const handleSelectProblem = (value: string) => {
        setSelectedProblem(value)
    }

    return (
        <div className='flex flex-1'>
            {/* Side nav bar buttons */}
            <div className='border-r-2'>
                <div className="grid gap-1 p-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={navButtonClass('problems')}
                                    aria-label="Problems"
                                    onClick={() => handleNavButtonClick('problems')}
                                >
                                    <Binary className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                ML Problems
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={navButtonClass('models')}
                                    aria-label="Models"
                                    onClick={() => handleNavButtonClick('models')}
                                >
                                    <Package className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Models
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={navButtonClass('operations')}
                                    aria-label="Operations"
                                    onClick={() => handleNavButtonClick('operations')}
                                >
                                    <Wrench className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Preprocessing Operations
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={navButtonClass('settings')}
                                    aria-label="Settings"
                                    onClick={() => handleNavButtonClick('settings')}
                                >
                                    <Settings className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Settings
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Body for selected side nav bar button */}
            <div className='flex flex-1'>
                {selectedNavButton == "problems" && (
                    <ProblemsNavBody problem={selectedProblem} handleSelectProblem={handleSelectProblem}/>
                )}
                {/* {selectedNavButton == "models" && (
                    <ModelsNavBody/>
                )}
                {selectedNavButton == "operations" && (
                    <OperationsNavBody/>
                )}
                {selectedNavButton == "settings" && (
                    <SettingsNavBody/>
                )} */}
            </div>
        </div>
    )
}

export default SidebarBody