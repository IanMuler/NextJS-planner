import { useState } from "react";
import { IGeneralContext } from "context/general/state";

type UseSwipe = (
  updateVisible: IGeneralContext["updateVisible"],
  isDragging: boolean
) => {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
};

export const useSwipe: UseSwipe = (updateVisible, isDragging) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance: number = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && !isDragging) updateVisible(true);
    if (isRightSwipe) updateVisible(false);
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
