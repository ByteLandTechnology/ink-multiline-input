import { useEffect, useRef, ReactNode } from "react";
import { Box, measureElement, type BoxProps } from "ink";

export interface MeasureBoxProps extends BoxProps {
  /**
   * Callback called when the measured height changes
   */
  onHeightChange?: (height: number) => void;
  children?: ReactNode;
}

/**
 * A Box component that measures its own height and notifies when it changes
 */
export const MeasureBox = ({ children, onHeightChange }: MeasureBoxProps) => {
  const ref = useRef<any>(null);
  const lastHeightRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (ref.current) {
      const { height } = measureElement(ref.current);

      // Only call callback if height actually changed
      if (lastHeightRef.current !== height) {
        lastHeightRef.current = height;
        onHeightChange?.(height);
      }
    }
  });

  return (
    <Box ref={ref} flexShrink={0} flexGrow={0} width="100%">
      {children}
    </Box>
  );
};
