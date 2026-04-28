import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';

const statusMap = {
  active: { label: '진행중', color: 'success' },
  paused: { label: '일시중지', color: 'warning' },
  ended: { label: '종료', color: 'default' },
  draft: { label: '초안', color: 'info' },
} as const;

export interface Campaign {
  id: string;
  name: string;
  channel: string;
  budget: number;
  spent: number;
  clicks: number;
  conversions: number;
  status: 'active' | 'paused' | 'ended' | 'draft';
}

export interface CampaignListProps {
  campaigns?: Campaign[];
  sx?: SxProps;
}

function formatKRW(value: number): string {
  if (value >= 1_000_000) return `₩${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `₩${(value / 1000).toFixed(0)}K`;
  return `₩${value}`;
}

export function CampaignList({ campaigns = [], sx }: CampaignListProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="캠페인 목록" subheader="진행 중 및 완료된 캠페인 현황" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell>캠페인명</TableCell>
              <TableCell>채널</TableCell>
              <TableCell>예산 / 소진</TableCell>
              <TableCell sx={{ minWidth: 140 }}>소진율</TableCell>
              <TableCell align="right">클릭수</TableCell>
              <TableCell align="right">전환수</TableCell>
              <TableCell align="right">전환율</TableCell>
              <TableCell align="right">CPC</TableCell>
              <TableCell>상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => {
              const { label, color } = statusMap[campaign.status] ?? { label: '알 수 없음', color: 'default' };
              const spentPct = Math.min(Math.round((campaign.spent / campaign.budget) * 100), 100);
              const ctr =
                campaign.clicks > 0
                  ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1)
                  : '0.0';
              const cpc =
                campaign.clicks > 0
                  ? formatKRW(Math.round(campaign.spent / campaign.clicks))
                  : '-';
              const isOverspend = campaign.spent >= campaign.budget && campaign.status === 'active';

              return (
                <TableRow hover key={campaign.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {campaign.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {campaign.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={campaign.channel} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatKRW(campaign.budget)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      소진 {formatKRW(campaign.spent)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 140 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title={`${formatKRW(campaign.spent)} / ${formatKRW(campaign.budget)}`}>
                        <LinearProgress
                          value={spentPct}
                          variant="determinate"
                          color={isOverspend ? 'error' : spentPct >= 80 ? 'warning' : 'primary'}
                          sx={{ flex: 1, height: 6, borderRadius: 3 }}
                        />
                      </Tooltip>
                      <Box
                        component="span"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: isOverspend
                            ? 'error.main'
                            : spentPct >= 80
                              ? 'warning.main'
                              : 'text.secondary',
                          minWidth: 36,
                        }}
                      >
                        {spentPct}%
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{campaign.clicks.toLocaleString()}</TableCell>
                  <TableCell align="right">{campaign.conversions.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={Number(ctr) >= 3 ? 'success.main' : 'text.primary'}
                      sx={{ fontWeight: Number(ctr) >= 3 ? 600 : 400 }}
                    >
                      {ctr}%
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {cpc}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          전체 보기
        </Button>
      </CardActions>
    </Card>
  );
}
