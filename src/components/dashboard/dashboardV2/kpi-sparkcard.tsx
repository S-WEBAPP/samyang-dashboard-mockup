'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface KpiSparkcardProps {
  title: string;
  value: string;
  sparkData: number[];
  diff?: number;
  diffSuffix?: string;
  diffLabel?: string;
  trend?: 'up' | 'down';
  positiveDirection?: 'up' | 'down';
  icon: Icon;
  iconBgColor?: string;
  sx?: SxProps;
}

export function KpiSparkcard({
  title,
  value,
  sparkData,
  diff,
  diffSuffix = '%',
  diffLabel = '전월 대비',
  trend = 'up',
  positiveDirection = 'up',
  icon: IconComponent,
  iconBgColor = 'var(--mui-palette-primary-main)',
  sx,
}: KpiSparkcardProps): React.JSX.Element {
  const theme = useTheme();
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const isPositive = trend === positiveDirection;
  const trendColor = isPositive ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';
  const sparkColor = isPositive ? theme.palette.success.main : theme.palette.error.main;

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      sparkline: { enabled: true },
      toolbar: { show: false },
      animations: { enabled: false },
    },
    colors: [sparkColor],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0 },
    },
    tooltip: { enabled: false },
    theme: { mode: theme.palette.mode },
  };

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={2}>
            <Stack spacing={0.5}>
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: iconBgColor, height: '52px', width: '52px', flexShrink: 0 }}>
              <IconComponent fontSize="var(--icon-fontSize-md)" />
            </Avatar>
          </Stack>
          <Chart
            height={56}
            options={chartOptions}
            series={[{ name: title, data: sparkData }]}
            type="area"
            width="100%"
          />
          {diff === undefined ? null : (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-sm)" />
                <Typography color={trendColor} variant="body2" sx={{ fontWeight: 600 }}>
                  {diff}
                  {diffSuffix}
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                {diffLabel}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
