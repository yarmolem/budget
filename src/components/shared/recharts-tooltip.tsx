import type {
  ValueType,
  NameType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";
import type { TooltipProps } from "recharts";
import { addSpacesToCamelCase, cn, formatNumber } from "@/lib/utils";

function isValidHexColor(colorCode: string) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(colorCode);
}

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  prefix?: string;
  postfix?: string;
  className?: string;
  formattedNumber?: boolean;
}

export function ReChartsTooltip({
  label,
  prefix,
  active,
  postfix,
  payload,
  className,
  formattedNumber,
}: CustomTooltipProps) {
  if (!active) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card shadow-2xl",
        className,
      )}
    >
      <p className="mb-0.5 block bg-muted p-2 px-2.5 text-center text-xs font-semibold capitalize text-card-foreground">
        {label}
      </p>
      <div className="px-3 py-1.5 text-xs">
        {payload?.map(
          (item: Payload<ValueType, NameType> & { fill?: string }, index) => (
            <div
              key={`${item.dataKey}` + index}
              className="chart-tooltip-item flex items-center py-1.5"
            >
              <span
                className="me-1.5 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: isValidHexColor(item?.fill ?? "")
                    ? item.fill === "#fff"
                      ? item.stroke
                      : item.fill
                    : item.stroke,
                }}
              />
              <p>
                <span className="capitalize">
                  {addSpacesToCamelCase(item.dataKey as string)}:
                </span>{" "}
                <span className="font-medium text-muted-foreground">
                  {prefix && prefix}
                  {formattedNumber
                    ? formatNumber(item.value as number)
                    : item.value}
                  {postfix && postfix}
                </span>
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
