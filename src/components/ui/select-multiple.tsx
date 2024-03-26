import React, { useMemo, useState } from "react";
import { XIcon } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "./select";
import { Badge } from "./badge";

type Option = { label: string; value: string };

type Props = {
  data: Option[];
  defaultValue: string[];
  placeholder?: string;
  onValueChange: (value: string[]) => void;
};

const SelectMultiple = ({
  data,
  defaultValue = [],
  placeholder,
  onValueChange,
}: Props) => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<(Option & { selected?: boolean })[]>(
    () => {
      return data.map((v) => ({
        ...v,
        selected: defaultValue.includes(v.value),
      }));
    },
  );

  const handleAdd = (value: string) => {
    const item = data.find((v) => v.value === value)!;
    if (!item) return;

    const newOptions = options.map((v) =>
      v.value === value ? { ...v, selected: true } : v,
    );

    setValue("");
    setOptions(newOptions);
    onValueChange(newOptions.filter((v) => v.selected).map((v) => v.value));
  };

  const handleDelete = (value: string) => {
    const item = data.find((v) => v.value === value)!;
    if (!item) return;

    const newOptions = options.map((v) =>
      v.value === value ? { ...v, selected: false } : v,
    );

    setValue("");
    setOptions(newOptions);
    onValueChange(newOptions.filter((v) => v.selected).map((v) => v.value));
  };

  const { selected, notSelected } = useMemo(() => {
    const selected = options.filter((v) => v.selected);
    const notSelected = options.filter((v) => !v.selected);
    return { selected, notSelected };
  }, [options]);

  return (
    <>
      <Select
        value={value}
        onValueChange={(value: string) => {
          setValue(value);
          handleAdd(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>
            {selected.length} items selected
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {notSelected.map(({ label, value }) => (
            <SelectItem
              key={value}
              value={value}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-y-2">
        {selected.map(({ label, value }) => (
          <Badge
            key={value}
            className="mr-2 cursor-pointer"
            onClick={() => handleDelete(value)}
          >
            {label}
            <XIcon size={16} />
          </Badge>
        ))}
      </div>
    </>
  );
};

export { SelectMultiple };
