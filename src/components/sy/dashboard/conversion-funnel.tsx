import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';

export interface FunnelStep {
  label: string;
  value: number;
  color: string;
}

export interface ConversionFunnelProps {
  steps: FunnelStep[];
  sx?: SxProps;
}

export function ConversionFunnel({ steps, sx }: ConversionFunnelProps): React.JSX.Element {
  const maxValue = steps[0]?.value ?? 1;

  return (
    <Card sx={sx}>
      <CardHeader title="전환 퍼널" subheader="노출부터 전환까지 단계별 현황" />
      <CardContent>
        <Stack spacing={0.5}>
          {steps.map((step, index) => {
            const widthPct = Math.round((step.value / maxValue) * 100);
            const prev = index > 0 ? steps[index - 1] : null;
            const dropRate = prev
              ? (((prev.value - step.value) / prev.value) * 100).toFixed(1)
              : null;

            return (
              <React.Fragment key={step.label}>
                {dropRate === null ? null : (
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ alignItems: 'center', pl: 1, py: 0.25 }}
                  >
                    <ArrowDownIcon
                      fontSize="12px"
                      color="var(--mui-palette-text-disabled)"
                    />
                    <Typography variant="caption" color="text.disabled">
                      {dropRate}% 이탈
                    </Typography>
                  </Stack>
                )}
                <Box>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', mb: 0.5, alignItems: 'baseline' }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {step.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.value.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 34,
                      width: `${widthPct}%`,
                      minWidth: 48,
                      backgroundColor: step.color,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      px: 1.5,
                      transition: 'width 0.4s ease',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: 'white', fontWeight: 700, lineHeight: 1 }}
                    >
                      {widthPct}%
                    </Typography>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
