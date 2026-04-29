'use client';

import * as React from 'react';
import * as XLSX from 'xlsx-js-style';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { Paperclip } from '@phosphor-icons/react/dist/ssr/Paperclip';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';

import {
  APPROVAL_LINES,
  numFmt,
  monthFmt,
  printHtmlInFrame,
  xlsxStyles,
} from './doc-form-types';
import type { AccountRow, BudgetRow, ToastState, TransferRow } from './doc-form-types';
import { AccountTable, BudgetCaption, FieldRow, SectionHeader, TransferTable } from './doc-form-primitives';
import { DocFormShell } from './doc-form-shell';

export function ApprovalForm(): React.JSX.Element {
  const today = new Date().toISOString().slice(0, 10);

  const [selectedLineId, setSelectedLineId] = React.useState('standard');

  const [brand, setBrand] = React.useState('');
  const [projectName, setProjectName] = React.useState('');
  const [activity, setActivity] = React.useState('');
  const [projectType, setProjectType] = React.useState('');
  const [activityName, setActivityName] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [region, setRegion] = React.useState('');
  const [target, setTarget] = React.useState('');
  const [totalCost, setTotalCost] = React.useState('');
  const [marketSituation, setMarketSituation] = React.useState('');
  const [mainGoal, setMainGoal] = React.useState('');
  const [executionPlan, setExecutionPlan] = React.useState('');

  const [budgetRows, setBudgetRows] = React.useState<BudgetRow[]>([
    { id: 1, item: '제작비', detail: '', qty: '1', price: '', amount: '', note: '' },
    { id: 2, item: '매체비', detail: '', qty: '1', price: '', amount: '', note: '' },
  ]);
  const nextBudgetId = React.useRef(3);

  const [bidYn, setBidYn] = React.useState('');
  const [bidReason, setBidReason] = React.useState('');
  const [bidSkipReason, setBidSkipReason] = React.useState('');
  const [kpiItem, setKpiItem] = React.useState('');
  const [kpiBiz, setKpiBiz] = React.useState('');
  const [kpiBrand, setKpiBrand] = React.useState('');
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

  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [lastSaved, setLastSaved] = React.useState('저장된 내역 없음');
  const [toast, setToast] = React.useState<ToastState | null>(null);

  /* Field refs for validation scroll */
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

  /* ---- Utils ---- */
  function showToast(msg: string, type: ToastState['type'] = 'success') {
    setToast({ msg, type });
    setTimeout(() => { setToast(null); }, 3000);
  }

  function calcBudgetTotal() {
    return budgetRows.reduce((sum, r) => sum + (Number(r.amount.replace(/,/g, '')) || 0), 0);
  }

  /* ---- Budget row management ---- */
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

  /* ---- Exec / transfer row management ---- */
  function updateExecRow(id: number, field: keyof AccountRow, value: string) {
    const numFields: (keyof AccountRow)[] = ['budget', 'balance', 'amount'];
    const val = field === 'month' ? monthFmt(value) : numFields.includes(field) ? numFmt(value) : value;
    setExecRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: val } : r));
  }

  function updateTransferRow(setter: React.Dispatch<React.SetStateAction<TransferRow[]>>, id: number, field: keyof TransferRow, value: string) {
    const numFields: (keyof TransferRow)[] = ['budget', 'balance', 'transferAmt'];
    const val = field === 'month' ? monthFmt(value) : numFields.includes(field) ? numFmt(value) : value;
    setter((prev) => prev.map((r) => r.id === id ? { ...r, [field]: val } : r));
  }

  function addTransferRow(setter: React.Dispatch<React.SetStateAction<TransferRow[]>>, nextId: React.MutableRefObject<number>) {
    setter((prev) => [...prev, { id: nextId.current++, type: '주는계정', month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', transferAmt: '' }]);
  }

  /* ---- Attachments ---- */
  function handleFiles(files: FileList | null) {
    if (!files) return;
    setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
  }

  /* ---- Draft save ---- */
  function saveDraft() {
    setLastSaved(new Date().toLocaleString('ko-KR'));
    showToast('임시저장 완료');
  }

  /* ---- Validate ---- */
  function validate() {
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
    const firstRef = missing[0]?.ref;
    return {
      errors: missing.map((f) => f.label),
      onDialogClose: firstRef ? () => {
        firstRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          firstRef.current?.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, [role="combobox"]')?.focus();
        }, 300);
      } : undefined,
    };
  }

  /* ---- Excel download ---- */
  function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const fileTitle = brand || projectName
      ? `[${brand || '브랜드'}] [${projectName || '프로젝트명'}]${activity ? ` (${activity})` : ''}`
      : '광고선전비 사전품의';
    const toNum = (s: string) => { const n = parseFloat(s.replace(/,/g, '')); return isNaN(n) ? s : n; };
    const period = dateFrom || dateTo ? `${dateFrom}${dateTo ? ` ~ ${dateTo}` : ''}` : '';

    const { title: sTitle, section: sSection, label: sLabel, value: sValue, budgetHead: sBudgetHead, budgetData: sBudgetData, budgetTotalLabel: sBudgetTotalLabel, budgetTotalVal: sBudgetTotalVal } = xlsxStyles;
    const LCOL = 6;
    const ws0: XLSX.WorkSheet = {};
    const merges: XLSX.Range[] = [];
    const rowH: { hpt: number }[] = [];
    let r0 = 0;

    function sc(row: number, col: number, v: string | number, s: object) {
      ws0[XLSX.utils.encode_cell({ r: row, c: col })] = { v, t: typeof v === 'number' ? 'n' : 's', s };
    }
    function mr(r1: number, c1: number, r2: number, c2: number) { merges.push({ s: { r: r1, c: c1 }, e: { r: r2, c: c2 } }); }
    function emptyR(h: number) { rowH[r0] = { hpt: h }; r0++; }
    function sectionRow(t: string) { sc(r0, 0, t, sSection); mr(r0, 0, r0, LCOL); rowH[r0] = { hpt: 22 }; r0++; }
    function labelValRow(label: string, val: string, h = 20) {
      sc(r0, 0, label, sLabel); sc(r0, 1, val, sValue); mr(r0, 1, r0, LCOL); rowH[r0] = { hpt: h }; r0++;
    }

    sc(r0, 0, '광  고  선  전  비  사  전  품  의', sTitle); mr(r0, 0, r0, LCOL); rowH[r0] = { hpt: 38 }; r0++;
    emptyR(6);

    sc(r0, 0, '작성일', sLabel); sc(r0, 1, today, sValue); mr(r0, 1, r0, 2);
    sc(r0, 3, '기안자', sLabel); sc(r0, 4, '기안자', sValue); mr(r0, 4, r0, LCOL);
    rowH[r0] = { hpt: 20 }; r0++;
    sc(r0, 0, '소속', sLabel); sc(r0, 1, '커머셜비용전략파트', sValue); mr(r0, 1, r0, LCOL); rowH[r0] = { hpt: 20 }; r0++;
    const currentLine = APPROVAL_LINES.find((l) => l.id === selectedLineId) ?? APPROVAL_LINES[0];
    sc(r0, 0, '결재선', sLabel);
    sc(r0, 1, `${currentLine.name}  ·  ${currentLine.steps.map((s) => `${s.type}(${s.name})`).join(' → ')}`, { ...sValue, font: { sz: 8, name: '맑은 고딕' } });
    mr(r0, 1, r0, LCOL); rowH[r0] = { hpt: 20 }; r0++; emptyR(8);

    sectionRow('1. 품의 제목');
    const titleVal = brand && projectName ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}` : '';
    sc(r0, 0, titleVal, { font: { bold: true, sz: 11, name: '맑은 고딕' }, alignment: { vertical: 'center' } }); mr(r0, 0, r0, LCOL); rowH[r0] = { hpt: 26 }; r0++; emptyR(6);

    sectionRow('2. 프로젝트 TYPE'); labelValRow('TYPE', projectType); emptyR(6);
    sectionRow('3. 세부내역');
    labelValRow('활동명', activityName); labelValRow('기간', period); labelValRow('대상 국가/지역', region);
    labelValRow('주요 타겟', target); labelValRow('총 사용 비용', totalCost ? `${totalCost} 원 (VAT 별도)` : ''); emptyR(6);
    sectionRow('4. 목적 및 배경'); labelValRow('시장 및 경쟁 현황', marketSituation, 52); labelValRow('주요 목표', mainGoal, 52); emptyR(6);
    sectionRow('5. 주요 실행 방안'); labelValRow('실행 방안', executionPlan, 64); emptyR(6);

    sectionRow('6. 세부 예산 내역');
    ['No', '항목', '세부내역', '수량', '단가 (원)', '금액 (원)', '비고'].forEach((h, c) => sc(r0, c, h, sBudgetHead));
    rowH[r0] = { hpt: 22 }; r0++;
    budgetRows.forEach((bRow, i) => {
      sc(r0, 0, i + 1, { ...sBudgetData, alignment: { horizontal: 'center', vertical: 'center' } });
      sc(r0, 1, bRow.item, sBudgetData); sc(r0, 2, bRow.detail, sBudgetData);
      sc(r0, 3, toNum(bRow.qty), { ...sBudgetData, alignment: { horizontal: 'right', vertical: 'center' } });
      sc(r0, 4, toNum(bRow.price), { ...sBudgetData, alignment: { horizontal: 'right', vertical: 'center' } });
      sc(r0, 5, toNum(bRow.amount), { ...sBudgetData, alignment: { horizontal: 'right', vertical: 'center' } });
      sc(r0, 6, bRow.note, sBudgetData); rowH[r0] = { hpt: 18 }; r0++;
    });
    const grandTotal = calcBudgetTotal();
    sc(r0, 0, '', sBudgetTotalLabel); mr(r0, 0, r0, 4);
    sc(r0, 4, '합계 (원)', sBudgetTotalLabel); sc(r0, 5, grandTotal, sBudgetTotalVal); sc(r0, 6, '', sBudgetTotalLabel);
    rowH[r0] = { hpt: 22 }; r0++; emptyR(6);

    sectionRow('7. 업체 비딩 내역');
    labelValRow('비딩 진행여부', bidYn); labelValRow('최종 업체 선정 사유', bidReason, 40); labelValRow('비딩 생략 근거', bidSkipReason, 40); emptyR(6);
    sectionRow('8. 기대효과 및 KPI');
    labelValRow('항목별 기대효과', kpiItem, 40); labelValRow('비즈니스 기대효과', kpiBiz, 40); labelValRow('브랜드 기대효과', kpiBrand, 40);

    ws0['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r0, c: LCOL } });
    ws0['!merges'] = merges; ws0['!rows'] = rowH;
    ws0['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 24 }, { wch: 9 }, { wch: 15 }, { wch: 15 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws0, '품의서');

    const ws1 = XLSX.utils.aoa_to_sheet([
      ['광고선전비 사전품의', null], [],
      ['▸ 기본 정보', null],
      ['브랜드', brand], ['프로젝트명', projectName], ['Activity 내역', activity],
      ['프로젝트 TYPE', projectType], ['활동명', activityName], ['기간', period],
      ['대상 국가/지역', region], ['주요 타겟', target],
      ['총 사용 비용 (원, VAT 별도)', totalCost ? toNum(totalCost) : ''],
      [], ['▸ 목적 및 배경', null],
      ['시장 및 경쟁 현황', marketSituation], ['주요 목표', mainGoal],
      [], ['▸ 주요 실행 방안', null], ['실행 방안', executionPlan],
      [], ['▸ 업체 비딩', null],
      ['비딩 진행여부', bidYn], ['최종 업체 선정 사유', bidReason], ['비딩 생략 근거', bidSkipReason],
      [], ['▸ 기대효과 및 KPI', null],
      ['항목별 기대효과', kpiItem], ['비즈니스 기대효과', kpiBiz], ['브랜드 기대효과', kpiBrand],
    ]);
    ws1['!cols'] = [{ wch: 26 }, { wch: 72 }];
    XLSX.utils.book_append_sheet(wb, ws1, '품의 기본정보');

    const ws2 = XLSX.utils.aoa_to_sheet([
      ['No', '항목', '세부내역', '수량', '단가 (원)', '금액 (원)', '비고'],
      ...budgetRows.map((bRow, i) => [i + 1, bRow.item, bRow.detail, toNum(bRow.qty), toNum(bRow.price), toNum(bRow.amount), bRow.note]),
      [], ['', '', '', '', '합계 (원)', grandTotal, ''],
    ]);
    ws2['!cols'] = [{ wch: 5 }, { wch: 18 }, { wch: 32 }, { wch: 8 }, { wch: 16 }, { wch: 16 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(wb, ws2, '세부 예산 내역');

    const ws3 = XLSX.utils.aoa_to_sheet([
      ['비용 지급 방식', payMethod, null, null, null, null, null, null, null], [],
      ['구분', '월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액 (원)', '현재잔액 (원)', '집행금액 (원)'],
      ...execRows.map((eRow) => ['집행계정', eRow.month, eRow.cc, eRow.ccName, eRow.accCode, eRow.accName, toNum(eRow.budget), toNum(eRow.balance), toNum(eRow.amount)]),
    ]);
    ws3['!cols'] = [{ wch: 10 }, { wch: 8 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ws3, '예산 사용 계획');

    XLSX.writeFile(wb, `${fileTitle}_${today}.xlsx`);
    showToast('Excel 파일 다운로드 완료');
  }

  /* ---- Print ---- */
  function handlePrint() {
    const currentLine = APPROVAL_LINES.find((l) => l.id === selectedLineId) ?? APPROVAL_LINES[0];
    const title = brand && projectName ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}` : '(제목 미입력)';
    const budgetTotal = calcBudgetTotal();
    const lineSteps = currentLine.steps.map((s) => `${s.type}(${s.name})`).join(' → ');
    const v = (val: string, fallback = '(미입력)') => val || `<span style="color:#adb5bd;font-style:italic">${fallback}</span>`;
    const budgetRowsHtml = budgetRows.map((r, i) => `
      <tr>
        <td style="text-align:center;color:#6c757d">${i + 1}</td>
        <td>${r.item || '-'}</td><td>${r.detail || '-'}</td>
        <td style="text-align:right">${r.qty || '-'}</td>
        <td style="text-align:right">${r.price || '-'}</td>
        <td style="text-align:right">${r.amount || '-'}</td>
        <td>${r.note || '-'}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"/>
<title>광고선전비 사전품의</title>
<style>
  @page{size:A4;margin:14mm 16mm}*{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Malgun Gothic","맑은 고딕","Apple SD Gothic Neo",sans-serif;font-size:12px;line-height:1.7;color:#212529}
  h1{text-align:center;font-size:17px;font-weight:700;letter-spacing:.35em;padding-bottom:10px;margin-bottom:18px;border-bottom:3px double #212529}
  table{width:100%;border-collapse:collapse;margin-bottom:14px}th,td{border:1px solid #adb5bd;padding:5px 10px;font-size:11px}
  th{background:#f1f3f5;font-weight:600;white-space:nowrap}
  .section{margin-bottom:18px;break-inside:avoid}
  .section-title{font-size:12px;font-weight:700;border-left:3px solid #1a3a6e;padding-left:8px;color:#212529;margin-bottom:8px}
  .row{display:flex;gap:8px;margin-bottom:4px;padding-left:8px}.row-label{color:#6c757d;min-width:100px;flex-shrink:0}
  .val{padding-left:8px;white-space:pre-wrap}
  .budget-head th{background:#1a3a6e;color:#fff;font-weight:500}
  .budget-total td{background:#f8f9fa;font-weight:600}.budget-total .amount{font-weight:700;color:#1a3a6e}
  .footer{margin-top:24px;padding-top:12px;border-top:1px solid #dee2e6;text-align:right;font-size:10px;color:#adb5bd}
</style></head><body>
<h1>광 고 선 전 비 사 전 품 의</h1>
<table><tbody>
  <tr><th style="width:60px">작성일</th><td colspan="3">${today}</td></tr>
  <tr><th>기안자</th><td>기안자</td><th>소속</th><td>커머셜비용전략파트</td></tr>
  <tr><th>결재선</th><td colspan="3" style="font-size:10px">${currentLine.name} &nbsp;·&nbsp; ${lineSteps}</td></tr>
</tbody></table>
<div class="section"><div class="section-title">1. 품의 제목</div>
  <div class="val">${brand && projectName ? title : '<span style="color:#adb5bd;font-style:italic">(미입력)</span>'}</div></div>
<div class="section"><div class="section-title">2. 프로젝트 TYPE</div><div class="val">${v(projectType)}</div></div>
<div class="section"><div class="section-title">3. 세부내역</div>
  ${activityName ? `<div class="row"><span class="row-label">· 활동명</span><span>${activityName}</span></div>` : ''}
  ${(dateFrom || dateTo) ? `<div class="row"><span class="row-label">· 기간</span><span>${dateFrom}${dateTo ? ` ~ ${dateTo}` : ''}</span></div>` : ''}
  ${region ? `<div class="row"><span class="row-label">· 대상 국가/지역</span><span>${region}</span></div>` : ''}
  ${target ? `<div class="row"><span class="row-label">· 주요 타겟</span><span>${target}</span></div>` : ''}
  ${totalCost ? `<div class="row"><span class="row-label">· 총 사용 비용</span><span>${totalCost} 원 (VAT 별도)</span></div>` : ''}
</div>
<div class="section"><div class="section-title">4. 목적 및 배경</div>
  ${marketSituation ? `<span style="font-size:11px;font-weight:600;padding-left:8px;display:block;margin-bottom:4px">시장 및 경쟁 현황</span><div class="val">${marketSituation}</div>` : ''}
  ${mainGoal ? `<span style="font-size:11px;font-weight:600;padding-left:8px;display:block;margin-top:10px;margin-bottom:4px">주요 목표</span><div class="val">${mainGoal}</div>` : ''}
</div>
<div class="section"><div class="section-title">5. 주요 실행 방안</div><div class="val">${v(executionPlan)}</div></div>
<div class="section"><div class="section-title">6. 세부 예산 내역</div>
  <table><thead class="budget-head"><tr><th>No</th><th>항목</th><th>세부내역</th><th>수량</th><th>단가(원)</th><th>금액(원)</th><th>비고</th></tr></thead>
  <tbody>${budgetRowsHtml}
  <tr class="budget-total"><td colspan="5" style="text-align:right">합계</td><td class="amount" style="text-align:right">${budgetTotal.toLocaleString()} 원</td><td></td></tr>
  </tbody></table>
</div>
<div class="section"><div class="section-title">7. 업체 비딩 내역</div>
  ${bidYn ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">비딩 진행여부</span><div class="val">${bidYn}</div></div>` : ''}
  ${bidReason ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">최종 업체 선정 사유</span><div class="val">${bidReason}</div></div>` : ''}
  ${bidSkipReason ? `<div style="padding-left:8px"><span style="font-size:11px;font-weight:600">비딩 생략 근거</span><div class="val">${bidSkipReason}</div></div>` : ''}
</div>
<div class="section"><div class="section-title">8. 기대효과 및 KPI</div>
  ${kpiItem ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">항목별 기대효과</span><div class="val">${kpiItem}</div></div>` : ''}
  ${kpiBiz ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">비즈니스 기대효과</span><div class="val">${kpiBiz}</div></div>` : ''}
  ${kpiBrand ? `<div style="padding-left:8px"><span style="font-size:11px;font-weight:600">브랜드 기대효과</span><div class="val">${kpiBrand}</div></div>` : ''}
</div>
<div class="footer">삼양식품(주) / 커머셜비용전략파트</div>
</body></html>`;
    printHtmlInFrame(html);
  }

  const docTitle = brand || projectName || activity
    ? `${brand ? `[${brand}]` : '[브랜드]'} ${projectName ? `[${projectName}]` : '[프로젝트명]'}${activity ? ` (${activity})` : ''}`
    : '';

  const previewContent = (
    <PreviewDoc
      today={today}
      selectedLineId={selectedLineId}
      brand={brand} projectName={projectName} activity={activity}
      projectType={projectType} activityName={activityName}
      dateFrom={dateFrom} dateTo={dateTo} region={region} target={target} totalCost={totalCost}
      marketSituation={marketSituation} mainGoal={mainGoal} executionPlan={executionPlan}
      budgetTotal={calcBudgetTotal()} budgetRows={budgetRows}
      bidYn={bidYn} bidReason={bidReason} bidSkipReason={bidSkipReason}
      kpiItem={kpiItem} kpiBiz={kpiBiz} kpiBrand={kpiBrand}
    />
  );

  return (
    <DocFormShell
      docTitle="광고선전비 사전품의"
      breadcrumbLabel="광고선전비 사전품의"
      selectedLineId={selectedLineId}
      onLineChange={setSelectedLineId}
      onExcelDownload={downloadExcel}
      onPrint={handlePrint}
      onSaveDraft={saveDraft}
      lastSaved={lastSaved}
      validate={validate}
      onConfirmSubmit={() => { showToast('결재 상신이 완료되었습니다.', 'success'); }}
      previewContent={previewContent}
      toast={toast}
    >
      <Alert severity="info" sx={{ mb: 2.5, fontSize: '0.75rem' }}>
        본 양식은 광고선전비 집행 전 반드시 작성해야 하며, 모든 필수 항목(<Box component="span" sx={{ color: 'error.main' }}>*</Box>)을 입력해야 결재 상신이 가능합니다.
      </Alert>

      <Stack spacing={2.5}>
        {/* 1. 품의 제목 */}
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

        {/* 2. 프로젝트 TYPE */}
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

        {/* 3. 세부내역 */}
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

        {/* 4. 목적 및 배경 */}
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

        {/* 5. 주요 실행 방안 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={5} title="주요 실행 방안" required />
          <Box ref={executionPlanRef} sx={{ p: 2 }}>
            <TextField size="small" fullWidth multiline minRows={4} placeholder="채널 전략, 크리에이티브 방향, 미디어 플랜 등 실행 계획을 상세히 작성해주세요." value={executionPlan} onChange={(e) => { setExecutionPlan(e.target.value); }} />
          </Box>
        </Paper>

        {/* 6. 세부 예산 내역 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader
            num={6} title="세부 예산 내역" required
            action={
              <Button size="small" variant="contained" startIcon={<Plus />} onClick={() => { setBudgetRows((prev) => [...prev, { id: nextBudgetId.current++, item: '', detail: '', qty: '1', price: '', amount: '', note: '' }]); }} sx={{ height: 28 }}>
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
                      <IconButton size="small" onClick={() => { setBudgetRows((prev) => prev.filter((r) => r.id !== row.id)); }}><Trash size={14} /></IconButton>
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

        {/* 7. 업체 비딩 내역 */}
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
              <TextField size="small" fullWidth multiline minRows={2} placeholder="비딩을 생략한 경우 근거를 작성해주세요." value={bidSkipReason} onChange={(e) => { setBidSkipReason(e.target.value); }} />
            </FieldRow>
          </Box>
        </Paper>

        {/* 8. 기대효과 및 KPI */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={8} title="기대효과 및 KPI" required />
          <Box sx={{ p: 2 }}>
            <FieldRow label="항목별 기대효과" required fieldRef={kpiItemRef}>
              <TextField size="small" fullWidth multiline minRows={2} placeholder="예: 임프레션 1억 회, CTR 2.5% 이상" value={kpiItem} onChange={(e) => { setKpiItem(e.target.value); }} />
            </FieldRow>
            <FieldRow label="비즈니스 기대효과" required fieldRef={kpiBizRef}>
              <TextField size="small" fullWidth multiline minRows={2} placeholder="매출 증대, 신규 고객 유치, 시장 점유율 변화 등" value={kpiBiz} onChange={(e) => { setKpiBiz(e.target.value); }} />
            </FieldRow>
            <FieldRow label="브랜드 기대효과" required fieldRef={kpiBrandRef}>
              <TextField size="small" fullWidth multiline minRows={2} placeholder="브랜드 인지도, 선호도, 호감도 등 정성적 효과" value={kpiBrand} onChange={(e) => { setKpiBrand(e.target.value); }} />
            </FieldRow>
          </Box>
        </Paper>

        {/* 9. 예산 사용 계획 및 전용 계획 */}
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
            <BudgetCaption title="집행계정" />
            <AccountTable
              rows={execRows}
              columns={['월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액', '현재잔액', '집행금액']}
              fields={['month', 'cc', 'ccName', 'accCode', 'accName', 'budget', 'balance', 'amount'] as (keyof AccountRow)[]}
              onUpdate={updateExecRow}
              onRemove={(id) => { setExecRows((prev) => prev.filter((r) => r.id !== id)); }}
            />
            <Button size="small" variant="outlined" startIcon={<Plus />} onClick={() => { setExecRows((prev) => [...prev, { id: nextExecId.current++, month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', amount: '' }]); }} sx={{ mt: 1 }}>집행계정 행 추가</Button>

            <BudgetCaption title="계정간 전용" />
            <TransferTable
              rows={accountTransferRows}
              onUpdate={(id, field, val) => { updateTransferRow(setAccountTransferRows, id, field, val); }}
              onRemove={(id) => { setAccountTransferRows((prev) => prev.filter((r) => r.id !== id)); }}
            />
            <Button size="small" variant="outlined" startIcon={<Plus />} onClick={() => { addTransferRow(setAccountTransferRows, nextAccountTransferId); }} sx={{ mt: 1 }}>계정간 전용 행 추가</Button>

            <BudgetCaption title="부서간 전용" />
            <TransferTable
              rows={deptTransferRows}
              onUpdate={(id, field, val) => { updateTransferRow(setDeptTransferRows, id, field, val); }}
              onRemove={(id) => { setDeptTransferRows((prev) => prev.filter((r) => r.id !== id)); }}
            />
            <Button size="small" variant="outlined" startIcon={<Plus />} onClick={() => { addTransferRow(setDeptTransferRows, nextDeptTransferId); }} sx={{ mt: 1 }}>부서간 전용 행 추가</Button>
          </Box>
        </Paper>

        {/* 첨부파일 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={<Paperclip size={13} />} title="첨부파일" />
          <Box sx={{ p: 2 }}>
            <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={(e) => { handleFiles(e.target.files); }} />
            <Box
              onClick={() => { fileInputRef.current?.click(); }}
              sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' } }}
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
                    <IconButton size="small" onClick={() => { setAttachedFiles((prev) => prev.filter((_, j) => j !== i)); }}><XIcon size={12} /></IconButton>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>
      </Stack>
    </DocFormShell>
  );
}

/* ---- In-dialog preview component ---- */

interface PreviewDocProps {
  today: string;
  selectedLineId: string;
  brand: string; projectName: string; activity: string;
  projectType: string; activityName: string;
  dateFrom: string; dateTo: string; region: string; target: string; totalCost: string;
  marketSituation: string; mainGoal: string; executionPlan: string;
  budgetTotal: number; budgetRows: BudgetRow[];
  bidYn: string; bidReason: string; bidSkipReason: string;
  kpiItem: string; kpiBiz: string; kpiBrand: string;
}

function PreviewDoc({ today, selectedLineId, brand, projectName, activity, projectType, activityName, dateFrom, dateTo, region, target, totalCost, marketSituation, mainGoal, executionPlan, budgetTotal, budgetRows, bidYn, bidReason, bidSkipReason, kpiItem, kpiBiz, kpiBrand }: PreviewDocProps) {
  const currentLine = APPROVAL_LINES.find((l) => l.id === selectedLineId) ?? APPROVAL_LINES[0];
  const title = brand && projectName ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}` : '(제목 미입력)';

  function Empty({ val }: { val: string }) {
    return val
      ? <Typography variant="body2" sx={{ pl: 1, color: '#495057', whiteSpace: 'pre-wrap' }}>{val}</Typography>
      : <Typography variant="body2" sx={{ pl: 1, color: '#adb5bd', fontStyle: 'italic' }}>(미입력)</Typography>;
  }

  function Sec({ title: t, children }: { title: string; children: React.ReactNode }) {
    return (
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, pl: 1, borderLeft: '3px solid #1a3a6e', color: '#212529' }}>{t}</Typography>
        {children}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, fontFamily: '"Batang", "바탕", serif', lineHeight: 1.8 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 700, pb: 2, mb: 2.5, borderBottom: '3px double #212529', letterSpacing: '0.3em' }}>
        광 고 선 전 비 사 전 품 의
      </Typography>
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
      <Sec title="1. 품의 제목">
        <Typography variant="body2" sx={{ pl: 1, fontWeight: 500, color: brand && projectName ? '#212529' : '#adb5bd', fontStyle: brand && projectName ? 'normal' : 'italic' }}>{title}</Typography>
      </Sec>
      <Sec title="2. 프로젝트 TYPE"><Empty val={projectType} /></Sec>
      <Sec title="3. 세부내역">
        {[['활동명', activityName], ['기간', dateFrom || dateTo ? `${dateFrom}${dateTo ? ` ~ ${dateTo}` : ''}` : ''], ['대상 국가/지역', region], ['주요 타겟', target], ['총 사용 비용', totalCost ? `${totalCost} 원 (VAT 별도)` : '']].map(([label, val]) => (
          <Stack key={label} direction="row" spacing={1} sx={{ mb: 0.5, pl: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100, flexShrink: 0 }}>· {label}</Typography>
            {val ? <Typography variant="body2">{val}</Typography> : <Typography variant="body2" sx={{ color: '#adb5bd', fontStyle: 'italic' }}>(미입력)</Typography>}
          </Stack>
        ))}
      </Sec>
      <Sec title="4. 목적 및 배경">
        <Typography variant="caption" sx={{ pl: 1, fontWeight: 600, display: 'block', mb: 0.5 }}>시장 및 경쟁 현황</Typography><Empty val={marketSituation} />
        <Typography variant="caption" sx={{ pl: 1, fontWeight: 600, display: 'block', mt: 1.5, mb: 0.5 }}>주요 목표</Typography><Empty val={mainGoal} />
      </Sec>
      <Sec title="5. 주요 실행 방안"><Empty val={executionPlan} /></Sec>
      <Sec title="6. 세부 예산 내역">
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
                <TableCell>{r.item || '-'}</TableCell><TableCell>{r.detail || '-'}</TableCell>
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
      </Sec>
      <Sec title="7. 업체 비딩 내역">
        {[['비딩 진행여부', bidYn], ['최종 업체 선정 사유', bidReason], ['비딩 생략 근거', bidSkipReason]].map(([label, val]) => (
          <Box key={label} sx={{ mb: 1, pl: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
            <Empty val={val} />
          </Box>
        ))}
      </Sec>
      <Sec title="8. 기대효과 및 KPI">
        {[['항목별 기대효과', kpiItem], ['비즈니스 기대효과', kpiBiz], ['브랜드 기대효과', kpiBrand]].map(([label, val]) => (
          <Box key={label} sx={{ mb: 1, pl: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
            <Empty val={val} />
          </Box>
        ))}
      </Sec>
      <Divider sx={{ mt: 3, mb: 2 }} />
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: 'text.disabled' }}>
        삼양식품(주) / 커머셜비용전략파트 · 본 문서는 미리보기 화면입니다.
      </Typography>
    </Box>
  );
}
