import * as React from 'react';
import type { Metadata } from 'next';

import { ApprovalForm } from '@/components/sy/approval/approval-form';

export const metadata: Metadata = { title: '광고선전비 사전품의' };

export default function Page(): React.JSX.Element {
  return <ApprovalForm />;
}
