import {
  Button,
  Dropdown,
  DropdownMenu,
  extendVariants,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";

export const CButton = extendVariants(Button, {
  defaultVariants: { size: "sm" },
});
export const CInput = extendVariants(Input, {
  defaultVariants: {
    color: "primary",
    variant: "faded",
    labelPlacement: "outside",
    placeholder: " ",
  },
  variants: {
    color: { primary: { inputWrapper: "bg-primary/20 border-primary/30" } },
  },
});
export const CTextarea = extendVariants(Textarea, {
  defaultVariants: {
    color: "primary",
    variant: "faded",
    labelPlacement: "outside",
    placeholder: " ",
  },
  variants: {
    color: { primary: { inputWrapper: "bg-primary/20 border-primary/30" } },
  },
});
export const CSelect = extendVariants(Select, {
  defaultVariants: {
    color: "primary",
    variant: "faded",
    labelPlacement: "outside",
    disallowEmptySelection: "true",
  },
  variants: {
    color: { primary: { trigger: "bg-primary/20 border-primary/30" } },
  },
});
export const CSelectItem = extendVariants(SelectItem, {
  defaultVariants: { color: "primary", variant: "flat" },
});
export const CDropdown = extendVariants(Dropdown, {
  defaultVariants: { size: "sm" },
});
export const CDropdownMenu = extendVariants(DropdownMenu, {
  defaultVariants: { color: "primary", variant: "flat" },
});
