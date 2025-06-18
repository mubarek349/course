import React, { useEffect, useState } from "react";
import {
  Controller,
  ControllerProps,
  UseFormSetValue,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import Popover from "./Popover";

type ControlProps<T extends FieldValues, DATA, N extends FieldPath<T>> =
  | {
      control: ControllerProps<T>["control"];
      name: N;
      setValue: UseFormSetValue<T>;
      onSelected: (value: DATA, index: number) => PathValue<T, N>;
      rules?: ControllerProps<T>["rules"];
      value?: undefined;
      onChange?: undefined;
    }
  | {
      control?: undefined;
      name?: undefined;
      setValue?: undefined;
      rules?: undefined;
      onSelected?: (value: DATA, index: number) => PathValue<T, N>;
      value?: string;
      onChange?: (v: string) => void;
    };

interface Props<DATA> {
  label?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  items: DATA[];
  item?: (value: DATA, index: number) => React.ReactNode;
  trigger?: (value: string) => React.ReactNode | string;
}

function CustomController<T extends FieldValues, DATA, N extends FieldPath<T>>(
  {
    control,
    name,
    setValue,
    rules,
    onChange,
    items,
    onSelected,
    item,
    trigger,
    label,
    className,
    triggerClassName,
    contentClassName,
  }: Props<DATA> & ControlProps<T, DATA, N>,
  ref: React.Ref<HTMLDivElement>
) {
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    if (!control && selected === undefined) {
      setSelected(onSelected ? onSelected(items[0], 0) : String(items[0]));
    }
  }, []);

  useEffect(() => {
    if (selected !== undefined) {
      onChange?.(selected);
    }
  }, [selected]);

  return control ? (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ fieldState, field }) => {
        if (onSelected && !field.value) {
          setValue(name, onSelected(items[0], 0));
        }
        return (
          <div ref={ref} className={cn("  ", className)}>
            <Popover
              trigger={
                <label className={cn("h-fit grid ", triggerClassName)}>
                  {label && (
                    <span
                      className={cn(
                        fieldState.error || fieldState.invalid
                          ? "text-danger-900"
                          : ""
                      )}
                    >
                      {label}
                    </span>
                  )}

                  {trigger ? (
                    ((v) =>
                      ["string", "boolean", "number"].includes(typeof v) ? (
                        <button
                          type="button"
                          className={cn(
                            "w-full input-neutral focus:input-primary "
                          )}
                        >
                          {v}
                        </button>
                      ) : (
                        v
                      ))(trigger(field.value))
                  ) : (
                    <button
                      type="button"
                      className={cn(
                        "w-full input-neutral focus:input-primary "
                      )}
                    >
                      {field.value}
                    </button>
                  )}
                  <span
                    className={cn(
                      "h-4 text-xs ",
                      fieldState.error || fieldState.invalid
                        ? "text-danger-900"
                        : ""
                    )}
                  >
                    {fieldState.error?.message}
                  </span>
                </label>
              }
              className=""
            >
              <div
                className={cn(
                  "p-2 bg-background rounded-md grid gap-2 auto-rows-min",
                  contentClassName
                )}
              >
                {items.map((v, i) => (
                  <div
                    key={i + ""}
                    onClick={() => {
                      setValue(name, onSelected(v, i));
                    }}
                    className="grid "
                  >
                    {item
                      ? item(v, i)
                      : ["string", "number", "boolean"].includes(typeof v)
                      ? String(v)
                      : JSON.stringify(v)}
                  </div>
                ))}
              </div>
            </Popover>
          </div>
        );
      }}
    />
  ) : (
    <div className={cn("  ", className)}>
      <Popover
        trigger={
          <label className={cn("grid ", triggerClassName)}>
            {label && <span className={cn("text-danger-900 ")}>{label}</span>}
            {trigger ? (
              selected !== undefined &&
              ((v) =>
                ["string", "boolean", "number"].includes(typeof v) ? (
                  <button
                    type="button"
                    className={cn("w-full input-neutral focus:input-primary ")}
                  >
                    {v}
                  </button>
                ) : (
                  v
                ))(trigger(selected))
            ) : (
              <button
                type="button"
                className={cn("w-full input-neutral focus:input-primary ")}
              >
                {selected}
              </button>
            )}
          </label>
        }
        className=""
      >
        <div
          className={cn(
            "relative p-2 bg-background rounded-md shadow-md shadow-primary/20 grid gap-2 auto-rows-min ",
            contentClassName
          )}
        >
          {items.map((v, i) => (
            <div
              key={i + ""}
              onClick={() =>
                setSelected(onSelected ? onSelected(v, i) : String(v))
              }
              className="grid "
            >
              {item
                ? item(v, i)
                : ["string", "number", "boolean"].includes(typeof v)
                ? String(v)
                : JSON.stringify(v)}
            </div>
          ))}
        </div>
      </Popover>
    </div>
  );
}

const Select = React.forwardRef(CustomController) as <
  T extends FieldValues,
  DATA,
  N extends FieldPath<T>
>(
  props: Props<DATA> &
    ControlProps<T, DATA, N> & { ref?: React.Ref<HTMLInputElement> }
) => React.JSX.Element;

export default Select;
