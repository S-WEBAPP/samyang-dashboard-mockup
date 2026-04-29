'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

function matchPath(pathname: string, matcher?: { type: 'startsWith' | 'equals'; href: string }): boolean {
  if (!matcher) return false;
  if (matcher.type === 'equals') return pathname === matcher.href;
  if (matcher.type === 'startsWith') return pathname.startsWith(matcher.href);
  return false;
}

function getOpenKeyByPath(items: NavItemConfig[], pathname: string): string | null {
  for (const it of items) {
    if (it.items && it.items.length > 0) {
      const hasActiveChild = it.items.some((sub) =>
        sub.matcher ? matchPath(pathname, sub.matcher) : !!sub.href && pathname === sub.href
      );
      if (hasActiveChild) return it.key!;
      const deep = getOpenKeyByPath(it.items, pathname);
      if (deep) return it.key!;
    }
  }
  return null;
}

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();
  const [openItemKey, setOpenItemKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOpenItemKey(getOpenKeyByPath(navItems, pathname));
  }, [pathname]);

  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': '#323232',
          '--MobileNav-color': '#FFFFFF',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': '#FF6400',
          '--NavItem-active-color': '#FFFFFF',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': '#FFFFFF',
          '--NavItem-icon-active-color': '#FFFFFF',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          scrollbarWidth: 'none',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          <Logo color="light" width={190} height={31} />
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: '#323232',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2">
              경영지원본부 IT팀
            </Typography>
            <Typography color="inherit" variant="subtitle1">
              홍길동 매니저
            </Typography>
          </Box>
          <CaretUpDownIcon />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {navItems.map(({ key, ...item }) => (
            <NavItem
              key={key}
              {...item}
              pathname={pathname}
              open={openItemKey === key}
              onToggle={() => { setOpenItemKey(openItemKey === key ? null : key ?? null); }}
              onClose={onClose}
            />
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onClose?: () => void;
  items?: NavItemConfig[];
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, open, onToggle, onClose, items }: NavItemProps): React.JSX.Element {
  const active = !!(href && pathname === href) || (matcher ? matchPath(pathname, matcher) : false);
  const Icon = icon ? navIcons[icon] : null;
  const hasChildren = items && items.length > 0;

  return (
    <li>
      <Box
        onClick={hasChildren ? onToggle : onClose}
        {...(!hasChildren && href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--MobileNav-color)',
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          textDecoration: 'none',
          ...(disabled && { color: 'var(--NavItem-disabled-color)', cursor: 'not-allowed' }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
        }}
      >
        {Icon && (
          <Icon
            fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
            fontSize="var(--icon-fontSize-md)"
            weight={active ? 'fill' : undefined}
          />
        )}
        <Typography component="span" sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px', flex: '1 1 auto' }}>
          {title}
        </Typography>
        {hasChildren && (open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />)}
      </Box>

      {hasChildren && open && (
        <Stack spacing={0.5} sx={{ pl: 4, mt: 0.5 }}>
          {items.map((sub) => {
            const SubIcon = sub.icon ? navIcons[sub.icon] : null;
            const isActive = pathname === sub.href;
            return (
              <Box
                key={sub.key}
                component={sub.href ? (sub.external ? 'a' : RouterLink) : 'div'}
                {...(sub.href
                  ? {
                      href: sub.href,
                      onClick: onClose,
                      ...(sub.external && { target: '_blank', rel: 'noreferrer' }),
                    }
                  : {})}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  textDecoration: 'none',
                  color: isActive ? 'var(--NavItem-active-color)' : 'var(--MobileNav-color)',
                  bgcolor: isActive ? 'var(--NavItem-active-background)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {SubIcon && (
                  <SubIcon
                    fontSize="var(--icon-fontSize-sm)"
                    weight={isActive ? 'fill' : undefined}
                  />
                )}
                <Typography variant="body2">{sub.title}</Typography>
              </Box>
            );
          })}
        </Stack>
      )}
    </li>
  );
}
