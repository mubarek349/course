import { cn } from "@/lib/utils";
import React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

type ControlProps<T extends FieldValues> =
  | {
      control: ControllerProps<T>["control"];
      name: FieldPath<T>;
      rules?: ControllerProps<T>["rules"];
    }
  | { control?: undefined; name?: undefined; rules?: undefined };

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  inputClassName?: string;
}
//

function CustomController<T extends FieldValues>(
  {
    control,
    name,
    rules,
    className,
    inputClassName,
    label,
    type,
    ...props
  }: InputProps & ControlProps<T>,
  ref: React.Ref<HTMLInputElement>
) {
  return control ? (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ fieldState, field }) => (
        <label className={cn("h-fit grid ", className)}>
          {label && (
            <span
              className={
                cn("")
                // fieldState.error || fieldState.invalid ? "text-danger-900" : ""
              }
            >
              {label}
            </span>
          )}
          <input
            {...props}
            {...field}
            onChange={(e) => {
              if (props.onChange) {
                props.onChange(e);
              }
              field.onChange(e);
            }}
            type={type}
            ref={ref}
            className={cn(
              fieldState.error || fieldState.invalid
                ? "input-error"
                : "input-neutral focus-visible:input-primary",
              inputClassName
            )}
          />
          <span
            className={cn(
              "h-4 text-xs ",
              fieldState.error || fieldState.invalid ? "text-danger-900" : ""
            )}
          >
            {fieldState.error?.message}
          </span>
        </label>
      )}
    />
  ) : (
    <label className={cn("h-fit grid ", className)}>
      {label && <span className={cn("")}>{label}</span>}
      <input
        {...props}
        name={name}
        type={type}
        ref={ref}
        className={cn(
          "input-neutral focus-visible:input-primary",
          inputClassName
        )}
      />
    </label>
  );
}

const Input = React.forwardRef(CustomController) as <T extends FieldValues>(
  props: InputProps & ControlProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => React.JSX.Element;

export default Input;
