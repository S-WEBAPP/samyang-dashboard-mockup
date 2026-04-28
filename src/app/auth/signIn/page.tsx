import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { LayoutSignIn } from '@/components/auth/layoutSignIn';
import { SignInForm } from '@/components/auth/signInForm';
import Box from '@mui/material/Box';

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
