import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { Budget } from '@/components/sy/overview/budget';
import { LatestOrders } from '@/components/sy/overview/latest-orders';
import { LatestProducts } from '@/components/sy/overview/latest-products';
import { Sales } from '@/components/sy/overview/sales';
import { TasksProgress } from '@/components/sy/overview/tasks-progress';
import { TotalCustomers } from '@/components/sy/overview/total-customers';
import { TotalProfit } from '@/components/sy/overview/total-profit';
import { Traffic } from '@/components/sy/overview/traffic';

export const metadata: Metadata = { title: 'Overview' };

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Typography variant="h4">Overview</Typography>
      </Grid>
      <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid size={{ lg: 3, sm: 6, xs: 12 }}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid size={{ lg: 8, xs: 12 }}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid size={{ lg: 4, xs: 12 }}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid size={{ lg: 4, md: 6, xs: 12 }}>
        <LatestProducts
          products={[
            { id: 'PRD-005', name: 'Soja & Co. Eucalyptus', image: '/assets/product-5.png', updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate() },
            { id: 'PRD-004', name: 'Necessities Tote', image: '/assets/product-4.png', updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate() },
            { id: 'PRD-003', name: 'Cargo Lana Jacket', image: '/assets/product-3.png', updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate() },
            { id: 'PRD-002', name: 'Handmade Pouch', image: '/assets/product-2.png', updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate() },
            { id: 'PRD-001', name: 'Minimal Shoes', image: '/assets/product-1.png', updatedAt: dayjs().subtract(10, 'minutes').toDate() },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid size={{ lg: 8, md: 12, xs: 12 }}>
        <LatestOrders
          orders={[
            { id: 'ORD-007', customer: { name: 'Ekaterina Tankova' }, amount: 30.5, status: 'pending', createdAt: dayjs().subtract(10, 'minutes').toDate() },
            { id: 'ORD-006', customer: { name: 'Cao Yu' }, amount: 25.1, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
            { id: 'ORD-004', customer: { name: 'Alexa Richardson' }, amount: 10.99, status: 'refunded', createdAt: dayjs().subtract(10, 'minutes').toDate() },
            { id: 'ORD-003', customer: { name: 'Anje Keizer' }, amount: 96.43, status: 'pending', createdAt: dayjs().subtract(10, 'minutes').toDate() },
            { id: 'ORD-002', customer: { name: 'Clarke Gillebert' }, amount: 32.54, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
            { id: 'ORD-001', customer: { name: 'Adam Denisov' }, amount: 16.76, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
