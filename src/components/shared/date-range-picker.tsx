"use client";

import dayjs from "dayjs";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  value,
  onChange,
}: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const _value = value ?? date;
  const _onChange = onChange ?? setDate;

  return (
    <div className={cn("grid w-full gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {_value?.from ? (
              _value.to ? (
                dayjs(_value.from).format("MMM DD, YYYY") +
                " - " +
                dayjs(_value.to).format("MMM DD, YYYY")
              ) : (
                dayjs(_value.from).format("MMM DD, YYYY")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            numberOfMonths={2}
            selected={_value}
            onSelect={_onChange}
            defaultMonth={value?.from ?? date?.from}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
