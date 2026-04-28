'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface ChannelPerformanceProps {
  chartSeries: { name: string; data: number[] }[];
  sx?: SxProps;
}

export function ChannelPerformance({ chartSeries, sx }: ChannelPerformanceProps): React.JSX.Element {
  const chartOptions = useChartOptions();

  return (
    <Card sx={sx}>
      <CardHeader title="채널별 캠페인 성과" subheader="노출 · 클릭 · 전환 비교" />
      <CardContent>
        <Chart height={300} options={chartOptions} series={chartSeries} type="bar" width="100%" />
      </CardContent>
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [
      theme.palette.primary.main,
      alpha(theme.palette.primary.main, 0.5),
      theme.palette.success.main,
    ],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: true, position: 'top', horizontalAlign: 'right' },
    plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: ['검색광고', 'SNS', '이메일', '디스플레이', '제휴'],
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}K` : `${value}`),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
    tooltip: { shared: true, intersect: false },
  };
}
