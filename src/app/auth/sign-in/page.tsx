import * as React from 'react';
import type { Metadata } from 'next';

import { GuestGuard } from '@/components/auth/guest-guard';
import { LayoutSignIn } from '@/components/auth/layout-sign-in';
import { SignInForm } from '@/components/auth/sign-in-form';

export const metadata = { title: `Sign in | Auth` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <LayoutSignIn>
      <GuestGuard>
        <SignInForm />
      </GuestGuard>
    </LayoutSignIn>
  );
}
