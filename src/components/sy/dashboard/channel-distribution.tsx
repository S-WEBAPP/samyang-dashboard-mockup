'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface ChannelData {
  label: string;
  visitors: number;
  pct: number;
}

export interface ChannelDistributionProps {
  channels: ChannelData[];
  sx?: SxProps;
}

export function ChannelDistribution({ channels, sx }: ChannelDistributionProps): React.JSX.Element {
  const theme = useTheme();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  const chartOptions: ApexOptions = {
    chart: { background: 'transparent' },
    colors: COLORS,
    dataLabels: { enabled: false },
    labels: channels.map((c) => c.label),
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false, donut: { size: '70%' } } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: {
      fillSeriesColor: false,
      y: { formatter: (val) => `${val}%` },
    },
  };

  const totalVisitors = channels.reduce((sum, c) => sum + c.visitors, 0);

  return (
    <Card sx={sx}>
      <CardHeader title="채널별 방문자 분포" subheader={`총 ${totalVisitors.toLocaleString()}명`} />
      <CardContent>
        <Stack spacing={2}>
          <Chart
            height={220}
            options={chartOptions}
            series={channels.map((c) => c.pct)}
            type="donut"
            width="100%"
          />
          <Divider />
          <Stack spacing={1.5}>
            {channels.map((channel, index) => (
              <Stack
                key={channel.label}
                direction="row"
                sx={{ alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: COLORS[index % COLORS.length],
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2">{channel.label}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {channel.visitors.toLocaleString()}명
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS[index % COLORS.length],
                      fontWeight: 600,
                      minWidth: 36,
                      textAlign: 'right',
                    }}
                  >
                    {channel.pct}%
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
