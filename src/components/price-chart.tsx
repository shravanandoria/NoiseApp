import { useCallback, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { THEME } from "@/lib/theme";
import type { PricePoint } from "@/lib/dummy-data/price-series";

type PriceChartProps = {
  data: PricePoint[];
  up: boolean;
  height?: number;
};

export function PriceChart({ data, up, height = 220 }: PriceChartProps) {
  const [width, setWidth] = useState(0);
  const color = up ? THEME.up : THEME.down;
  const lastValue = data[data.length - 1]?.value ?? 0;

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View onLayout={onLayout} style={{ height }}>
      {width > 0 ? (
        <LineChart
          data={data.map((point) => ({ value: point.value }))}
          width={width}
          height={height}
          adjustToWidth
          disableScroll
          curved
          areaChart
          hideDataPoints
          hideRules
          hideYAxisText
          hideAxesAndRules
          initialSpacing={0}
          endSpacing={0}
          maxValue={100}
          color={color}
          thickness={2.5}
          startFillColor={color}
          endFillColor={color}
          startOpacity={0.35}
          endOpacity={0}
          referenceLine1Position={lastValue}
          referenceLine1Config={{
            color,
            thickness: 1,
            dashWidth: 4,
            dashGap: 4,
          }}
        />
      ) : null}
    </View>
  );
}
