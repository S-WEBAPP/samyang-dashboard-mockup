'use client';

import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';

import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function LayoutSignIn({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex'},
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',     
        backgroundImage: `url("/assets/background-img.png")`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `cover`,
        backgroundPositionY: 'center',
        backgroundPositionX: 'center',
        height: "100%",
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 2 }}>
          <Link href={""} style={{ display: 'inline-block', fontSize: 0 }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={30} width={150} />
          </Link>
        </Box>
        <Box sx={{ 
          alignItems: 'center',
          display: 'flex',
          flex: '1 1 auto',
          justifyContent: 'center',
          p: 3,
          width: '100%',         
        }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
