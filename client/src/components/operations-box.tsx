"use client";

import * as React from "react";

import { useMediaQuery } from "./hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Operation = {
  value: string;
  label: string;
};

const commonOperations: Operation[] = [
  {
    value: "preprocessing/encode",
    label: "Encode Categorical Variables",
  },
  {
    value: "preprocessing/scale",
    label: "Scale Features",
  },
  {
    value: "preprocessing/features",
    label: "Select Features",
  },
];

const classificationOperations: Operation[] = [
  {
    value: "exploration/oversample",
    label: "Oversample",
  },
  {
    value: "exploration/smote",
    label: "SMOTE",
  },
  {
    value: "exploration/undersample",
    label: "Undersample",
  },
];

const regressionOperations: Operation[] = [
  {
    value: "exploration/impute",
    label: "Impute Missing Values",
  },
  {
    value: "exploration/outlier",
    label: "Handle Outliers",
  },
];

export function OperationsBoxResponsive({
  selectedOperation,
  setSelectedOperation,
}: {
  selectedOperation: Operation | null;
  setSelectedOperation: (operation: Operation | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedOperation ? (
              <>{selectedOperation.label}</>
            ) : (
              <>Search for an Operation</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[230px] p-0" align="start">
          <StatusList
            setOpen={setOpen}
            setSelectedOperation={setSelectedOperation}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedOperation ? (
            <>{selectedOperation.label}</>
          ) : (
            <>Search for an operation...</>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            setOpen={setOpen}
            setSelectedOperation={setSelectedOperation}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedOperation,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOperation: (operation: Operation | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter operation..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Common">
          {commonOperations.map((operation) => (
            <CommandItem
              key={operation.value}
              value={operation.value}
              onSelect={(value) => {
                setSelectedOperation(
                  commonOperations.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {operation.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Classification">
          {classificationOperations.map((operation) => (
            <CommandItem
              key={operation.value}
              value={operation.value}
              onSelect={(value) => {
                setSelectedOperation(
                  classificationOperations.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {operation.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Regression">
          {regressionOperations.map((operation) => (
            <CommandItem
              key={operation.value}
              value={operation.value}
              onSelect={(value) => {
                setSelectedOperation(
                  regressionOperations.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {operation.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
