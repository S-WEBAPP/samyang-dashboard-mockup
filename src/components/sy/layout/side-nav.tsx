'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import type { NavItemConfig } from '@/types/nav';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function matchPath(pathname: string, matcher?: { type: 'startsWith' | 'equals'; href: string }): boolean {
  if (!matcher) return false;

  if (matcher.type === 'equals') {
    return pathname === matcher.href;
  }
  if (matcher.type === 'startsWith') {
    return pathname.startsWith(matcher.href);
  }
  return false;
}

function getOpenKeyByPath(items: NavItemConfig[], pathname: string): string | null {
  for (const it of items) {
    if (it.items && it.items.length > 0) {
      
      const hasActiveChild = it.items.some((sub) => {
        if (sub.matcher) return matchPath(pathname, sub.matcher);
        return !!sub.href && pathname === sub.href;
      });      
      if (hasActiveChild) return it.key!;

      const deep = getOpenKeyByPath(it.items, pathname);
      if (deep) return it.key!;
    }
  }
  return null;
}

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const [openItemKey, setOpenItemKey] = useState<string | null>(null);

  React.useEffect(() => {
    const key = getOpenKeyByPath(navItems, pathname);
    setOpenItemKey(key);
  }, [pathname]);

  return (
    <Box
      sx={{
        '--SideNav-background': '#323232',
        '--SideNav-color': '#FFFFFF',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': '#FF6400',
        '--NavItem-active-color': '#FFFFFF',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': '#FFFFFF',
        '--NavItem-icon-active-color': '#FFFFFF',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        position: 'fixed',
        top: 0,
        width: 280,
        zIndex: 1200,
        overflowX: 'hidden',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={''} sx={{ display: 'inline-flex', alignSelf: 'center' }}>
          <Logo color="light" width={190} height={31} />
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: '#323232',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '12px',
            cursor: 'auto',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2">
              삼양식품 경영지원본부
            </Typography>
            <Typography color="inherit" variant="subtitle1">
              IT팀
            </Typography>
          </Box>
          <AssignmentIndIcon />
        </Box>
      </Stack>

      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />

      <Box component="nav" sx={{ flex: 1, p: '12px' }}>
        {renderNavItems({
          pathname,
          items: navItems,
          openItemKey,
          setOpenItemKey,
        })}
      </Box>
    </Box>
  );
}

function renderNavItems({
  items = [],
  pathname,
  openItemKey,
  setOpenItemKey,
}: {
  items?: NavItemConfig[];
  pathname: string;
  openItemKey: string | null;
  setOpenItemKey: (key: string | null) => void;
}): React.JSX.Element {
  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {items.map(({ key, ...item }) => (
        <NavItem
          key={key}
          {...item}
          pathname={pathname}
          open={openItemKey === key}
          onToggle={() => setOpenItemKey(openItemKey === key ? null : key)}
        />
      ))}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  open: boolean;
  onToggle: () => void;
  items?: NavItemConfig[];
}

function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
  open,
  onToggle,
  items,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const hasChildren = items && items.length > 0;

  return (
    <li>
      <Box
        onClick={hasChildren ? onToggle : undefined}
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
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          color: 'var(--NavItem-color)',
          ...(active && {
            bgcolor: 'var(--NavItem-active-background)',
            color: 'var(--NavItem-active-color)',
          }),
          textDecoration: 'none'
        }}
      >
        {Icon && <Icon fontSize="medium" />}
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{title}</Typography>

        <Box sx={{ flexGrow: 1 }} />
        {hasChildren && (
          open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
        )}
      </Box>

      {hasChildren && open && (
        <Stack spacing={0.5} sx={{ pl: 4, mt: 1 }}>
          {items.map((sub) => {
            const isExternal = sub.external === true;
            const SubIcon = sub.icon ? navIcons[sub.icon] : null;
            const isActive = pathname === sub.href;

            return (
              <Box
                key={sub.key}
                component={sub.href ? (isExternal ? 'a' : RouterLink) : 'div'}
                {...(sub.href
                  ? {
                      href: sub.href,
                      ...(isExternal && { target: '_blank', rel: 'noreferrer' }),
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
                  color: isActive ? 'var(--NavItem-active-color)' : 'var(--SideNav-color)',
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
