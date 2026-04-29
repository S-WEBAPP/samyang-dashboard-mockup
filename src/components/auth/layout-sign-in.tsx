'use client';

import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DynamicLogo } from '@/components/core/logo';
import { paths } from '@/paths';

export interface LayoutProps {
  children: React.ReactNode;
}

export function LayoutSignIn({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: 'minmax(360px, 1fr) minmax(0, 1fr)',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>
          <Link href={""} style={{ display: 'inline-block', fontSize: 0 }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={30} width={150} />
          </Link>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          backgroundImage: 'url(/assets/roundsquare-culturefit-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minWidth: 0,
          overflow: 'hidden',
        }}
      />
    </Box>
  );
}
