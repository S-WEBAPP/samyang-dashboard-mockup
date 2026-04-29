'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface RoasTrendProps {
  labels: string[];
  spendData: number[];
  roasData: number[];
  sx?: SxProps;
}

export function RoasTrend({ labels, spendData, roasData, sx }: RoasTrendProps): React.JSX.Element {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [alpha(theme.palette.primary.main, 0.85), theme.palette.warning.main],
    dataLabels: { enabled: false },
    fill: { opacity: [1, 1] },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: true, position: 'top', horizontalAlign: 'right' },
    plotOptions: { bar: { columnWidth: '45%', borderRadius: 4 } },
    stroke: { width: [0, 3], curve: 'smooth' },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider },
      axisTicks: { color: theme.palette.divider },
      categories: labels,
      labels: { style: { colors: theme.palette.text.secondary } },
    },
    yaxis: [
      {
        seriesName: '광고비 (만원)',
        title: {
          text: '광고비 (만원)',
          style: { color: theme.palette.text.secondary, fontWeight: 400, fontSize: '12px' },
        },
        labels: {
          formatter: (v) => `${v}만`,
          style: { colors: theme.palette.text.secondary },
        },
      },
      {
        opposite: true,
        seriesName: 'ROAS (%)',
        title: {
          text: 'ROAS (%)',
          style: { color: theme.palette.text.secondary, fontWeight: 400, fontSize: '12px' },
        },
        labels: {
          formatter: (v) => `${v}%`,
          style: { colors: theme.palette.text.secondary },
        },
        min: 0,
        max: 500,
      },
    ],
    tooltip: { shared: true, intersect: false },
  };

  const series = [
    { name: '광고비 (만원)', type: 'column', data: spendData },
    { name: 'ROAS (%)', type: 'line', data: roasData },
  ];

  return (
    <Card sx={sx}>
      <CardHeader title="ROAS · 광고비 추이" subheader="광고비 대비 수익률 변화" />
      <CardContent>
        <Chart height={300} options={chartOptions} series={series} type="line" width="100%" />
      </CardContent>
    </Card>
  );
}
