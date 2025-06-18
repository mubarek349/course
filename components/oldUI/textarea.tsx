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

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  className?: string;
}
//

function CustomController<T extends FieldValues>(
  { control, className, label, name, ...props }: InputProps & ControlProps<T>,
  ref: React.Ref<HTMLTextAreaElement>
) {
  return control ? (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <label className={cn("grid gap-y-1", className)}>
          {label && (
            <span
              className={cn(
                fieldState.error || fieldState.invalid ? "text-danger-900" : ""
              )}
            >
              {label}
            </span>
          )}
          <textarea
            {...props}
            {...field}
            ref={ref}
            className={cn(
              fieldState.error || fieldState.invalid
                ? "input-error"
                : "input-neutral focus-visible:input-primary"
            )}
          />
        </label>
      )}
    />
  ) : (
    <label className={cn("grid gap-y-1", className)}>
      {label && <span className={cn("")}>{label}</span>}
      <textarea
        {...props}
        ref={ref}
        className={cn("input-neutral focus-visible:input-primary")}
      />
    </label>
  );
}

const TextArea = React.forwardRef(CustomController) as <T extends FieldValues>(
  props: InputProps & ControlProps<T> & { ref?: React.Ref<HTMLTextAreaElement> }
) => React.JSX.Element;

export default TextArea;
