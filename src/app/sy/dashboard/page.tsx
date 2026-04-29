import * as React from 'react';
import type { Metadata } from 'next';

import { MarketingDashboard } from '@/components/sy/dashboard/marketing-dashboard';

export const metadata: Metadata = { title: '마케팅 대시보드' };

export default function Page(): React.JSX.Element {
  return <MarketingDashboard />;
}
