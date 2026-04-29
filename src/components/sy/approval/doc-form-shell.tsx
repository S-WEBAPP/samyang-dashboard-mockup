'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { FileArrowDown } from '@phosphor-icons/react/dist/ssr/FileArrowDown';
import { PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { PrinterIcon } from '@phosphor-icons/react/dist/ssr/Printer';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { APPROVAL_LINES, stepColorMap } from './doc-form-types';
import type { ToastState } from './doc-form-types';

export interface DocFormShellProps {
  /** Document title shown in header and author info table */
  docTitle: string;
  /** Breadcrumb leaf label */
  breadcrumbLabel: string;
  /** Currently selected approval line id */
  selectedLineId: string;
  onLineChange: (id: string) => void;
  /** Called when Excel download button is clicked */
  onExcelDownload: () => void;
  /** Called when Print button is clicked */
  onPrint: () => void;
  /** Called when draft save button is clicked */
  onSaveDraft: () => void;
  lastSaved: string;
  /**
   * Called when submit button is clicked.
   * Return validation errors (empty = valid).
   * Optional onDialogClose is called after the validation dialog is dismissed (for scroll/focus).
   */
  validate: () => { errors: string[]; onDialogClose?: () => void };
  onConfirmSubmit: () => void;
  /** JSX rendered inside the preview dialog */
  previewContent: React.ReactNode;
  toast: ToastState | null;
  children: React.ReactNode;
}

export function DocFormShell({
  docTitle,
  breadcrumbLabel,
  selectedLineId,
  onLineChange,
  onExcelDownload,
  onPrint,
  onSaveDraft,
  lastSaved,
  validate,
  onConfirmSubmit,
  previewContent,
  toast,
  children,
}: DocFormShellProps): React.JSX.Element {
  const today = new Date().toISOString().slice(0, 10);

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false);
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [validationOpen, setValidationOpen] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const validationCloseCallback = React.useRef<(() => void) | undefined>(undefined);

  const [lineModalOpen, setLineModalOpen] = React.useState(false);
  const [pendingLineId, setPendingLineId] = React.useState(selectedLineId);

  const currentLine = APPROVAL_LINES.find((l) => l.id === selectedLineId) ?? APPROVAL_LINES[0];

  function handleSubmitClick() {
    const { errors, onDialogClose } = validate();
    if (errors.length > 0) {
      validationCloseCallback.current = onDialogClose;
      setValidationErrors(errors);
      setValidationOpen(true);
    } else {
      setSubmitModalOpen(true);
    }
  }

  function closeValidationDialog() {
    setValidationOpen(false);
    const cb = validationCloseCallback.current;
    validationCloseCallback.current = undefined;
    if (cb) setTimeout(() => cb(), 150);
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Breadcrumb */}
      <Stack className="print-hide" direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          전자결재 &rsaquo; 기안하기 &rsaquo; 마케팅 &rsaquo;{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{breadcrumbLabel}</Box>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', bgcolor: 'grey.100', px: 1.5, py: 0.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          문서번호 : <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>상신 후 자동 부여</Box>
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        {/* Document header */}
        <Stack
          direction="row"
          sx={{ px: 3, py: 2.5, alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid', borderColor: 'primary.main' }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Chip label="기안" size="small" sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 700, borderRadius: '3px' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{docTitle}</Typography>
            <Chip label="● 작성중" size="small" sx={{ bgcolor: '#fff3bf', color: '#846200' }} />
            <Chip label="대외비" size="small" sx={{ bgcolor: '#e7f5ff', color: '#1971c2' }} />
          </Stack>
          <Stack className="print-hide" direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<FileArrowDown />}
              onClick={onExcelDownload}
              sx={{ bgcolor: '#2b8a3e', '&:hover': { bgcolor: '#237032' } }}
            >
              Excel 다운로드
            </Button>
            <Button size="small" variant="outlined" startIcon={<PrinterIcon />} onClick={onPrint}>
              인쇄
            </Button>
          </Stack>
        </Stack>

        {/* Approval line */}
        <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 3, height: 14, bgcolor: 'primary.main', borderRadius: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>결재선</Typography>
              <Typography variant="caption" sx={{ color: 'info.main' }}>({currentLine.name})</Typography>
            </Stack>
            <Button
              className="print-hide"
              size="small"
              variant="outlined"
              startIcon={<PencilIcon />}
              onClick={() => { setPendingLineId(selectedLineId); setLineModalOpen(true); }}
            >
              결재선 변경
            </Button>
          </Stack>
          <Stack direction="row" spacing={0} sx={{ alignItems: 'stretch', flexWrap: 'wrap', gap: 1 }}>
            {currentLine.steps.map((step, idx) => (
              <Stack key={idx} direction="row" sx={{ alignItems: 'center' }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5, minWidth: 110,
                    borderColor: step.type === '기안' ? 'primary.main' : 'divider',
                    bgcolor: step.type === '기안' ? '#f0f5ff' : '#fff',
                  }}
                >
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{
                      width: 16, height: 16, borderRadius: '50%',
                      bgcolor: step.type === '기안' ? 'primary.main' : 'grey.400',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', fontWeight: 700,
                    }}>
                      {idx}
                    </Box>
                    <Chip label={step.type} size="small" color={stepColorMap[step.type]} sx={{ height: 18, fontSize: '0.65rem' }} />
                  </Stack>
                  <Typography variant="caption" sx={{ fontWeight: 500, display: 'block' }}>{step.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>{step.dept}</Typography>
                </Paper>
                {idx < currentLine.steps.length - 1 && (
                  <ArrowRight size={14} style={{ color: 'var(--mui-palette-text-disabled)', margin: '0 2px' }} />
                )}
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Author info */}
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Table size="small">
            <TableBody>
              <TableRow sx={{ height: 44 }}>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, width: 100, fontSize: '0.75rem' }}>작성자</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>기안자</TableCell>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, width: 80, fontSize: '0.75rem' }}>소속</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>삼양식품(주) / 커머셜비용전략파트</TableCell>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, width: 70, fontSize: '0.75rem' }}>작성일</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{today}</TableCell>
              </TableRow>
              <TableRow sx={{ height: 44 }}>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, fontSize: '0.75rem' }}>문서종류</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{docTitle}</TableCell>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, fontSize: '0.75rem' }}>보존년한</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>5년</TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Form body */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>

        {/* Bottom action bar */}
        <Box sx={{
          px: 3, py: 1.75,
          borderTop: '1px solid', borderColor: 'divider',
          bgcolor: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            마지막 저장 : <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{lastSaved}</Box>
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="inherit" size="small" onClick={() => { setCancelModalOpen(true); }}>취소</Button>
            <Button variant="outlined" color="info" size="small" onClick={onSaveDraft}>임시저장</Button>
            <Button
              variant="outlined" size="small"
              onClick={() => { setPreviewOpen(true); }}
              sx={{ color: '#1971c2', borderColor: '#a5d8ff', bgcolor: '#e7f5ff', '&:hover': { bgcolor: '#d0ebff' } }}
            >
              미리보기
            </Button>
            <Button
              variant="contained" size="small"
              endIcon={<ArrowRight />}
              onClick={handleSubmitClick}
              sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              결재 상신
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Validation dialog */}
      <Dialog open={validationOpen} onClose={closeValidationDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: 'error.main', color: '#fff', py: 1.5, fontSize: '0.95rem' }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            필수 항목 미입력
            <IconButton size="small" onClick={closeValidationDialog} sx={{ color: '#fff' }}>
              <XIcon size={18} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5, pb: 1 }}>
          <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
            결재 상신 전 다음 필수 항목을 입력해주세요.
          </Typography>
          <Stack spacing={0.5}>
            {validationErrors.map((label) => (
              <Stack key={label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'error.main', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 500 }}>{label}</Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button variant="contained" color="error" fullWidth onClick={closeValidationDialog}>
            확인 후 수정하기
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval line selection modal */}
      <Dialog open={lineModalOpen} onClose={() => { setLineModalOpen(false); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: '#fff', py: 1.5 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            결재선 선택
            <IconButton size="small" onClick={() => { setLineModalOpen(false); }} sx={{ color: '#fff' }}><XIcon size={18} /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            집행 금액과 안건 성격에 따라 적절한 유형을 선택하세요.
          </Typography>
          <Stack spacing={1.5}>
            {APPROVAL_LINES.map((line) => (
              <Paper
                key={line.id}
                variant="outlined"
                onClick={() => { setPendingLineId(line.id); }}
                sx={{
                  p: 2, cursor: 'pointer',
                  borderColor: pendingLineId === line.id ? 'primary.main' : 'divider',
                  bgcolor: pendingLineId === line.id ? '#f0f5ff' : '#fff',
                  '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
                }}
              >
                <Stack direction="row" sx={{ alignItems: 'center', mb: 0.5 }} spacing={1}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{line.name}</Typography>
                  <Chip label={line.tag} size="small" color="primary" variant="outlined" />
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>{line.desc}</Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {line.steps.map((s, i) => (
                    <React.Fragment key={i}>
                      <Chip label={`${s.type}: ${s.name}`} size="small" color={stepColorMap[s.type]} variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                      {i < line.steps.length - 1 && <ArrowRight size={12} style={{ margin: 'auto 0' }} />}
                    </React.Fragment>
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button variant="outlined" color="inherit" onClick={() => { setLineModalOpen(false); }}>취소</Button>
          <Button variant="contained" onClick={() => { onLineChange(pendingLineId); setLineModalOpen(false); }}>선택 적용</Button>
        </DialogActions>
      </Dialog>

      {/* Submit confirm dialog */}
      <Dialog open={submitModalOpen} onClose={() => { setSubmitModalOpen(false); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: '#fff', py: 1.5 }}>결재 상신</DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>결재를 상신하시겠습니까?</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            상신 후에는 결재선의 첫 번째 합의자에게 자동 발송되며,<br />
            회수 전까지 수정이 불가합니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2.5, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={() => { setSubmitModalOpen(false); }}>취소</Button>
          <Button variant="contained" onClick={() => { setSubmitModalOpen(false); onConfirmSubmit(); }}>상신하기</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel confirm dialog */}
      <Dialog open={cancelModalOpen} onClose={() => { setCancelModalOpen(false); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: 'error.main', color: '#fff', py: 1.5 }}>작성 취소</DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>작성을 취소하시겠습니까?</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>저장하지 않은 내용은 모두 사라집니다.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2.5, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={() => { setCancelModalOpen(false); }}>계속 작성</Button>
          <Button variant="contained" color="error" onClick={() => { setCancelModalOpen(false); }}>취소하기</Button>
        </DialogActions>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={previewOpen} onClose={() => { setPreviewOpen(false); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: '#fff', py: 1.5 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            결재 문서 미리보기
            <IconButton size="small" onClick={() => { setPreviewOpen(false); }} sx={{ color: '#fff' }}><XIcon size={18} /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>{previewContent}</DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button variant="outlined" color="inherit" onClick={() => { setPreviewOpen(false); }}>닫기</Button>
          <Button variant="contained" startIcon={<PrinterIcon />} onClick={onPrint}>인쇄</Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      {toast && (
        <Box sx={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, minWidth: 240 }}>
          <Alert severity={toast.type} sx={{ boxShadow: 4 }}>{toast.msg}</Alert>
        </Box>
      )}
    </Box>
  );
}
