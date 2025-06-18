import { useEffect } from "react";

export default function useOnBlur(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  onBlur: () => void
) {
  const handleClickOutside = ({ target }: MouseEvent) => {
    if (ref.current && !ref.current.contains(target as Node | null)) {
      onBlur();
    }
  };
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
}
