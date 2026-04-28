'use client';

import * as React from 'react';
import * as XLSX from 'xlsx-js-style';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { FileArrowDown } from '@phosphor-icons/react/dist/ssr/FileArrowDown';
import { Paperclip } from '@phosphor-icons/react/dist/ssr/Paperclip';
import { PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { PrinterIcon } from '@phosphor-icons/react/dist/ssr/Printer';
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';

/* ========= 결재선 데이터 ========= */

type StepType = '기안' | '합의' | '결재' | '수신';
interface ApprovalStep { type: StepType; name: string; dept: string }
interface ApprovalLineOption {
  id: string;
  name: string;
  tag: string;
  desc: string;
  steps: ApprovalStep[];
}

const APPROVAL_LINES: ApprovalLineOption[] = [
  {
    id: 'standard',
    name: '표준형 (1억 미만)',
    tag: '표준',
    desc: '1억원 미만의 일반적인 광고선전비 집행 시 사용. 팀장 → 부서장 라인.',
    steps: [
      { type: '기안', name: '기안자', dept: '커머셜비용전략파트' },
      { type: '합의', name: '윤선영 팀장', dept: '커머셜비용전략팀' },
      { type: '결재', name: '소속 부서장', dept: '자동지정' },
      { type: '수신', name: '커머셜비용전략파트', dept: '삼양라운드스퀘어' },
    ],
  },
  {
    id: 'large',
    name: '고액형 (1억~5억)',
    tag: '고액',
    desc: '1억원 이상 5억원 미만 집행 시 사용. 재무팀 합의 및 본부장 결재 필수.',
    steps: [
      { type: '기안', name: '기안자', dept: '커머셜비용전략파트' },
      { type: '합의', name: '윤선영 팀장', dept: '커머셜비용전략팀' },
      { type: '합의', name: '재무팀장', dept: '재무팀' },
      { type: '결재', name: '본부장', dept: '커머셜본부' },
      { type: '수신', name: '커머셜비용전략파트', dept: '삼양라운드스퀘어' },
    ],
  },
  {
    id: 'mega',
    name: '대규모형 (5억 이상)',
    tag: '대규모',
    desc: '5억원 이상 대형 캠페인. CFO·대표이사 결재까지 진행.',
    steps: [
      { type: '기안', name: '기안자', dept: '커머셜비용전략파트' },
      { type: '합의', name: '윤선영 팀장', dept: '커머셜비용전략팀' },
      { type: '합의', name: '재무팀장', dept: '재무팀' },
      { type: '결재', name: '본부장', dept: '커머셜본부' },
      { type: '결재', name: 'CFO', dept: '재무본부' },
      { type: '결재', name: '대표이사', dept: '삼양식품(주)' },
      { type: '수신', name: '커머셜비용전략파트', dept: '삼양라운드스퀘어' },
    ],
  },
  {
    id: 'overseas',
    name: '해외법인형',
    tag: '해외',
    desc: '해외 법인 또는 현지 에이전시와의 계약이 포함된 경우.',
    steps: [
      { type: '기안', name: '기안자', dept: '커머셜비용전략파트' },
      { type: '합의', name: '글로벌마케팅팀장', dept: '글로벌마케팅팀' },
      { type: '합의', name: '재무팀장', dept: '재무팀' },
      { type: '결재', name: '글로벌본부장', dept: '글로벌본부' },
      { type: '수신', name: '커머셜비용전략파트', dept: '삼양라운드스퀘어' },
    ],
  },
];

const stepColorMap: Record<StepType, 'default' | 'info' | 'success' | 'secondary'> = {
  기안: 'default',
  합의: 'info',
  결재: 'success',
  수신: 'secondary',
};

/* ========= 예산 행 타입 ========= */

interface BudgetRow { id: number; item: string; detail: string; qty: string; price: string; amount: string; note: string }
interface AccountRow { id: number; month: string; cc: string; ccName: string; accCode: string; accName: string; budget: string; balance: string; amount: string }
interface TransferRow { id: number; type: string; month: string; cc: string; ccName: string; accCode: string; accName: string; budget: string; balance: string; transferAmt: string }

/* ========= 숫자 포맷 헬퍼 ========= */
const numFmt = (v: string) => {
  const digits = v.replace(/\D/g, '');
  return digits ? parseInt(digits, 10).toLocaleString('ko-KR') : '';
};
const monthFmt = (v: string) => v.replace(/\D/g, '').slice(0, 2);

/* ========= 서브 컴포넌트 ========= */

function SectionHeader({ num, title, required = false, action }: { num: React.ReactNode; title: string; required?: boolean; action?: React.ReactNode }) {
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

function FieldRow({ label, required, children, fieldRef }: { label: string; required?: boolean; children: React.ReactNode; fieldRef?: React.Ref<HTMLDivElement | null> }) {
  return (
    <Stack ref={fieldRef} direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'flex-start' }}>
      <Typography variant="caption" sx={{ width: 130, flexShrink: 0, pt: '9px', fontWeight: 500, color: 'text.secondary' }}>
        {label}{required && <Box component="span" sx={{ color: 'error.main', ml: 0.25 }}>*</Box>}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Stack>
  );
}

/* ========= 메인 컴포넌트 ========= */

export function ApprovalForm(): React.JSX.Element {
  const today = new Date().toISOString().slice(0, 10);

  // 결재선
  const [selectedLineId, setSelectedLineId] = React.useState('standard');
  const [pendingLineId, setPendingLineId] = React.useState('standard');
  const [lineModalOpen, setLineModalOpen] = React.useState(false);

  // 섹션 1: 품의 제목
  const [brand, setBrand] = React.useState('');
  const [projectName, setProjectName] = React.useState('');
  const [activity, setActivity] = React.useState('');

  // 섹션 2: 프로젝트 TYPE
  const [projectType, setProjectType] = React.useState('');

  // 섹션 3: 세부내역
  const [activityName, setActivityName] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [region, setRegion] = React.useState('');
  const [target, setTarget] = React.useState('');
  const [totalCost, setTotalCost] = React.useState('');

  // 섹션 4
  const [marketSituation, setMarketSituation] = React.useState('');
  const [mainGoal, setMainGoal] = React.useState('');

  // 섹션 5
  const [executionPlan, setExecutionPlan] = React.useState('');

  // 섹션 6: 세부 예산
  const [budgetRows, setBudgetRows] = React.useState<BudgetRow[]>([
    { id: 1, item: '제작비', detail: '', qty: '1', price: '', amount: '', note: '' },
    { id: 2, item: '매체비', detail: '', qty: '1', price: '', amount: '', note: '' },
  ]);
  const nextBudgetId = React.useRef(3);

  // 섹션 7
  const [bidYn, setBidYn] = React.useState('');
  const [bidReason, setBidReason] = React.useState('');
  const [bidSkipReason, setBidSkipReason] = React.useState('');

  // 섹션 8
  const [kpiItem, setKpiItem] = React.useState('');
  const [kpiBiz, setKpiBiz] = React.useState('');
  const [kpiBrand, setKpiBrand] = React.useState('');

  // 섹션 9
  const [payMethod, setPayMethod] = React.useState('');
  const [execRows, setExecRows] = React.useState<AccountRow[]>([
    { id: 1, month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', amount: '' },
  ]);
  const nextExecId = React.useRef(2);
  const [accountTransferRows, setAccountTransferRows] = React.useState<TransferRow[]>([
    { id: 1, type: '주는계정', month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', transferAmt: '' },
    { id: 2, type: '집행계정', month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', transferAmt: '' },
  ]);
  const nextAccountTransferId = React.useRef(3);
  const [deptTransferRows, setDeptTransferRows] = React.useState<TransferRow[]>([
    { id: 1, type: '주는계정', month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', transferAmt: '' },
    { id: 2, type: '집행계정', month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', transferAmt: '' },
  ]);
  const nextDeptTransferId = React.useRef(3);

  // 첨부파일
  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 필수 입력 필드 refs (validation 포커스용)
  const brandRef = React.useRef<HTMLDivElement>(null);
  const projectNameRef = React.useRef<HTMLDivElement>(null);
  const activityRef = React.useRef<HTMLDivElement>(null);
  const projectTypeRef = React.useRef<HTMLDivElement>(null);
  const activityNameRef = React.useRef<HTMLDivElement>(null);
  const dateFromRef = React.useRef<HTMLDivElement>(null);
  const regionRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef<HTMLDivElement>(null);
  const totalCostRef = React.useRef<HTMLDivElement>(null);
  const marketSituationRef = React.useRef<HTMLDivElement>(null);
  const mainGoalRef = React.useRef<HTMLDivElement>(null);
  const executionPlanRef = React.useRef<HTMLDivElement>(null);
  const bidYnRef = React.useRef<HTMLDivElement>(null);
  const bidReasonRef = React.useRef<HTMLDivElement>(null);
  const kpiItemRef = React.useRef<HTMLDivElement>(null);
  const kpiBizRef = React.useRef<HTMLDivElement>(null);
  const kpiBrandRef = React.useRef<HTMLDivElement>(null);
  const payMethodRef = React.useRef<HTMLDivElement>(null);
  // 첫 번째 에러 필드 저장 (Dialog 닫힌 후 포커스용)
  const firstErrorFieldRef = React.useRef<React.RefObject<HTMLDivElement | null> | null>(null);

  // 모달
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false);
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [validationOpen, setValidationOpen] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [lastSaved, setLastSaved] = React.useState('저장된 내역 없음');

  const currentLine = APPROVAL_LINES.find((l) => l.id === selectedLineId) ?? APPROVAL_LINES[0];

  /* ---- 유틸 ---- */
  function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
    setToast({ msg, type });
    setTimeout(() => { setToast(null); }, 3000);
  }

  function calcBudgetTotal() {
    return budgetRows.reduce((sum, r) => sum + (Number(r.amount.replace(/,/g, '')) || 0), 0);
  }

  function updateBudgetRow(id: number, field: keyof BudgetRow, value: string) {
    const val = (field === 'qty' || field === 'price') ? numFmt(value) : value;
    setBudgetRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: val };
      if (field === 'qty' || field === 'price') {
        const qty = Number((field === 'qty' ? val : r.qty).replace(/,/g, '')) || 0;
        const price = Number((field === 'price' ? val : r.price).replace(/,/g, '')) || 0;
        updated.amount = (qty * price).toLocaleString('ko-KR');
      }
      return updated;
    }));
  }

  function addBudgetRow() {
    setBudgetRows((prev) => [
      ...prev,
      { id: nextBudgetId.current++, item: '', detail: '', qty: '1', price: '', amount: '', note: '' },
    ]);
  }

  function removeBudgetRow(id: number) {
    setBudgetRows((prev) => prev.filter((r) => r.id !== id));
  }

  /* ---- 집행계정 행 관리 ---- */
  function updateExecRow(id: number, field: keyof AccountRow, value: string) {
    const numFields: (keyof AccountRow)[] = ['budget', 'balance', 'amount'];
    const val = field === 'month' ? monthFmt(value) : numFields.includes(field) ? numFmt(value) : value;
    setExecRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: val } : r));
  }
  function addExecRow() {
    setExecRows((prev) => [...prev, { id: nextExecId.current++, month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', amount: '' }]);
  }
  function removeExecRow(id: number) { setExecRows((prev) => prev.filter((r) => r.id !== id)); }

  /* ---- 전용 행 관리 ---- */
  function updateTransferRow(setter: React.Dispatch<React.SetStateAction<TransferRow[]>>, id: number, field: keyof TransferRow, value: string) {
    const numFields: (keyof TransferRow)[] = ['budget', 'balance', 'transferAmt'];
    const val = field === 'month' ? monthFmt(value) : numFields.includes(field) ? numFmt(value) : value;
    setter((prev) => prev.map((r) => r.id === id ? { ...r, [field]: val } : r));
  }
  function addTransferRow(setter: React.Dispatch<React.SetStateAction<TransferRow[]>>, nextId: React.MutableRefObject<number>) {
    setter((prev) => [...prev, { id: nextId.current++, type: '주는계정', month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', transferAmt: '' }]);
  }
  function removeTransferRow(setter: React.Dispatch<React.SetStateAction<TransferRow[]>>, id: number) {
    setter((prev) => prev.filter((r) => r.id !== id));
  }

  /* ---- 첨부파일 ---- */
  function handleFiles(files: FileList | null) {
    if (!files) return;
    setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
  }
  function removeFile(idx: number) { setAttachedFiles((prev) => prev.filter((_, i) => i !== idx)); }

  /* ---- 임시저장 ---- */
  function saveDraft() {
    const now = new Date().toLocaleString('ko-KR');
    setLastSaved(now);
    showToast('임시저장 완료');
  }

  /* ---- XLSX 다운로드 ---- */
  function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const fileTitle = brand || projectName
      ? `[${brand || '브랜드'}] [${projectName || '프로젝트명'}]${activity ? ` (${activity})` : ''}`
      : '광고선전비 사전품의';
    const toNum = (s: string) => { const n = parseFloat(s.replace(/,/g, '')); return isNaN(n) ? s : n; };
    const period = dateFrom || dateTo ? `${dateFrom}${dateTo ? ` ~ ${dateTo}` : ''}` : '';

    // ── Sheet 0: 품의서 (styled) ──
    // 7 columns A-G: A=label/No, B=value/항목, C=value/세부내역, D=value/수량, E=단가, F=금액, G=비고
    const LCOL = 6; // last column index (G)
    type CS = XLSX.CellStyle;

    // Border helpers (color is required in xlsx-js-style)
    const bThin = { style: 'thin' as const, color: { rgb: 'BFBFBF' } };
    const bMed  = { style: 'medium' as const, color: { rgb: '1A3A6E' } };
    const bAll: CS['border'] = { top: bThin, bottom: bThin, left: bThin, right: bThin };
    const bLeftAccent: CS['border'] = { top: bThin, bottom: bThin, left: bMed, right: bThin };

    const sTitle: CS = {
      font: { bold: true, sz: 15, name: '맑은 고딕' },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    const sSection: CS = {
      font: { bold: true, sz: 9, name: '맑은 고딕', color: { rgb: '1A3A6E' } },
      fill: { fgColor: { rgb: 'E8EDF5' }, patternType: 'solid' },
      border: bLeftAccent,
      alignment: { vertical: 'center' },
    };
    const sLabel: CS = {
      font: { bold: true, sz: 9, name: '맑은 고딕', color: { rgb: '495057' } },
      fill: { fgColor: { rgb: 'F1F3F5' }, patternType: 'solid' },
      border: bAll,
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    };
    const sValue: CS = {
      font: { sz: 9, name: '맑은 고딕' },
      border: bAll,
      alignment: { vertical: 'top', wrapText: true },
    };
    const sBudgetHead: CS = {
      font: { bold: true, sz: 9, name: '맑은 고딕', color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1A3A6E' }, patternType: 'solid' },
      border: { top: bThin, bottom: bThin, left: bThin, right: bThin },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    const sBudgetData: CS = {
      font: { sz: 9, name: '맑은 고딕' },
      border: bAll,
      alignment: { vertical: 'center' },
    };
    const sBudgetTotalLabel: CS = {
      font: { bold: true, sz: 9, name: '맑은 고딕' },
      fill: { fgColor: { rgb: 'F0F4FA' }, patternType: 'solid' },
      border: { top: bMed, bottom: bMed, left: bThin, right: bThin },
      alignment: { horizontal: 'right', vertical: 'center' },
    };
    const sBudgetTotalVal: CS = {
      font: { bold: true, sz: 10, name: '맑은 고딕', color: { rgb: '1A3A6E' } },
      fill: { fgColor: { rgb: 'F0F4FA' }, patternType: 'solid' },
      border: { top: bMed, bottom: bMed, left: bThin, right: bThin },
      alignment: { horizontal: 'right', vertical: 'center' },
    };

    const ws0: XLSX.WorkSheet = {};
    const merges: XLSX.Range[] = [];
    const rowH: { hpt: number }[] = [];
    let r0 = 0;

    function sc(row: number, col: number, v: string | number, s: CS) {
      const addr = XLSX.utils.encode_cell({ r: row, c: col });
      ws0[addr] = { v, t: typeof v === 'number' ? 'n' : 's', s };
    }
    function mr(r1: number, c1: number, r2: number, c2: number) {
      merges.push({ s: { r: r1, c: c1 }, e: { r: r2, c: c2 } });
    }
    function emptyR(h: number) { rowH[r0] = { hpt: h }; r0++; }

    function sectionRow(title: string) {
      sc(r0, 0, title, sSection);
      mr(r0, 0, r0, LCOL);
      rowH[r0] = { hpt: 22 }; r0++;
    }
    function labelValRow(label: string, val: string, h = 20) {
      sc(r0, 0, label, sLabel);
      sc(r0, 1, val, sValue);
      mr(r0, 1, r0, LCOL);
      rowH[r0] = { hpt: h }; r0++;
    }

    // Title
    sc(r0, 0, '광  고  선  전  비  사  전  품  의', sTitle);
    mr(r0, 0, r0, LCOL);
    rowH[r0] = { hpt: 38 }; r0++;
    emptyR(6);

    // Info table
    sc(r0, 0, '작성일', sLabel);
    sc(r0, 1, today, sValue); mr(r0, 1, r0, 2);
    sc(r0, 3, '기안자', sLabel);
    sc(r0, 4, '기안자', sValue); mr(r0, 4, r0, LCOL);
    rowH[r0] = { hpt: 20 }; r0++;

    sc(r0, 0, '소속', sLabel);
    sc(r0, 1, '커머셜비용전략파트', sValue); mr(r0, 1, r0, LCOL);
    rowH[r0] = { hpt: 20 }; r0++;

    sc(r0, 0, '결재선', sLabel);
    const lineText = `${currentLine.name}  ·  ${currentLine.steps.map((s) => `${s.type}(${s.name})`).join(' → ')}`;
    sc(r0, 1, lineText, { ...sValue, font: { sz: 8, name: '맑은 고딕' } }); mr(r0, 1, r0, LCOL);
    rowH[r0] = { hpt: 20 }; r0++;
    emptyR(8);

    // 1. 품의 제목
    sectionRow('1. 품의 제목');
    const titleVal = brand && projectName ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}` : '';
    sc(r0, 0, titleVal, { font: { bold: true, sz: 11, name: '맑은 고딕' }, alignment: { vertical: 'center' } });
    mr(r0, 0, r0, LCOL);
    rowH[r0] = { hpt: 26 }; r0++;
    emptyR(6);

    // 2. 프로젝트 TYPE
    sectionRow('2. 프로젝트 TYPE');
    labelValRow('TYPE', projectType);
    emptyR(6);

    // 3. 세부내역
    sectionRow('3. 세부내역');
    labelValRow('활동명', activityName);
    labelValRow('기간', period);
    labelValRow('대상 국가/지역', region);
    labelValRow('주요 타겟', target);
    labelValRow('총 사용 비용', totalCost ? `${totalCost} 원 (VAT 별도)` : '');
    emptyR(6);

    // 4. 목적 및 배경
    sectionRow('4. 목적 및 배경');
    labelValRow('시장 및 경쟁 현황', marketSituation, 52);
    labelValRow('주요 목표', mainGoal, 52);
    emptyR(6);

    // 5. 주요 실행 방안
    sectionRow('5. 주요 실행 방안');
    labelValRow('실행 방안', executionPlan, 64);
    emptyR(6);

    // 6. 세부 예산 내역
    sectionRow('6. 세부 예산 내역');
    const bHeaders = ['No', '항목', '세부내역', '수량', '단가 (원)', '금액 (원)', '비고'];
    for (let c = 0; c <= LCOL; c++) sc(r0, c, bHeaders[c], sBudgetHead);
    rowH[r0] = { hpt: 22 }; r0++;

    budgetRows.forEach((bRow, i) => {
      sc(r0, 0, i + 1,              { ...sBudgetData, alignment: { horizontal: 'center', vertical: 'center' } });
      sc(r0, 1, bRow.item || '',    sBudgetData);
      sc(r0, 2, bRow.detail || '',  sBudgetData);
      sc(r0, 3, toNum(bRow.qty),    { ...sBudgetData, alignment: { horizontal: 'right', vertical: 'center' } });
      sc(r0, 4, toNum(bRow.price),  { ...sBudgetData, alignment: { horizontal: 'right', vertical: 'center' } });
      sc(r0, 5, toNum(bRow.amount), { ...sBudgetData, alignment: { horizontal: 'right', vertical: 'center' } });
      sc(r0, 6, bRow.note || '',    sBudgetData);
      rowH[r0] = { hpt: 18 }; r0++;
    });
    const grandTotal = calcBudgetTotal();
    sc(r0, 0, '',          sBudgetTotalLabel); mr(r0, 0, r0, 4);
    sc(r0, 4, '합계 (원)',  sBudgetTotalLabel);
    sc(r0, 5, grandTotal,  sBudgetTotalVal);
    sc(r0, 6, '',          sBudgetTotalLabel);
    rowH[r0] = { hpt: 22 }; r0++;
    emptyR(6);

    // 7. 업체 비딩
    sectionRow('7. 업체 비딩 내역');
    labelValRow('비딩 진행여부', bidYn);
    labelValRow('최종 업체 선정 사유', bidReason, 40);
    labelValRow('비딩 생략 근거', bidSkipReason, 40);
    emptyR(6);

    // 8. 기대효과 및 KPI
    sectionRow('8. 기대효과 및 KPI');
    labelValRow('항목별 기대효과', kpiItem, 40);
    labelValRow('비즈니스 기대효과', kpiBiz, 40);
    labelValRow('브랜드 기대효과', kpiBrand, 40);

    ws0['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r0, c: LCOL } });
    ws0['!merges'] = merges;
    ws0['!rows'] = rowH;
    ws0['!cols'] = [
      { wch: 18 }, // A labels / No
      { wch: 14 }, // B values / 항목
      { wch: 24 }, // C values / 세부내역
      { wch: 9 },  // D values / 수량
      { wch: 15 }, // E 단가
      { wch: 15 }, // F 금액
      { wch: 18 }, // G 비고
    ];
    XLSX.utils.book_append_sheet(wb, ws0, '품의서');

    // ── Sheet 1: 품의 기본정보 ──
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['광고선전비 사전품의', null],
      [],
      ['▸ 기본 정보', null],
      ['브랜드', brand],
      ['프로젝트명', projectName],
      ['Activity 내역', activity],
      ['프로젝트 TYPE', projectType],
      ['활동명', activityName],
      ['기간', period],
      ['대상 국가/지역', region],
      ['주요 타겟', target],
      ['총 사용 비용 (원, VAT 별도)', totalCost ? toNum(totalCost) : ''],
      [],
      ['▸ 목적 및 배경', null],
      ['시장 및 경쟁 현황', marketSituation],
      ['주요 목표', mainGoal],
      [],
      ['▸ 주요 실행 방안', null],
      ['실행 방안', executionPlan],
      [],
      ['▸ 업체 비딩', null],
      ['비딩 진행여부', bidYn],
      ['최종 업체 선정 사유', bidReason],
      ['비딩 생략 근거', bidSkipReason],
      [],
      ['▸ 기대효과 및 KPI', null],
      ['항목별 기대효과', kpiItem],
      ['비즈니스 기대효과', kpiBiz],
      ['브랜드 기대효과', kpiBrand],
    ]);
    ws1['!cols'] = [{ wch: 26 }, { wch: 72 }];
    ws1['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
      { s: { r: 13, c: 0 }, e: { r: 13, c: 1 } },
      { s: { r: 17, c: 0 }, e: { r: 17, c: 1 } },
      { s: { r: 20, c: 0 }, e: { r: 20, c: 1 } },
      { s: { r: 25, c: 0 }, e: { r: 25, c: 1 } },
    ];
    XLSX.utils.book_append_sheet(wb, ws1, '품의 기본정보');

    // ── Sheet 2: 세부 예산 내역 ──
    const total = calcBudgetTotal();
    const ws2 = XLSX.utils.aoa_to_sheet([
      ['No', '항목', '세부내역', '수량', '단가 (원)', '금액 (원)', '비고'],
      ...budgetRows.map((bRow, i) => [
        i + 1, bRow.item, bRow.detail,
        toNum(bRow.qty), toNum(bRow.price), toNum(bRow.amount), bRow.note,
      ]),
      [],
      ['', '', '', '', '합계 (원)', total, ''],
    ]);
    ws2['!cols'] = [
      { wch: 5 }, { wch: 18 }, { wch: 32 }, { wch: 8 }, { wch: 16 }, { wch: 16 }, { wch: 22 },
    ];
    XLSX.utils.book_append_sheet(wb, ws2, '세부 예산 내역');

    // ── Sheet 3: 예산 사용 계획 ──
    const ws3 = XLSX.utils.aoa_to_sheet([
      ['비용 지급 방식', payMethod, null, null, null, null, null, null, null],
      [],
      ['구분', '월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액 (원)', '현재잔액 (원)', '집행금액 (원)'],
      ...execRows.map((eRow) => [
        '집행계정', eRow.month, eRow.cc, eRow.ccName, eRow.accCode, eRow.accName,
        toNum(eRow.budget), toNum(eRow.balance), toNum(eRow.amount),
      ]),
    ]);
    ws3['!cols'] = [
      { wch: 10 }, { wch: 8 }, { wch: 14 }, { wch: 22 },
      { wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 16 },
    ];
    XLSX.utils.book_append_sheet(wb, ws3, '예산 사용 계획');

    XLSX.writeFile(wb, `${fileTitle}_${today}.xlsx`);
    showToast('Excel 파일 다운로드 완료');
  }

  /* ---- 결재 상신 클릭: 검증 후 모달 ---- */
  function handleSubmitClick() {
    type FieldDef = { label: string; isEmpty: boolean; ref: React.RefObject<HTMLDivElement | null> };
    const fields: FieldDef[] = [
      { label: '1. 브랜드',              isEmpty: !brand,           ref: brandRef },
      { label: '1. 프로젝트명',           isEmpty: !projectName,     ref: projectNameRef },
      { label: '1. Activity 내역',        isEmpty: !activity,        ref: activityRef },
      { label: '2. 프로젝트 TYPE',        isEmpty: !projectType,     ref: projectTypeRef },
      { label: '3. 활동명',               isEmpty: !activityName,    ref: activityNameRef },
      { label: '3. 기간 (시작일 ~ 종료일)', isEmpty: !dateFrom || !dateTo, ref: dateFromRef },
      { label: '3. 대상 국가/지역',        isEmpty: !region,          ref: regionRef },
      { label: '3. 주요 타겟',            isEmpty: !target,          ref: targetRef },
      { label: '3. 총 사용 비용',          isEmpty: !totalCost,       ref: totalCostRef },
      { label: '4. 시장 및 경쟁 현황',     isEmpty: !marketSituation, ref: marketSituationRef },
      { label: '4. 주요 목표',            isEmpty: !mainGoal,        ref: mainGoalRef },
      { label: '5. 주요 실행 방안',        isEmpty: !executionPlan,   ref: executionPlanRef },
      { label: '7. 비딩 진행여부',         isEmpty: !bidYn,           ref: bidYnRef },
      { label: '7. 최종 업체 선정 사유',   isEmpty: !bidReason,       ref: bidReasonRef },
      { label: '8. 항목별 기대효과',       isEmpty: !kpiItem,         ref: kpiItemRef },
      { label: '8. 비즈니스 기대효과',     isEmpty: !kpiBiz,          ref: kpiBizRef },
      { label: '8. 브랜드 기대효과',       isEmpty: !kpiBrand,        ref: kpiBrandRef },
      { label: '9. 비용 지급 방식',        isEmpty: !payMethod,       ref: payMethodRef },
    ];

    const missing = fields.filter((f) => f.isEmpty);

    if (missing.length > 0) {
      firstErrorFieldRef.current = missing[0].ref;
      setValidationErrors(missing.map((f) => f.label));
      setValidationOpen(true);
      return;
    }

    setValidationErrors([]);
    setSubmitModalOpen(true);
  }

  /* ---- validation dialog 닫기 + 첫 에러 필드 포커스 ---- */
  function closeValidationDialog() {
    setValidationOpen(false);
    const target = firstErrorFieldRef.current;
    if (!target) return;
    // Dialog 닫히는 애니메이션이 끝난 후 스크롤 + 포커스
    setTimeout(() => {
      target.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        target.current
          ?.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, [role="combobox"]')
          ?.focus();
      }, 300);
    }, 150);
  }

  /* ---- 결재 상신 확정 ---- */
  function confirmSubmit() {
    setSubmitModalOpen(false);
    showToast('결재 상신이 완료되었습니다.', 'success');
  }

  /* ---- 미리보기 인쇄 ---- */
  function printPreviewContent() {
    const title = brand && projectName
      ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}`
      : '(제목 미입력)';
    const budgetTotal = calcBudgetTotal();
    const lineSteps = currentLine.steps.map((s) => `${s.type}(${s.name})`).join(' → ');
    const v = (val: string, fallback = '(미입력)') => val || `<span style="color:#adb5bd;font-style:italic">${fallback}</span>`;

    const budgetRowsHtml = budgetRows.map((r, i) => `
      <tr>
        <td style="text-align:center;color:#6c757d">${i + 1}</td>
        <td>${r.item || '-'}</td>
        <td>${r.detail || '-'}</td>
        <td style="text-align:right">${r.qty || '-'}</td>
        <td style="text-align:right">${r.price || '-'}</td>
        <td style="text-align:right">${r.amount || '-'}</td>
        <td>${r.note || '-'}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<title>광고선전비 사전품의</title>
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Malgun Gothic","맑은 고딕","Apple SD Gothic Neo",sans-serif; font-size: 12px; line-height: 1.7; color: #212529; }
  h1 { text-align: center; font-size: 17px; font-weight: 700; letter-spacing: 0.35em; padding-bottom: 10px; margin-bottom: 18px; border-bottom: 3px double #212529; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  th, td { border: 1px solid #adb5bd; padding: 5px 10px; font-size: 11px; }
  th { background: #f1f3f5; font-weight: 600; white-space: nowrap; }
  .section { margin-bottom: 18px; break-inside: avoid; }
  .section-title { font-size: 12px; font-weight: 700; border-left: 3px solid #1a3a6e; padding-left: 8px; color: #212529; margin-bottom: 8px; }
  .row { display: flex; gap: 8px; margin-bottom: 4px; padding-left: 8px; }
  .row-label { color: #6c757d; min-width: 100px; flex-shrink: 0; }
  .sub-label { font-size: 11px; font-weight: 600; padding-left: 8px; margin-top: 10px; margin-bottom: 4px; display: block; }
  .val { padding-left: 8px; white-space: pre-wrap; }
  .budget-head th { background: #1a3a6e; color: #fff; font-weight: 500; }
  .budget-total td { background: #f8f9fa; font-weight: 600; }
  .budget-total .amount { font-weight: 700; color: #1a3a6e; }
  .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #dee2e6; text-align: right; font-size: 10px; color: #adb5bd; }
</style>
</head>
<body>
<h1>광 고 선 전 비 사 전 품 의</h1>

<table>
  <tbody>
    <tr>
      <th style="width:60px">작성일</th><td colspan="3">${today}</td>
    </tr>
    <tr>
      <th>기안자</th><td>기안자</td>
      <th>소속</th><td>커머셜비용전략파트</td>
    </tr>
    <tr>
      <th>결재선</th>
      <td colspan="3" style="font-size:10px">${currentLine.name} &nbsp;·&nbsp; ${lineSteps}</td>
    </tr>
  </tbody>
</table>

<div class="section">
  <div class="section-title">1. 품의 제목</div>
  <div class="val">${brand && projectName ? title : '<span style="color:#adb5bd;font-style:italic">(미입력)</span>'}</div>
</div>

<div class="section">
  <div class="section-title">2. 프로젝트 TYPE</div>
  <div class="val">${v(projectType)}</div>
</div>

<div class="section">
  <div class="section-title">3. 세부내역</div>
  ${activityName ? `<div class="row"><span class="row-label">· 활동명</span><span>${activityName}</span></div>` : ''}
  ${(dateFrom || dateTo) ? `<div class="row"><span class="row-label">· 기간</span><span>${dateFrom}${dateTo ? ` ~ ${dateTo}` : ''}</span></div>` : ''}
  ${region ? `<div class="row"><span class="row-label">· 대상 국가/지역</span><span>${region}</span></div>` : ''}
  ${target ? `<div class="row"><span class="row-label">· 주요 타겟</span><span>${target}</span></div>` : ''}
  ${totalCost ? `<div class="row"><span class="row-label">· 총 사용 비용</span><span>${totalCost} 원 (VAT 별도)</span></div>` : ''}
</div>

<div class="section">
  <div class="section-title">4. 목적 및 배경</div>
  ${marketSituation ? `<span class="sub-label">시장 및 경쟁 현황</span><div class="val">${marketSituation}</div>` : ''}
  ${mainGoal ? `<span class="sub-label">주요 목표</span><div class="val">${mainGoal}</div>` : ''}
</div>

<div class="section">
  <div class="section-title">5. 주요 실행 방안</div>
  <div class="val">${v(executionPlan)}</div>
</div>

<div class="section">
  <div class="section-title">6. 세부 예산 내역</div>
  <table>
    <thead class="budget-head">
      <tr><th>No</th><th>항목</th><th>세부내역</th><th>수량</th><th>단가(원)</th><th>금액(원)</th><th>비고</th></tr>
    </thead>
    <tbody>
      ${budgetRowsHtml}
      <tr class="budget-total">
        <td colspan="5" style="text-align:right">합계</td>
        <td class="amount" style="text-align:right">${budgetTotal.toLocaleString()} 원</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="section">
  <div class="section-title">7. 업체 비딩 내역</div>
  ${bidYn ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">비딩 진행여부</span><div class="val">${bidYn}</div></div>` : ''}
  ${bidReason ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">최종 업체 선정 사유</span><div class="val">${bidReason}</div></div>` : ''}
  ${bidSkipReason ? `<div style="padding-left:8px"><span style="font-size:11px;font-weight:600">비딩 생략 근거</span><div class="val">${bidSkipReason}</div></div>` : ''}
</div>

<div class="section">
  <div class="section-title">8. 기대효과 및 KPI</div>
  ${kpiItem ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">항목별 기대효과</span><div class="val">${kpiItem}</div></div>` : ''}
  ${kpiBiz ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">비즈니스 기대효과</span><div class="val">${kpiBiz}</div></div>` : ''}
  ${kpiBrand ? `<div style="padding-left:8px"><span style="font-size:11px;font-weight:600">브랜드 기대효과</span><div class="val">${kpiBrand}</div></div>` : ''}
</div>

<div class="footer">삼양식품(주) / 커머셜비용전략파트</div>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) { document.body.removeChild(iframe); return; }
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 500);
    }, 400);
  }

  const docTitle = brand || projectName || activity
    ? `${brand ? `[${brand}]` : '[브랜드]'} ${projectName ? `[${projectName}]` : '[프로젝트명]'}${activity ? ` (${activity})` : ''}`
    : '';

  return (
    <Box sx={{ pb: 8 }}>
      {/* ========= 브레드크럼 ========= */}
      <Stack className="print-hide" direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          전자결재 &rsaquo; 기안하기 &rsaquo; 마케팅 &rsaquo; <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>광고선전비 사전품의</Box>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', bgcolor: 'grey.100', px: 1.5, py: 0.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          문서번호 : <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>상신 후 자동 부여</Box>
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        {/* ========= 문서 타이틀 ========= */}
        <Stack
          direction="row"
          sx={{
            px: 3, py: 2.5,
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Chip label="기안" size="small" sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 700, borderRadius: '3px' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>광고선전비 사전품의</Typography>
            <Chip label="● 작성중" size="small" sx={{ bgcolor: '#fff3bf', color: '#846200' }} />
            <Chip label="대외비" size="small" sx={{ bgcolor: '#e7f5ff', color: '#1971c2' }} />
          </Stack>
          <Stack className="print-hide" direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<FileArrowDown />}
              onClick={downloadExcel}
              sx={{ bgcolor: '#2b8a3e', '&:hover': { bgcolor: '#237032' } }}
            >
              Excel 다운로드
            </Button>
            <Button size="small" variant="outlined" startIcon={<PrinterIcon />} onClick={printPreviewContent}>
              인쇄
            </Button>
          </Stack>
        </Stack>

        {/* ========= 결재선 ========= */}
        <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 3, height: 14, bgcolor: 'primary.main', borderRadius: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>결재선</Typography>
              <Typography variant="caption" sx={{ color: 'info.main' }}>({currentLine.name})</Typography>
            </Stack>
            <Button className="print-hide" size="small" variant="outlined" startIcon={<PencilIcon />} onClick={() => { setPendingLineId(selectedLineId); setLineModalOpen(true); }}>
              결재선 변경
            </Button>
          </Stack>
          <Stack direction="row" spacing={0} sx={{ alignItems: 'stretch', flexWrap: 'wrap', gap: 1 }}>
            {currentLine.steps.map((step, idx) => (
              <Stack key={idx} direction="row" sx={{ alignItems: 'center' }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    minWidth: 110,
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

        {/* ========= 작성자 정보 ========= */}
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
                <TableCell sx={{ fontSize: '0.75rem' }}>광고선전비 사전품의</TableCell>
                <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, fontSize: '0.75rem' }}>보존년한</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>5년</TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* ========= 폼 본문 ========= */}
        <Box sx={{ p: 3 }}>
          <Alert severity="info" sx={{ mb: 2.5, fontSize: '0.75rem' }}>
            본 양식은 광고선전비 집행 전 반드시 작성해야 하며, 모든 필수 항목(<Box component="span" sx={{ color: 'error.main' }}>*</Box>)을 입력해야 결재 상신이 가능합니다.
          </Alert>

          <Stack spacing={2.5}>
            {/* ---- 1. 품의 제목 ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={1} title="품의 제목" required />
              <Box sx={{ p: 2 }}>
                <FieldRow label="브랜드" required fieldRef={brandRef}>
                  <Select size="small" fullWidth value={brand} onChange={(e) => { setBrand(e.target.value); }} displayEmpty>
                    <MenuItem value=""><em>브랜드 선택</em></MenuItem>
                    {['불닭', '삼양라면', '맛있는라면', '짜짜로니'].map((b) => (
                      <MenuItem key={b} value={b}>{b}</MenuItem>
                    ))}
                  </Select>
                </FieldRow>
                <FieldRow label="프로젝트명" required fieldRef={projectNameRef}>
                  <TextField size="small" fullWidth placeholder="예: 2026 글로벌 캠페인" value={projectName} onChange={(e) => { setProjectName(e.target.value); }} />
                </FieldRow>
                <FieldRow label="Activity 내역" required fieldRef={activityRef}>
                  <TextField size="small" fullWidth placeholder="예: TV CF 제작 및 매체 집행" value={activity} onChange={(e) => { setActivity(e.target.value); }} />
                  <Typography variant="caption" sx={{ color: docTitle ? 'text.secondary' : 'text.disabled', mt: 0.5, display: 'block' }}>
                    자동완성 제목: {docTitle || '[브랜드] [프로젝트명] (Activity 내역)'}
                  </Typography>
                </FieldRow>
              </Box>
            </Paper>

            {/* ---- 2. 프로젝트 TYPE ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={2} title="프로젝트 TYPE" required />
              <Box ref={projectTypeRef} sx={{ p: 2 }}>
                <RadioGroup row value={projectType} onChange={(e) => { setProjectType(e.target.value); }}>
                  {['브랜드 인지도 관리', '신제품 런칭', '브랜드 런칭', '기타'].map((v) => (
                    <FormControlLabel key={v} value={v} control={<Radio size="small" />} label={<Typography variant="body2">{v}</Typography>} />
                  ))}
                </RadioGroup>
              </Box>
            </Paper>

            {/* ---- 3. 세부내역 ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={3} title="세부내역" required />
              <Box sx={{ p: 2 }}>
                <FieldRow label="활동명" required fieldRef={activityNameRef}>
                  <TextField size="small" fullWidth placeholder="활동의 간략한 명칭" value={activityName} onChange={(e) => { setActivityName(e.target.value); }} />
                </FieldRow>
                <FieldRow label="기간" required fieldRef={dateFromRef}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <TextField size="small" type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); }} />
                    <Typography variant="body2">~</Typography>
                    <TextField size="small" type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); }} />
                  </Stack>
                </FieldRow>
                <FieldRow label="대상 국가/지역" required fieldRef={regionRef}>
                  <TextField size="small" fullWidth placeholder="예: 미국, 동남아 5개국, 국내 수도권" value={region} onChange={(e) => { setRegion(e.target.value); }} />
                </FieldRow>
                <FieldRow label="주요 타겟" required fieldRef={targetRef}>
                  <TextField size="small" fullWidth placeholder="예: 20-30대 여성, 1인 가구" value={target} onChange={(e) => { setTarget(e.target.value); }} />
                </FieldRow>
                <FieldRow label="총 사용 비용" required fieldRef={totalCostRef}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <TextField size="small" placeholder="0" sx={{ maxWidth: 200 }} inputProps={{ style: { textAlign: 'right' } }} value={totalCost} onChange={(e) => { setTotalCost(numFmt(e.target.value)); }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>원 (VAT 별도)</Typography>
                  </Stack>
                </FieldRow>
              </Box>
            </Paper>

            {/* ---- 4. 목적 및 배경 ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={4} title="목적 및 배경" required />
              <Box sx={{ p: 2 }}>
                <FieldRow label="시장 및 경쟁 현황" required fieldRef={marketSituationRef}>
                  <TextField size="small" fullWidth multiline minRows={3} placeholder="시장 동향, 경쟁사 활동, 자사 포지션 등을 작성해주세요." value={marketSituation} onChange={(e) => { setMarketSituation(e.target.value); }} />
                </FieldRow>
                <FieldRow label="주요 목표" required fieldRef={mainGoalRef}>
                  <TextField size="small" fullWidth multiline minRows={2} placeholder="본 프로젝트를 통해 달성하고자 하는 목표를 구체적으로 작성해주세요." value={mainGoal} onChange={(e) => { setMainGoal(e.target.value); }} />
                </FieldRow>
              </Box>
            </Paper>

            {/* ---- 5. 주요 실행 방안 ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={5} title="주요 실행 방안" required />
              <Box ref={executionPlanRef} sx={{ p: 2 }}>
                <TextField size="small" fullWidth multiline minRows={4} placeholder="채널 전략, 크리에이티브 방향, 미디어 플랜 등 실행 계획을 상세히 작성해주세요." value={executionPlan} onChange={(e) => { setExecutionPlan(e.target.value); }} />
              </Box>
            </Paper>

            {/* ---- 6. 세부 예산 내역 ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader
                num={6}
                title="세부 예산 내역"
                required
                action={
                  <Button size="small" variant="contained" startIcon={<Plus />} onClick={addBudgetRow} sx={{ height: 28 }}>
                    항목 추가
                  </Button>
                }
              />
              <Box sx={{ p: 2, overflowX: 'auto' }}>
                <Table size="small" sx={{ border: '1px solid', borderColor: 'divider', minWidth: 780 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      {['No', '항목', '세부내역', '수량', '단가(원)', '금액(원)', '비고', ''].map((h) => (
                        <TableCell key={h} sx={{ color: '#fff', fontWeight: 500, fontSize: '0.7rem', whiteSpace: 'nowrap', py: 1 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {budgetRows.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.75rem', width: 40 }}>{idx + 1}</TableCell>
                        <TableCell><TextField size="small" variant="standard" fullWidth value={row.item} onChange={(e) => { updateBudgetRow(row.id, 'item', e.target.value); }} /></TableCell>
                        <TableCell><TextField size="small" variant="standard" fullWidth value={row.detail} onChange={(e) => { updateBudgetRow(row.id, 'detail', e.target.value); }} /></TableCell>
                        <TableCell sx={{ width: 70 }}><TextField size="small" variant="standard" fullWidth inputProps={{ style: { textAlign: 'right' } }} value={row.qty} onChange={(e) => { updateBudgetRow(row.id, 'qty', e.target.value); }} /></TableCell>
                        <TableCell sx={{ width: 110 }}><TextField size="small" variant="standard" fullWidth inputProps={{ style: { textAlign: 'right' } }} value={row.price} onChange={(e) => { updateBudgetRow(row.id, 'price', e.target.value); }} /></TableCell>
                        <TableCell sx={{ width: 120 }}><TextField size="small" variant="standard" fullWidth inputProps={{ style: { textAlign: 'right' } }} value={row.amount} slotProps={{ input: { readOnly: true } }} /></TableCell>
                        <TableCell><TextField size="small" variant="standard" fullWidth value={row.note} onChange={(e) => { updateBudgetRow(row.id, 'note', e.target.value); }} /></TableCell>
                        <TableCell sx={{ width: 40 }}>
                          <IconButton size="small" onClick={() => { removeBudgetRow(row.id); }}><Trash size={14} /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell colSpan={5} sx={{ textAlign: 'right', fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>합계</TableCell>
                      <TableCell sx={{ textAlign: 'right', fontWeight: 700, color: 'primary.main', fontSize: '0.8rem' }}>
                        {calcBudgetTotal().toLocaleString()} 원
                      </TableCell>
                      <TableCell colSpan={2} />
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Paper>

            {/* ---- 7. 업체 비딩 내역 ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={7} title="업체 비딩 내역" required />
              <Box sx={{ p: 2 }}>
                <FieldRow label="비딩 진행여부" required fieldRef={bidYnRef}>
                  <RadioGroup row value={bidYn} onChange={(e) => { setBidYn(e.target.value); }}>
                    <FormControlLabel value="비딩 진행" control={<Radio size="small" />} label={<Typography variant="body2">비딩 진행</Typography>} />
                    <FormControlLabel value="비딩 생략" control={<Radio size="small" />} label={<Typography variant="body2">비딩 생략</Typography>} />
                  </RadioGroup>
                </FieldRow>
                <FieldRow label="최종 업체 선정 사유" required fieldRef={bidReasonRef}>
                  <TextField size="small" fullWidth multiline minRows={2} placeholder="선정 업체명, 비딩 참여 업체 비교, 선정 사유 등" value={bidReason} onChange={(e) => { setBidReason(e.target.value); }} />
                </FieldRow>
                <FieldRow label="비딩 생략 근거">
                  <TextField size="small" fullWidth multiline minRows={2} placeholder="비딩을 생략한 경우 근거를 작성해주세요. (예: 단독 보유 IP, 긴급 집행 등)" value={bidSkipReason} onChange={(e) => { setBidSkipReason(e.target.value); }} />
                </FieldRow>
              </Box>
            </Paper>

            {/* ---- 8. 기대효과 및 KPI ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={8} title="기대효과 및 KPI" required />
              <Box sx={{ p: 2 }}>
                <FieldRow label="항목별 기대효과" required fieldRef={kpiItemRef}>
                  <TextField size="small" fullWidth multiline minRows={2} placeholder="예: 임프레션 1억 회, CTR 2.5% 이상, 인게이지먼트율 3% 등" value={kpiItem} onChange={(e) => { setKpiItem(e.target.value); }} />
                </FieldRow>
                <FieldRow label="비즈니스 기대효과" required fieldRef={kpiBizRef}>
                  <TextField size="small" fullWidth multiline minRows={2} placeholder="매출 증대, 신규 고객 유치, 시장 점유율 변화 등 정량적 효과" value={kpiBiz} onChange={(e) => { setKpiBiz(e.target.value); }} />
                </FieldRow>
                <FieldRow label="브랜드 기대효과" required fieldRef={kpiBrandRef}>
                  <TextField size="small" fullWidth multiline minRows={2} placeholder="브랜드 인지도, 선호도, 호감도 등 정성적 효과" value={kpiBrand} onChange={(e) => { setKpiBrand(e.target.value); }} />
                </FieldRow>
              </Box>
            </Paper>

            {/* ---- 9. 예산 사용 계획 및 전용 계획 ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={9} title="예산 사용 계획 및 전용 계획" required />
              <Box sx={{ p: 2 }}>
                <FieldRow label="비용 지급 방식" required fieldRef={payMethodRef}>
                  <RadioGroup row value={payMethod} onChange={(e) => { setPayMethod(e.target.value); }}>
                    {['월별 지급', '선수금 지급', '선수-중도-잔액 분할지급', '일시 지급', '기타'].map((v) => (
                      <FormControlLabel key={v} value={v} control={<Radio size="small" />} label={<Typography variant="body2">{v}</Typography>} />
                    ))}
                  </RadioGroup>
                </FieldRow>

                {/* 집행계정 */}
                <BudgetCaption title="집행계정" />
                <AccountTable
                  rows={execRows}
                  columns={['월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액', '현재잔액', '집행금액']}
                  fields={['month', 'cc', 'ccName', 'accCode', 'accName', 'budget', 'balance', 'amount'] as (keyof AccountRow)[]}
                  onUpdate={(id, field, val) => { updateExecRow(id, field, val); }}
                  onRemove={removeExecRow}
                />
                <Button size="small" variant="outlined" startIcon={<Plus />} onClick={addExecRow} sx={{ mt: 1 }}>집행계정 행 추가</Button>

                {/* 계정간 전용 */}
                <BudgetCaption title="계정간 전용" />
                <TransferTable
                  rows={accountTransferRows}
                  onUpdate={(id, field, val) => { updateTransferRow(setAccountTransferRows, id, field, val); }}
                  onRemove={(id) => { removeTransferRow(setAccountTransferRows, id); }}
                />
                <Button size="small" variant="outlined" startIcon={<Plus />} onClick={() => { addTransferRow(setAccountTransferRows, nextAccountTransferId); }} sx={{ mt: 1 }}>계정간 전용 행 추가</Button>

                {/* 부서간 전용 */}
                <BudgetCaption title="부서간 전용" />
                <TransferTable
                  rows={deptTransferRows}
                  onUpdate={(id, field, val) => { updateTransferRow(setDeptTransferRows, id, field, val); }}
                  onRemove={(id) => { removeTransferRow(setDeptTransferRows, id); }}
                />
                <Button size="small" variant="outlined" startIcon={<Plus />} onClick={() => { addTransferRow(setDeptTransferRows, nextDeptTransferId); }} sx={{ mt: 1 }}>부서간 전용 행 추가</Button>
              </Box>
            </Paper>

            {/* ---- 첨부파일 ---- */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <SectionHeader num={<Paperclip size={13} />} title="첨부파일" />
              <Box sx={{ p: 2 }}>
                <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={(e) => { handleFiles(e.target.files); }} />
                <Box
                  onClick={() => { fileInputRef.current?.click(); }}
                  sx={{
                    p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider',
                    borderRadius: 1, bgcolor: 'grey.50', cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    파일을 이곳에 드래그하거나 <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>파일 선택</Box>을 클릭하세요.
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    제안서, 견적서, 비딩 비교표, 크리에이티브 시안 등 (개별 파일 50MB 이내)
                  </Typography>
                </Box>
                {attachedFiles.length > 0 && (
                  <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                    {attachedFiles.map((f, i) => (
                      <Stack key={i} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.75, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Paperclip size={13} />
                          <Typography variant="caption">{f.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>({(f.size / 1024).toFixed(1)} KB)</Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => { removeFile(i); }}><XIcon size={12} /></IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Stack>
        </Box>

        {/* ========= 하단 액션바 ========= */}
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
            <Button variant="outlined" color="info" size="small" onClick={saveDraft}>임시저장</Button>
            <Button variant="outlined" size="small" onClick={() => { setPreviewOpen(true); }} sx={{ color: '#1971c2', borderColor: '#a5d8ff', bgcolor: '#e7f5ff', '&:hover': { bgcolor: '#d0ebff' } }}>
              미리보기
            </Button>
            <Button
              variant="contained"
              size="small"
              endIcon={<ArrowRight />}
              onClick={handleSubmitClick}
              sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              결재 상신
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* ========= 필수값 누락 알림 ========= */}
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

      {/* ========= 결재선 선택 모달 ========= */}
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
          <Button variant="contained" onClick={() => { setSelectedLineId(pendingLineId); setLineModalOpen(false); }}>선택 적용</Button>
        </DialogActions>
      </Dialog>

      {/* ========= 결재 상신 확인 모달 ========= */}
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
          <Button variant="contained" onClick={confirmSubmit}>상신하기</Button>
        </DialogActions>
      </Dialog>

      {/* ========= 취소 확인 모달 ========= */}
      <Dialog open={cancelModalOpen} onClose={() => { setCancelModalOpen(false); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: 'error.main', color: '#fff', py: 1.5 }}>작성 취소</DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>작성을 취소하시겠습니까?</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>저장하지 않은 내용은 모두 사라집니다.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2.5, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={() => { setCancelModalOpen(false); }}>계속 작성</Button>
          <Button variant="contained" color="error" onClick={() => { setCancelModalOpen(false); showToast('작성이 취소되었습니다.', 'info'); }}>취소하기</Button>
        </DialogActions>
      </Dialog>

      {/* ========= 미리보기 모달 ========= */}
      <Dialog open={previewOpen} onClose={() => { setPreviewOpen(false); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: '#fff', py: 1.5 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            결재 문서 미리보기
            <IconButton size="small" onClick={() => { setPreviewOpen(false); }} sx={{ color: '#fff' }}><XIcon size={18} /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <PreviewDoc
            today={today}
            currentLine={currentLine}
            brand={brand}
            projectName={projectName}
            activity={activity}
            projectType={projectType}
            activityName={activityName}
            dateFrom={dateFrom}
            dateTo={dateTo}
            region={region}
            target={target}
            totalCost={totalCost}
            marketSituation={marketSituation}
            mainGoal={mainGoal}
            executionPlan={executionPlan}
            budgetTotal={calcBudgetTotal()}
            budgetRows={budgetRows}
            bidYn={bidYn}
            bidReason={bidReason}
            bidSkipReason={bidSkipReason}
            kpiItem={kpiItem}
            kpiBiz={kpiBiz}
            kpiBrand={kpiBrand}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button variant="outlined" color="inherit" onClick={() => { setPreviewOpen(false); }}>닫기</Button>
          <Button variant="contained" startIcon={<PrinterIcon />} onClick={printPreviewContent}>인쇄</Button>
        </DialogActions>
      </Dialog>

      {/* ========= 토스트 ========= */}
      {toast && (
        <Box sx={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, minWidth: 240,
        }}>
          <Alert severity={toast.type} sx={{ boxShadow: 4 }}>{toast.msg}</Alert>
        </Box>
      )}
    </Box>
  );
}

/* ========= 보조 컴포넌트 ========= */

/* ========= 미리보기 문서 컴포넌트 ========= */

interface PreviewDocProps {
  today: string;
  currentLine: ApprovalLineOption;
  brand: string;
  projectName: string;
  activity: string;
  projectType: string;
  activityName: string;
  dateFrom: string;
  dateTo: string;
  region: string;
  target: string;
  totalCost: string;
  marketSituation: string;
  mainGoal: string;
  executionPlan: string;
  budgetTotal: number;
  budgetRows: BudgetRow[];
  bidYn: string;
  bidReason: string;
  bidSkipReason: string;
  kpiItem: string;
  kpiBiz: string;
  kpiBrand: string;
}

function PreviewDoc({ today, currentLine, brand, projectName, activity, projectType, activityName, dateFrom, dateTo, region, target, totalCost, marketSituation, mainGoal, executionPlan, budgetTotal, budgetRows, bidYn, bidReason, bidSkipReason, kpiItem, kpiBiz, kpiBrand }: PreviewDocProps) {
  const title = brand && projectName
    ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}`
    : '(제목 미입력)';

  function Empty({ val }: { val: string }) {
    return val
      ? <Typography variant="body2" sx={{ pl: 1, color: '#495057', whiteSpace: 'pre-wrap' }}>{val}</Typography>
      : <Typography variant="body2" sx={{ pl: 1, color: '#adb5bd', fontStyle: 'italic' }}>(미입력)</Typography>;
  }

  function PreviewSection({ title: t, children }: { title: string; children: React.ReactNode }) {
    return (
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, pl: 1, borderLeft: '3px solid #1a3a6e', color: '#212529' }}>{t}</Typography>
        {children}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, fontFamily: '"Batang", "바탕", serif', lineHeight: 1.8 }}>
      {/* 제목 */}
      <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 700, pb: 2, mb: 2.5, borderBottom: '3px double #212529', letterSpacing: '0.3em' }}>
        광 고 선 전 비 사 전 품 의
      </Typography>

      {/* 기본 정보 테이블 */}
      <Table size="small" sx={{ mb: 3, border: '1px solid', borderColor: '#adb5bd', '& th,& td': { border: '1px solid #adb5bd', px: 1.5, py: 0.75, fontSize: '0.75rem' } }}>
        <TableBody>
          <TableRow>
            <TableCell component="th" sx={{ bgcolor: '#f1f3f5', fontWeight: 600, width: 70 }}>작성일</TableCell>
            <TableCell colSpan={3}>{today}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" sx={{ bgcolor: '#f1f3f5', fontWeight: 600 }}>기안자</TableCell>
            <TableCell>기안자</TableCell>
            <TableCell component="th" sx={{ bgcolor: '#f1f3f5', fontWeight: 600 }}>소속</TableCell>
            <TableCell>커머셜비용전략파트</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" sx={{ bgcolor: '#f1f3f5', fontWeight: 600 }}>결재선</TableCell>
            <TableCell colSpan={3} sx={{ fontSize: '0.7rem' }}>
              {currentLine.name} &nbsp;·&nbsp; {currentLine.steps.map((s) => `${s.type}(${s.name})`).join(' → ')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* 1. 품의 제목 */}
      <PreviewSection title="1. 품의 제목">
        <Typography variant="body2" sx={{ pl: 1, fontWeight: 500, color: brand && projectName ? '#212529' : '#adb5bd', fontStyle: brand && projectName ? 'normal' : 'italic' }}>
          {title}
        </Typography>
      </PreviewSection>

      {/* 2. 프로젝트 TYPE */}
      <PreviewSection title="2. 프로젝트 TYPE">
        <Empty val={projectType} />
      </PreviewSection>

      {/* 3. 세부내역 */}
      <PreviewSection title="3. 세부내역">
        {[
          ['활동명', activityName],
          ['기간', dateFrom || dateTo ? `${dateFrom}${dateTo ? ` ~ ${dateTo}` : ''}` : ''],
          ['대상 국가/지역', region],
          ['주요 타겟', target],
          ['총 사용 비용', totalCost ? `${totalCost} 원 (VAT 별도)` : ''],
        ].map(([label, val]) => (
          <Stack key={label} direction="row" spacing={1} sx={{ mb: 0.5, pl: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100, flexShrink: 0 }}>· {label}</Typography>
            {val
              ? <Typography variant="body2">{val}</Typography>
              : <Typography variant="body2" sx={{ color: '#adb5bd', fontStyle: 'italic' }}>(미입력)</Typography>
            }
          </Stack>
        ))}
      </PreviewSection>

      {/* 4. 목적 및 배경 */}
      <PreviewSection title="4. 목적 및 배경">
        <Typography variant="caption" sx={{ pl: 1, fontWeight: 600, display: 'block', mb: 0.5 }}>시장 및 경쟁 현황</Typography>
        <Empty val={marketSituation} />
        <Typography variant="caption" sx={{ pl: 1, fontWeight: 600, display: 'block', mt: 1.5, mb: 0.5 }}>주요 목표</Typography>
        <Empty val={mainGoal} />
      </PreviewSection>

      {/* 5. 주요 실행 방안 */}
      <PreviewSection title="5. 주요 실행 방안">
        <Empty val={executionPlan} />
      </PreviewSection>

      {/* 6. 세부 예산 내역 */}
      <PreviewSection title="6. 세부 예산 내역">
        <Table size="small" sx={{ mb: 1, border: '1px solid', borderColor: '#adb5bd', '& th,& td': { border: '1px solid #adb5bd', px: 1.5, py: 0.5, fontSize: '0.7rem' } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a3a6e' }}>
              {['No', '항목', '세부내역', '수량', '단가(원)', '금액(원)', '비고'].map((h) => (
                <TableCell key={h} sx={{ color: '#fff', fontWeight: 500 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetRows.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell sx={{ textAlign: 'center', color: 'text.secondary' }}>{i + 1}</TableCell>
                <TableCell>{r.item || '-'}</TableCell>
                <TableCell>{r.detail || '-'}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{r.qty || '-'}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{r.price || '-'}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{r.amount || '-'}</TableCell>
                <TableCell>{r.note || '-'}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell colSpan={5} sx={{ textAlign: 'right', fontWeight: 600 }}>합계</TableCell>
              <TableCell sx={{ textAlign: 'right', fontWeight: 700, color: '#1a3a6e' }}>{budgetTotal.toLocaleString()} 원</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </PreviewSection>

      {/* 7. 업체 비딩 */}
      <PreviewSection title="7. 업체 비딩 내역">
        {[
          ['비딩 진행여부', bidYn],
          ['최종 업체 선정 사유', bidReason],
          ['비딩 생략 근거', bidSkipReason],
        ].map(([label, val]) => (
          <Box key={label} sx={{ mb: 1, pl: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
            <Empty val={val} />
          </Box>
        ))}
      </PreviewSection>

      {/* 8. 기대효과 및 KPI */}
      <PreviewSection title="8. 기대효과 및 KPI">
        {[
          ['항목별 기대효과', kpiItem],
          ['비즈니스 기대효과', kpiBiz],
          ['브랜드 기대효과', kpiBrand],
        ].map(([label, val]) => (
          <Box key={label} sx={{ mb: 1, pl: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
            <Empty val={val} />
          </Box>
        ))}
      </PreviewSection>

      <Divider sx={{ mt: 3, mb: 2 }} />
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: 'text.disabled' }}>
        삼양식품(주) / 커머셜비용전략파트 · 본 문서는 미리보기 화면입니다.
      </Typography>
    </Box>
  );
}

function BudgetCaption({ title }: { title: string }) {
  return (
    <Typography variant="caption" sx={{
      display: 'block', mt: 2, mb: 0.75, fontWeight: 600, color: 'primary.main',
      borderLeft: '3px solid', borderColor: 'primary.main', pl: 1,
    }}>
      {title}
    </Typography>
  );
}

function AccountTable({
  rows,
  columns,
  fields,
  onUpdate,
  onRemove,
}: {
  rows: AccountRow[];
  columns: string[];
  fields: (keyof AccountRow)[];
  onUpdate: (id: number, field: keyof AccountRow, val: string) => void;
  onRemove: (id: number) => void;
}) {
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
                  <TextField size="small" variant="standard" fullWidth value={row[f]} onChange={(e) => { onUpdate(row.id, f, e.target.value); }} inputProps={{ style: ['budget', 'balance', 'amount'].includes(f) ? { textAlign: 'right' } : {} }} />
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

function TransferTable({
  rows,
  onUpdate,
  onRemove,
}: {
  rows: TransferRow[];
  onUpdate: (id: number, field: keyof TransferRow, val: string) => void;
  onRemove: (id: number) => void;
}) {
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
                  <TextField size="small" variant="standard" fullWidth value={row[f]} onChange={(e) => { onUpdate(row.id, f, e.target.value); }} inputProps={{ style: ['budget', 'balance', 'transferAmt'].includes(f) ? { textAlign: 'right' } : {} }} />
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
