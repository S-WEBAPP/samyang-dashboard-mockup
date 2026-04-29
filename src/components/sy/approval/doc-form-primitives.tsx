'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash';

import type { AccountRow, TransferRow } from './doc-form-types';

/* ---- Section header with number badge ---- */

interface SectionHeaderProps {
  num: React.ReactNode;
  title: string;
  required?: boolean;
  action?: React.ReactNode;
}

export function SectionHeader({ num, title, required = false, action }: SectionHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        background: 'linear-gradient(to bottom, var(--mui-palette-grey-100), var(--mui-palette-grey-50))',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{
          width: 22, height: 22,
          bgcolor: 'var(--mui-palette-primary-800, #1a3a6e)',
          color: '#fff',
          borderRadius: '3px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 700,
        }}>
          {num}
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>
        {required && <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 500 }}>* 필수</Typography>}
      </Stack>
      {action}
    </Stack>
  );
}

/* ---- Label + content row ---- */

interface FieldRowProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  fieldRef?: React.Ref<HTMLDivElement | null>;
}

export function FieldRow({ label, required, children, fieldRef }: FieldRowProps) {
  return (
    <Stack ref={fieldRef} direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'flex-start' }}>
      <Typography variant="caption" sx={{ width: 130, flexShrink: 0, pt: '9px', fontWeight: 500, color: 'text.secondary' }}>
        {label}{required && <Box component="span" sx={{ color: 'error.main', ml: 0.25 }}>*</Box>}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Stack>
  );
}

/* ---- Sub-section caption (집행계정, 계정간 전용 etc.) ---- */

export function BudgetCaption({ title }: { title: string }) {
  return (
    <Typography variant="caption" sx={{
      display: 'block', mt: 2, mb: 0.75, fontWeight: 600, color: 'primary.main',
      borderLeft: '3px solid', borderColor: 'primary.main', pl: 1,
    }}>
      {title}
    </Typography>
  );
}

/* ---- Account execution table ---- */

interface AccountTableProps {
  rows: AccountRow[];
  columns: string[];
  fields: (keyof AccountRow)[];
  onUpdate: (id: number, field: keyof AccountRow, val: string) => void;
  onRemove: (id: number) => void;
}

export function AccountTable({ rows, columns, fields, onUpdate, onRemove }: AccountTableProps) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ border: '1px solid', borderColor: 'divider', minWidth: 860 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: '0.7rem', width: 90, whiteSpace: 'nowrap' }}>구분</TableCell>
            {columns.map((c) => (
              <TableCell key={c} sx={{ color: '#fff', fontWeight: 500, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{c}</TableCell>
            ))}
            <TableCell sx={{ color: '#fff', width: 40 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>집행계정</TableCell>
              {fields.map((f) => (
                <TableCell key={f}>
                  <TextField
                    size="small" variant="standard" fullWidth
                    value={row[f]}
                    onChange={(e) => { onUpdate(row.id, f, e.target.value); }}
                    inputProps={{ style: ['budget', 'balance', 'amount'].includes(f) ? { textAlign: 'right' } : {} }}
                  />
                </TableCell>
              ))}
              <TableCell>
                <IconButton size="small" onClick={() => { onRemove(row.id); }}><Trash size={13} /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

/* ---- Budget transfer table (계정간/부서간 전용) ---- */

interface TransferTableProps {
  rows: TransferRow[];
  onUpdate: (id: number, field: keyof TransferRow, val: string) => void;
  onRemove: (id: number) => void;
}

export function TransferTable({ rows, onUpdate, onRemove }: TransferTableProps) {
  const cols = ['월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액', '현재잔액', '이월/전용액'];
  const fields: (keyof TransferRow)[] = ['month', 'cc', 'ccName', 'accCode', 'accName', 'budget', 'balance', 'transferAmt'];
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ border: '1px solid', borderColor: 'divider', minWidth: 900 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 500, fontSize: '0.7rem', width: 90, whiteSpace: 'nowrap' }}>구분</TableCell>
            {cols.map((c) => (
              <TableCell key={c} sx={{ color: '#fff', fontWeight: 500, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{c}</TableCell>
            ))}
            <TableCell sx={{ color: '#fff', width: 40 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{row.type}</TableCell>
              {fields.map((f) => (
                <TableCell key={f}>
                  <TextField
                    size="small" variant="standard" fullWidth
                    value={row[f]}
                    onChange={(e) => { onUpdate(row.id, f, e.target.value); }}
                    inputProps={{ style: ['budget', 'balance', 'transferAmt'].includes(f) ? { textAlign: 'right' } : {} }}
                  />
                </TableCell>
              ))}
              <TableCell>
                <IconButton size="small" onClick={() => { onRemove(row.id); }}><Trash size={13} /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
