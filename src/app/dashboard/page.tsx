import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { MarketingDashboard } from '@/components/dashboard/dashboardV2/marketing-dashboard';

export const metadata = { title: `마케팅 대시보드 | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <MarketingDashboard />;
}
