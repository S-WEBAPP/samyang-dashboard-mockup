'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { FunnelIcon } from '@phosphor-icons/react/dist/ssr/Funnel';
import { RocketIcon } from '@phosphor-icons/react/dist/ssr/Rocket';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { WalletIcon } from '@phosphor-icons/react/dist/ssr/Wallet';

import { CampaignList } from './campaign-list';
import type { Campaign } from './campaign-list';
import { ChannelDistribution } from './channel-distribution';
import { ChannelPerformance } from './channel-performance';
import { ConversionFunnel } from './conversion-funnel';
import { KpiSparkcard } from './kpi-sparkcard';
import { RoasTrend } from './roas-trend';
import { VisitorTrend } from './visitor-trend';

type Period = '이번 달' | '최근 3개월' | '올해';

interface PeriodData {
  subtitle: string;
  diffLabel: string;
  kpi: {
    visitors: { value: string; diff: number; trend: 'up' | 'down'; spark: number[] };
    adSpend: { value: string; diff: number; trend: 'up' | 'down'; spark: number[] };
    convRate: { value: string; diff: number; trend: 'up' | 'down'; spark: number[] };
    roas: { value: string; diff: number; trend: 'up' | 'down'; spark: number[] };
  };
  visitorLabels: string[];
  visitorSeries: { name: string; data: number[] }[];
  channelDistribution: { label: string; visitors: number; pct: number }[];
  roasLabels: string[];
  spendData: number[];
  roasData: number[];
  channelPerfSeries: { name: string; data: number[] }[];
  funnelSteps: { label: string; value: number; color: string }[];
}

const SPARK_UP = [28, 32, 30, 35, 38, 36, 42, 45, 43, 48, 50, 52];
const SPARK_DOWN = [52, 50, 48, 45, 47, 43, 40, 42, 38, 36, 35, 33];

const periodData: Record<Period, PeriodData> = {
  '이번 달': {
    subtitle: '2024년 4월 기준 · 주차별 성과',
    diffLabel: '전월 대비',
    kpi: {
      visitors: { value: '248,500', diff: 14, trend: 'up', spark: SPARK_UP },
      adSpend:  { value: '₩14.8M',  diff: 8,  trend: 'up', spark: SPARK_DOWN },
      convRate: { value: '3.2%',    diff: 0.4, trend: 'up', spark: SPARK_UP },
      roas:     { value: '312%',    diff: 22, trend: 'up', spark: SPARK_UP },
    },
    visitorLabels: ['1주차', '2주차', '3주차', '4주차'],
    visitorSeries: [
      { name: '검색광고', data: [58_000, 62_000, 65_000, 68_000] },
      { name: 'SNS',    data: [34_000, 37_000, 39_000, 40_500] },
      { name: '이메일', data: [15_000, 17_500, 18_200, 19_200] },
      { name: '직접유입', data: [21_000, 23_000, 24_500, 25_000] },
    ],
    channelDistribution: [
      { label: '검색광고', visitors: 119_500, pct: 48 },
      { label: 'SNS',    visitors:  64_600, pct: 26 },
      { label: '이메일', visitors:  39_800, pct: 16 },
      { label: '직접유입', visitors: 24_600, pct: 10 },
    ],
    roasLabels: ['1주차', '2주차', '3주차', '4주차'],
    spendData: [340, 380, 390, 370],
    roasData:  [285, 305, 320, 312],
    channelPerfSeries: [
      { name: '노출수 (×100)', data: [1240, 860, 220, 456, 180] },
      { name: '클릭수 (×10)', data: [1284, 873, 221, 456, 0] },
      { name: '전환수',       data: [384,  120,  99,  61, 0] },
    ],
    funnelSteps: [
      { label: '노출 (Impression)', value: 3_840_000, color: 'var(--mui-palette-primary-main)' },
      { label: '방문 (Visit)',      value:   248_500, color: 'var(--mui-palette-info-main)' },
      { label: '클릭 (Click)',      value:    83_400, color: 'var(--mui-palette-warning-main)' },
      { label: '전환 (Conversion)', value:     6645, color: 'var(--mui-palette-success-main)' },
    ],
  },

  '최근 3개월': {
    subtitle: '2024년 2월 — 4월 · 월별 성과',
    diffLabel: '전분기 대비',
    kpi: {
      visitors: { value: '698,200', diff: 11, trend: 'up', spark: SPARK_UP },
      adSpend:  { value: '₩42.2M',  diff: 6,  trend: 'up', spark: SPARK_DOWN },
      convRate: { value: '3.0%',    diff: 0.2, trend: 'up', spark: SPARK_UP },
      roas:     { value: '301%',    diff: 15, trend: 'up', spark: SPARK_UP },
    },
    visitorLabels: ['2월', '3월', '4월'],
    visitorSeries: [
      { name: '검색광고', data: [108_000, 113_000, 119_500] },
      { name: 'SNS',    data: [ 58_000,  61_000,  64_600] },
      { name: '이메일', data: [ 35_000,  37_000,  39_800] },
      { name: '직접유입', data: [ 21_000,  22_500,  24_600] },
    ],
    channelDistribution: [
      { label: '검색광고', visitors: 340_500, pct: 49 },
      { label: 'SNS',    visitors: 183_600, pct: 26 },
      { label: '이메일', visitors: 111_800, pct: 16 },
      { label: '직접유입', visitors:  62_300, pct:  9 },
    ],
    roasLabels: ['2월', '3월', '4월'],
    spendData: [1320, 1400, 1480],
    roasData:  [ 290,  301,  312],
    channelPerfSeries: [
      { name: '노출수 (×100)', data: [3540, 2620, 640, 1260, 510] },
      { name: '클릭수 (×10)', data: [3680, 2660, 640, 1320, 0] },
      { name: '전환수',       data: [1100,  360, 290,  180, 0] },
    ],
    funnelSteps: [
      { label: '노출 (Impression)', value: 11_200_000, color: 'var(--mui-palette-primary-main)' },
      { label: '방문 (Visit)',      value:    698_200, color: 'var(--mui-palette-info-main)' },
      { label: '클릭 (Click)',      value:    241_000, color: 'var(--mui-palette-warning-main)' },
      { label: '전환 (Conversion)', value:     19_300, color: 'var(--mui-palette-success-main)' },
    ],
  },

  '올해': {
    subtitle: '2024년 1월 — 4월 · 월별 누적 성과',
    diffLabel: '전년 동기 대비',
    kpi: {
      visitors: { value: '891,400', diff: 19, trend: 'up', spark: SPARK_UP },
      adSpend:  { value: '₩54.8M',  diff: 12, trend: 'up', spark: SPARK_DOWN },
      convRate: { value: '2.9%',    diff: 0.5, trend: 'up', spark: SPARK_UP },
      roas:     { value: '295%',    diff: 28, trend: 'up', spark: SPARK_UP },
    },
    visitorLabels: ['1월', '2월', '3월', '4월'],
    visitorSeries: [
      { name: '검색광고', data: [ 97_000, 108_000, 113_000, 119_500] },
      { name: 'SNS',    data: [ 52_000,  58_000,  61_000,  64_600] },
      { name: '이메일', data: [ 31_000,  35_000,  37_000,  39_800] },
      { name: '직접유입', data: [ 18_500,  21_000,  22_500,  24_600] },
    ],
    channelDistribution: [
      { label: '검색광고', visitors: 437_500, pct: 49 },
      { label: 'SNS',    visitors: 235_600, pct: 26 },
      { label: '이메일', visitors: 142_800, pct: 16 },
      { label: '직접유입', visitors:  75_500, pct:  9 },
    ],
    roasLabels: ['1월', '2월', '3월', '4월'],
    spendData: [1200, 1320, 1400, 1480],
    roasData:  [ 275,  290,  301,  312],
    channelPerfSeries: [
      { name: '노출수 (×100)', data: [4440, 3320,  820, 1600, 650] },
      { name: '클릭수 (×10)', data: [4600, 3380,  820, 1680, 0] },
      { name: '전환수',       data: [1380,  460,  370,  230, 0] },
    ],
    funnelSteps: [
      { label: '노출 (Impression)', value: 14_400_000, color: 'var(--mui-palette-primary-main)' },
      { label: '방문 (Visit)',      value:    891_400, color: 'var(--mui-palette-info-main)' },
      { label: '클릭 (Click)',      value:    308_000, color: 'var(--mui-palette-warning-main)' },
      { label: '전환 (Conversion)', value:     24_700, color: 'var(--mui-palette-success-main)' },
    ],
  },
};

const campaigns: Campaign[] = [
  {
    id: 'CMP-001',
    name: '2024 봄 신상품 론칭',
    channel: '검색광고',
    budget: 5_000_000,
    spent: 4_250_000,
    clicks: 128_400,
    conversions: 3842,
    status: 'active',
  },
  {
    id: 'CMP-002',
    name: '인스타그램 브랜드 인지도',
    channel: 'SNS',
    budget: 3_000_000,
    spent: 2_900_000,
    clicks: 87_300,
    conversions: 1204,
    status: 'active',
  },
  {
    id: 'CMP-003',
    name: '뉴스레터 재구매 유도',
    channel: '이메일',
    budget: 800_000,
    spent: 800_000,
    clicks: 22_100,
    conversions: 987,
    status: 'ended',
  },
  {
    id: 'CMP-004',
    name: '유튜브 동영상 광고',
    channel: '디스플레이',
    budget: 4_000_000,
    spent: 1_200_000,
    clicks: 45_600,
    conversions: 612,
    status: 'paused',
  },
  {
    id: 'CMP-005',
    name: '제휴몰 프로모션',
    channel: '제휴',
    budget: 2_000_000,
    spent: 0,
    clicks: 0,
    conversions: 0,
    status: 'draft',
  },
];

export function MarketingDashboard(): React.JSX.Element {
  const [period, setPeriod] = React.useState<Period>('이번 달');
  const d = periodData[period];

  function handlePeriodChange(_: React.MouseEvent<HTMLElement>, next: Period | null): void {
    if (next) setPeriod(next);
  }

  return (
    <Stack spacing={3}>
      {/* 헤더 */}
      <Stack
        direction="row"
        sx={{ alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4">마케팅 대시보드</Typography>
          <Typography color="text.secondary" variant="body2">
            {d.subtitle}
          </Typography>
        </Stack>
        <ToggleButtonGroup exclusive onChange={handlePeriodChange} size="small" value={period}>
          <ToggleButton value="이번 달">이번 달</ToggleButton>
          <ToggleButton value="최근 3개월">최근 3개월</ToggleButton>
          <ToggleButton value="올해">올해</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Grid container spacing={3}>
        {/* KPI 스파크카드 */}
        <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
          <KpiSparkcard
            title="총 방문자수"
            value={d.kpi.visitors.value}
            sparkData={d.kpi.visitors.spark}
            diff={d.kpi.visitors.diff}
            diffSuffix="%"
            diffLabel={d.diffLabel}
            trend={d.kpi.visitors.trend}
            icon={UsersIcon}
            iconBgColor="var(--mui-palette-success-main)"
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
          <KpiSparkcard
            title="총 광고비"
            value={d.kpi.adSpend.value}
            sparkData={d.kpi.adSpend.spark}
            diff={d.kpi.adSpend.diff}
            diffSuffix="%"
            diffLabel={d.diffLabel}
            trend={d.kpi.adSpend.trend}
            positiveDirection="down"
            icon={WalletIcon}
            iconBgColor="var(--mui-palette-primary-main)"
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
          <KpiSparkcard
            title="평균 전환율"
            value={d.kpi.convRate.value}
            sparkData={d.kpi.convRate.spark}
            diff={d.kpi.convRate.diff}
            diffSuffix="%p"
            diffLabel={d.diffLabel}
            trend={d.kpi.convRate.trend}
            icon={FunnelIcon}
            iconBgColor="var(--mui-palette-warning-main)"
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
          <KpiSparkcard
            title="캠페인 ROAS"
            value={d.kpi.roas.value}
            sparkData={d.kpi.roas.spark}
            diff={d.kpi.roas.diff}
            diffSuffix="%p"
            diffLabel={d.diffLabel}
            trend={d.kpi.roas.trend}
            icon={RocketIcon}
            iconBgColor="var(--mui-palette-error-main)"
            sx={{ height: '100%' }}
          />
        </Grid>

        {/* 방문자 추이 + 채널 분포 */}
        <Grid size={{ lg: 8, xs: 12 }}>
          <VisitorTrend
            chartSeries={d.visitorSeries}
            labels={d.visitorLabels}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ChannelDistribution channels={d.channelDistribution} sx={{ height: '100%' }} />
        </Grid>

        {/* ROAS 추이 + 전환 퍼널 */}
        <Grid size={{ lg: 8, xs: 12 }}>
          <RoasTrend
            labels={d.roasLabels}
            spendData={d.spendData}
            roasData={d.roasData}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ConversionFunnel steps={d.funnelSteps} sx={{ height: '100%' }} />
        </Grid>

        {/* 채널별 성과 */}
        <Grid size={{ xs: 12 }}>
          <ChannelPerformance chartSeries={d.channelPerfSeries} />
        </Grid>

        {/* 캠페인 목록 */}
        <Grid size={{ xs: 12 }}>
          <CampaignList campaigns={campaigns} />
        </Grid>
      </Grid>
    </Stack>
  );
}
