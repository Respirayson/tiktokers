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

const operations: Operation[] = [
  {
    value: "drop_duplicates",
    label: "Drop duplicate rows",
  },
  {
    value: "drop_missing",
    label: "Drop missing values",
  },
  {
    value: "fill_missing",
    label: "Fill missing values",
  },
  {
    value: "undersample",
    label: "Undersample",
  },
  {
    value: "oversample",
    label: "Oversample",
  },
  {
    value: "impute",
    label: "Impute missing values",
  },
  {
    value: "remove_outliers",
    label: "Remove outliers",
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
            <>+ Set operation</>
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
        <CommandGroup>
          {operations.map((operation) => (
            <CommandItem
              key={operation.value}
              value={operation.value}
              onSelect={(value) => {
                setSelectedOperation(
                  operations.find((priority) => priority.value === value) ||
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
