import React, { memo } from 'react';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from 'recharts';

type HistogramProps = {
  data: {
    index: string;
    value: number;
  }[];
};

const Histogram = ({ data }: HistogramProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barGap={0}
        barCategoryGap={0}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" minTickGap={20} />
        <YAxis domain={['dataMin', (dataMax) => Math.min(100000, dataMax)]} />
        <Tooltip />
        <Bar dataKey="value" fill="#2C7A7B" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default memo(Histogram);
