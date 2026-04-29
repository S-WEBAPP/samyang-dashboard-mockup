import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'overview', title: 'Overview', href: paths.sy.overview, icon: 'chart-donut' },
  { key: 'dashboard', title: 'Dashboard', href: paths.sy.dashboard, icon: 'chart-pie' },
  { key: 'menu00', title: '품의서', href: '', icon: 'folder-simple',
    items: [
      { key: 'approval', title: '광고선전비 사전품의', href: paths.sy.approval, icon: 'file-text' },
      { key: 'amendment', title: '광고선전비 변경품의', href: paths.sy.amendment, icon: 'file-text' },
      { key: 'settlement', title: '광고선전비 정산품의', href: paths.sy.settlement, icon: 'file-text' },
    ],
  },
  // { key: 'approval', title: '광고선전비 사전품의', href: paths.sy.approval, icon: 'file-text' },
  // { key: 'overview', title: 'Overview', href: paths.sy.overview, icon: 'chart-pie' },
  // { key: 'dashboard', title: 'Dashboard', href: paths.sy.dashboard, icon: 'chart-donut' },
  // { key: 'customers', title: 'Customers', href: paths.sy.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.sy.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.sy.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];
