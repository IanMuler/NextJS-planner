import { RefObject, useEffect } from "react";

/**
 * @param ref - Ref to the element that should be clicked outside of
 * @param callback - Callback to be called when the element is clicked outside of
 * @example
 * const ref = useRef(null);
 * useClickOutside(ref, () => {
 *  // Do something
 * });
 **/

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
};
