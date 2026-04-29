'use client';

import * as React from 'react';
import * as XLSX from 'xlsx-js-style';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
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
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import {
  APPROVAL_LINES,
  numFmt,
  monthFmt,
  printHtmlInFrame,
  xlsxStyles,
} from './doc-form-types';
import type { AccountRow, ToastState, TransferRow } from './doc-form-types';
import { AccountTable, BudgetCaption, FieldRow, SectionHeader, TransferTable } from './doc-form-primitives';
import { DocFormShell } from './doc-form-shell';

export function SettlementForm(): React.JSX.Element {
  const today = new Date().toISOString().slice(0, 10);

  const [selectedLineId, setSelectedLineId] = React.useState('standard');

  /* Section 1 */
  const [brand, setBrand] = React.useState('');
  const [projectName, setProjectName] = React.useState('');
  const [activity, setActivity] = React.useState('');

  /* Section 2 */
  const [originalDocName, setOriginalDocName] = React.useState('');
  const [originalDocNo, setOriginalDocNo] = React.useState('');

  /* Section 3 */
  const [executionSummary, setExecutionSummary] = React.useState('');

  /* Section 4 */
  const [campaignStatus, setCampaignStatus] = React.useState('');

  /* Section 5 */
  const [kpiItem, setKpiItem] = React.useState('');
  const [kpiBiz, setKpiBiz] = React.useState('');
  const [kpiBrand, setKpiBrand] = React.useState('');

  /* Section 6 */
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

  const [carryoverRows, setCarryoverRows] = React.useState<TransferRow[]>([
    { id: 1, type: '주는계정', month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', transferAmt: '' },
    { id: 2, type: '집행계정', month: '', cc: '', ccName: '', accCode: '', accName: '', budget: '', balance: '', transferAmt: '' },
  ]);
  const nextCarryoverId = React.useRef(3);

  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [lastSaved, setLastSaved] = React.useState('저장된 내역 없음');
  const [toast, setToast] = React.useState<ToastState | null>(null);

  /* Field refs */
  const brandRef = React.useRef<HTMLDivElement>(null);
  const projectNameRef = React.useRef<HTMLDivElement>(null);
  const activityRef = React.useRef<HTMLDivElement>(null);
  const originalDocNameRef = React.useRef<HTMLDivElement>(null);
  const originalDocNoRef = React.useRef<HTMLDivElement>(null);
  const executionSummaryRef = React.useRef<HTMLDivElement>(null);
  const kpiItemRef = React.useRef<HTMLDivElement>(null);
  const kpiBizRef = React.useRef<HTMLDivElement>(null);
  const kpiBrandRef = React.useRef<HTMLDivElement>(null);
  const payMethodRef = React.useRef<HTMLDivElement>(null);

  function showToast(msg: string, type: ToastState['type'] = 'success') {
    setToast({ msg, type });
    setTimeout(() => { setToast(null); }, 3000);
  }

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

  function saveDraft() {
    setLastSaved(new Date().toLocaleString('ko-KR'));
    showToast('임시저장 완료');
  }

  function validate() {
    type F = { label: string; isEmpty: boolean; ref: React.RefObject<HTMLDivElement | null> };
    const fields: F[] = [
      { label: '1. 브랜드',                   isEmpty: !brand,             ref: brandRef },
      { label: '1. 프로젝트명',                isEmpty: !projectName,       ref: projectNameRef },
      { label: '1. Activity 내역',             isEmpty: !activity,          ref: activityRef },
      { label: '2. 사전품의 / 변경품의 명',    isEmpty: !originalDocName,   ref: originalDocNameRef },
      { label: '2. 품의 번호',                 isEmpty: !originalDocNo,     ref: originalDocNoRef },
      { label: '3. 주요 실행 내역',            isEmpty: !executionSummary,  ref: executionSummaryRef },
      { label: '5. 항목별 KPI 측정',           isEmpty: !kpiItem,           ref: kpiItemRef },
      { label: '5. 비즈니스 기여도',           isEmpty: !kpiBiz,            ref: kpiBizRef },
      { label: '5. 브랜드 기여도',             isEmpty: !kpiBrand,          ref: kpiBrandRef },
      { label: '6. 비용 지급 방식',            isEmpty: !payMethod,         ref: payMethodRef },
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

  function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const fileTitle = brand || projectName
      ? `[${brand || '브랜드'}] [${projectName || '프로젝트명'}]${activity ? ` (${activity})` : ''}`
      : '광고선전비 정산품의';
    const toNum = (s: string) => { const n = parseFloat(s.replace(/,/g, '')); return isNaN(n) ? s : n; };
    const { title: sTitle, section: sSection, label: sLabel, value: sValue } = xlsxStyles;
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

    sc(r0, 0, '광 고 선 전 비  정 산 품 의', sTitle); mr(r0, 0, r0, LCOL); rowH[r0] = { hpt: 38 }; r0++; emptyR(6);

    const currentLine = APPROVAL_LINES.find((l) => l.id === selectedLineId) ?? APPROVAL_LINES[0];
    sc(r0, 0, '작성일', sLabel); sc(r0, 1, today, sValue); mr(r0, 1, r0, 2);
    sc(r0, 3, '기안자', sLabel); sc(r0, 4, '기안자', sValue); mr(r0, 4, r0, LCOL); rowH[r0] = { hpt: 20 }; r0++;
    sc(r0, 0, '소속', sLabel); sc(r0, 1, '커머셜비용전략파트', sValue); mr(r0, 1, r0, LCOL); rowH[r0] = { hpt: 20 }; r0++;
    sc(r0, 0, '결재선', sLabel);
    sc(r0, 1, `${currentLine.name}  ·  ${currentLine.steps.map((s) => `${s.type}(${s.name})`).join(' → ')}`, { ...sValue, font: { sz: 8, name: '맑은 고딕' } });
    mr(r0, 1, r0, LCOL); rowH[r0] = { hpt: 20 }; r0++; emptyR(8);

    sectionRow('1. 품의 제목');
    sc(r0, 0, brand && projectName ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}` : '', { font: { bold: true, sz: 11, name: '맑은 고딕' }, alignment: { vertical: 'center' } });
    mr(r0, 0, r0, LCOL); rowH[r0] = { hpt: 26 }; r0++; emptyR(6);

    sectionRow('2. 사전품의 / 변경품의 명 (품의 번호 포함)');
    labelValRow('품의 명', originalDocName); labelValRow('품의 번호', originalDocNo); emptyR(6);

    sectionRow('3. 주요 실행 내역'); labelValRow('실행 내역', executionSummary, 64); emptyR(6);

    sectionRow('4. 캠페인 수행 현황 (별첨 대체 가능)'); labelValRow('수행 현황', campaignStatus, 52); emptyR(6);

    sectionRow('5. KPI 달성 여부');
    labelValRow('(1) 항목별 KPI 측정', kpiItem, 40);
    labelValRow('(2) 비즈니스 기여도', kpiBiz, 40);
    labelValRow('(3) 브랜드 기여도', kpiBrand, 40); emptyR(6);

    sectionRow('6. 예산 사용 계획 및 전용 계획');
    labelValRow('비용 지급 방식', payMethod);

    ws0['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r0, c: LCOL } });
    ws0['!merges'] = merges; ws0['!rows'] = rowH;
    ws0['!cols'] = [{ wch: 26 }, { wch: 14 }, { wch: 24 }, { wch: 9 }, { wch: 15 }, { wch: 15 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws0, '품의서');

    /* 예산 사용 계획 sheet */
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['비용 지급 방식', payMethod, null, null, null, null, null, null, null], [],
      ['[집행계정]', null, null, null, null, null, null, null, null],
      ['구분', '월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액 (원)', '현재잔액 (원)', '집행금액 (원)'],
      ...execRows.map((r) => ['집행계정', r.month, r.cc, r.ccName, r.accCode, r.accName, toNum(r.budget), toNum(r.balance), toNum(r.amount)]),
      [],
      ['[계정간 전용]', null, null, null, null, null, null, null, null],
      ['구분', '월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액 (원)', '현재잔액 (원)', '이월/전용액 (원)'],
      ...accountTransferRows.map((r) => [r.type, r.month, r.cc, r.ccName, r.accCode, r.accName, toNum(r.budget), toNum(r.balance), toNum(r.transferAmt)]),
      [],
      ['[부서간 전용]', null, null, null, null, null, null, null, null],
      ['구분', '월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액 (원)', '현재잔액 (원)', '이월/전용액 (원)'],
      ...deptTransferRows.map((r) => [r.type, r.month, r.cc, r.ccName, r.accCode, r.accName, toNum(r.budget), toNum(r.balance), toNum(r.transferAmt)]),
      [],
      ['[이월]', null, null, null, null, null, null, null, null],
      ['구분', '월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액 (원)', '현재잔액 (원)', '이월/전용액 (원)'],
      ...carryoverRows.map((r) => [r.type, r.month, r.cc, r.ccName, r.accCode, r.accName, toNum(r.budget), toNum(r.balance), toNum(r.transferAmt)]),
    ]);
    ws1['!cols'] = [{ wch: 10 }, { wch: 8 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ws1, '예산 사용 계획');

    XLSX.writeFile(wb, `${fileTitle}_${today}.xlsx`);
    showToast('Excel 파일 다운로드 완료');
  }

  function handlePrint() {
    const currentLine = APPROVAL_LINES.find((l) => l.id === selectedLineId) ?? APPROVAL_LINES[0];
    const title = brand && projectName ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}` : '(제목 미입력)';
    const lineSteps = currentLine.steps.map((s) => `${s.type}(${s.name})`).join(' → ');

    function tableRows(rows: AccountRow[]) {
      return rows.map((r) => `<tr><td>집행계정</td><td>${r.month || ''}</td><td>${r.cc || ''}</td><td>${r.ccName || ''}</td><td>${r.accCode || ''}</td><td>${r.accName || ''}</td><td style="text-align:right">${r.budget || ''}</td><td style="text-align:right">${r.balance || ''}</td><td style="text-align:right">${r.amount || ''}</td></tr>`).join('');
    }
    function transferTableRows(rows: TransferRow[]) {
      return rows.map((r) => `<tr><td>${r.type}</td><td>${r.month || ''}</td><td>${r.cc || ''}</td><td>${r.ccName || ''}</td><td>${r.accCode || ''}</td><td>${r.accName || ''}</td><td style="text-align:right">${r.budget || ''}</td><td style="text-align:right">${r.balance || ''}</td><td style="text-align:right">${r.transferAmt || ''}</td></tr>`).join('');
    }
    const acctTableHtml = (caption: string, head: string, body: string) => `
      <p style="font-size:11px;font-weight:600;margin:10px 0 4px;color:#1a3a6e">&lt;${caption}&gt;</p>
      <table><thead><tr><th>구분</th><th>월</th><th>코스트센터</th><th>코스트센터명</th><th>계정코드</th><th>계정명</th><th>배정액</th><th>현재잔액</th><th>${head}</th></tr></thead><tbody>${body}</tbody></table>`;

    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"/><title>광고선전비 정산품의</title>
<style>@page{size:A4;margin:14mm 16mm}*{box-sizing:border-box;margin:0;padding:0}body{font-family:"Malgun Gothic","맑은 고딕",sans-serif;font-size:12px;line-height:1.7;color:#212529}h1{text-align:center;font-size:17px;font-weight:700;letter-spacing:.35em;padding-bottom:10px;margin-bottom:18px;border-bottom:3px double #212529}table{width:100%;border-collapse:collapse;margin-bottom:14px}th,td{border:1px solid #adb5bd;padding:5px 8px;font-size:11px}th{background:#f1f3f5;font-weight:600;white-space:nowrap}.section{margin-bottom:18px;break-inside:avoid}.section-title{font-size:12px;font-weight:700;border-left:3px solid #1a3a6e;padding-left:8px;color:#212529;margin-bottom:8px}.row{display:flex;gap:8px;margin-bottom:4px;padding-left:8px}.row-label{color:#6c757d;min-width:130px;flex-shrink:0}.val{padding-left:8px;white-space:pre-wrap}.budget-head th{background:#1a3a6e;color:#fff;font-weight:500}.footer{margin-top:24px;padding-top:12px;border-top:1px solid #dee2e6;text-align:right;font-size:10px;color:#adb5bd}</style></head><body>
<h1>광고선전비 정산품의</h1>
<table><tbody>
  <tr><th style="width:60px">작성일</th><td colspan="3">${today}</td></tr>
  <tr><th>기안자</th><td>기안자</td><th>소속</th><td>커머셜비용전략파트</td></tr>
  <tr><th>결재선</th><td colspan="3" style="font-size:10px">${currentLine.name} · ${lineSteps}</td></tr>
</tbody></table>
<div class="section"><div class="section-title">1. 품의 제목</div><div class="val">${brand && projectName ? title : '<span style="color:#adb5bd;font-style:italic">(미입력)</span>'}</div></div>
<div class="section"><div class="section-title">2. 사전품의 / 변경품의 명 (품의 번호 포함)</div>
  ${originalDocName ? `<div class="row"><span class="row-label">· 품의 명</span><span>${originalDocName}</span></div>` : ''}
  ${originalDocNo ? `<div class="row"><span class="row-label">· 품의 번호</span><span>${originalDocNo}</span></div>` : ''}
</div>
<div class="section"><div class="section-title">3. 주요 실행 내역</div><div class="val">${executionSummary || '<span style="color:#adb5bd;font-style:italic">(미입력)</span>'}</div></div>
<div class="section"><div class="section-title">4. 캠페인 수행 현황 (별첨 대체 가능)</div><div class="val">${campaignStatus || '<span style="color:#adb5bd;font-style:italic">(미입력 또는 별첨 참조)</span>'}</div></div>
<div class="section"><div class="section-title">5. KPI 달성 여부</div>
  ${kpiItem ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">(1) 항목별 KPI 측정</span><div class="val">${kpiItem}</div></div>` : ''}
  ${kpiBiz ? `<div style="margin-bottom:8px;padding-left:8px"><span style="font-size:11px;font-weight:600">(2) 비즈니스 기여도</span><div class="val">${kpiBiz}</div></div>` : ''}
  ${kpiBrand ? `<div style="padding-left:8px"><span style="font-size:11px;font-weight:600">(3) 브랜드 기여도</span><div class="val">${kpiBrand}</div></div>` : ''}
</div>
<div class="section"><div class="section-title">6. 예산 사용 계획 및 전용 계획</div>
  <div class="row"><span class="row-label">· 비용 지급 방식</span><span>${payMethod || '<span style="color:#adb5bd;font-style:italic">(미입력)</span>'}</span></div>
  <div class="budget-head">
    ${acctTableHtml('집행계정', '집행금액', tableRows(execRows))}
    ${acctTableHtml('계정간 전용', '이월/전용액', transferTableRows(accountTransferRows))}
    ${acctTableHtml('부서간 전용', '이월/전용액', transferTableRows(deptTransferRows))}
    ${acctTableHtml('이월', '이월/전용액', transferTableRows(carryoverRows))}
  </div>
</div>
<div class="footer">삼양식품(주) / 커머셜비용전략파트</div></body></html>`;
    printHtmlInFrame(html);
  }

  const docTitle = brand || projectName || activity
    ? `${brand ? `[${brand}]` : '[브랜드]'} ${projectName ? `[${projectName}]` : '[프로젝트명]'}${activity ? ` (${activity})` : ''}`
    : '';

  const previewContent = (
    <SettlementPreviewDoc
      today={today} selectedLineId={selectedLineId}
      brand={brand} projectName={projectName} activity={activity}
      originalDocName={originalDocName} originalDocNo={originalDocNo}
      executionSummary={executionSummary} campaignStatus={campaignStatus}
      kpiItem={kpiItem} kpiBiz={kpiBiz} kpiBrand={kpiBrand}
      payMethod={payMethod}
      execRows={execRows}
      accountTransferRows={accountTransferRows}
      deptTransferRows={deptTransferRows}
      carryoverRows={carryoverRows}
    />
  );

  return (
    <DocFormShell
      docTitle="광고선전비 정산품의"
      breadcrumbLabel="광고선전비 정산품의"
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
        광고선전비 집행 완료 후 정산 시 작성합니다. 모든 필수 항목(<Box component="span" sx={{ color: 'error.main' }}>*</Box>)을 입력해야 결재 상신이 가능합니다.
      </Alert>

      <Stack spacing={2.5}>
        {/* 1. 품의 제목 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={1} title="품의 제목" required />
          <Box sx={{ p: 2 }}>
            <FieldRow label="브랜드" required fieldRef={brandRef}>
              <Select size="small" fullWidth value={brand} onChange={(e) => { setBrand(e.target.value); }} displayEmpty>
                <MenuItem value=""><em>브랜드 선택</em></MenuItem>
                {['불닭', '삼양라면', '맛있는라면', '짜짜로니'].map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </Select>
            </FieldRow>
            <FieldRow label="프로젝트명" required fieldRef={projectNameRef}>
              <TextField size="small" fullWidth placeholder="예: 2026 불닭 여름 캠페인" value={projectName} onChange={(e) => { setProjectName(e.target.value); }} />
            </FieldRow>
            <FieldRow label="Activity 내역" required fieldRef={activityRef}>
              <TextField size="small" fullWidth placeholder="예: TV CF 및 디지털 광고 정산" value={activity} onChange={(e) => { setActivity(e.target.value); }} />
              <Typography variant="caption" sx={{ color: docTitle ? 'text.secondary' : 'text.disabled', mt: 0.5, display: 'block' }}>
                자동완성 제목: {docTitle || '[브랜드] [프로젝트명] (Activity 내역)'}
              </Typography>
            </FieldRow>
          </Box>
        </Paper>

        {/* 2. 사전품의 / 변경품의 명 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={2} title="사전품의 / 변경품의 명 (품의 번호 포함)" required />
          <Box sx={{ p: 2 }}>
            <FieldRow label="품의 명" required fieldRef={originalDocNameRef}>
              <TextField size="small" fullWidth placeholder="정산 대상 사전품의 또는 변경품의 제목을 입력하세요." value={originalDocName} onChange={(e) => { setOriginalDocName(e.target.value); }} />
            </FieldRow>
            <FieldRow label="품의 번호" required fieldRef={originalDocNoRef}>
              <TextField size="small" fullWidth placeholder="예: AP-2026-00123" value={originalDocNo} onChange={(e) => { setOriginalDocNo(e.target.value); }} />
            </FieldRow>
          </Box>
        </Paper>

        {/* 3. 주요 실행 내역 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={3} title="주요 실행 내역" required />
          <Box ref={executionSummaryRef} sx={{ p: 2 }}>
            <TextField
              size="small" fullWidth multiline minRows={5}
              placeholder="집행된 광고선전비의 주요 실행 내역을 작성해주세요. (예: 매체별 집행 현황, 실집행 금액, 집행 기간 등)"
              value={executionSummary}
              onChange={(e) => { setExecutionSummary(e.target.value); }}
            />
          </Box>
        </Paper>

        {/* 4. 캠페인 수행 현황 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={4} title="캠페인 수행 현황 (별첨 대체 가능)" />
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: 'text.secondary' }}>
              별첨 자료로 대체 가능합니다. 별첨 제출 시 하단 첨부파일에 등록하세요.
            </Typography>
            <TextField
              size="small" fullWidth multiline minRows={4}
              placeholder="온라인/오프라인 채널별 캠페인 수행 결과, 노출 수, 참여율 등 주요 성과 지표를 작성해주세요."
              value={campaignStatus}
              onChange={(e) => { setCampaignStatus(e.target.value); }}
            />
          </Box>
        </Paper>

        {/* 5. KPI 달성 여부 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={5} title="KPI 달성 여부" required />
          <Box sx={{ p: 2 }}>
            <FieldRow label="(1) 항목별 KPI 측정" required fieldRef={kpiItemRef}>
              <TextField size="small" fullWidth multiline minRows={2} placeholder="사전품의 시 설정한 KPI 대비 실제 달성 결과를 항목별로 작성해주세요." value={kpiItem} onChange={(e) => { setKpiItem(e.target.value); }} />
            </FieldRow>
            <FieldRow label="(2) 비즈니스 기여도" required fieldRef={kpiBizRef}>
              <TextField size="small" fullWidth multiline minRows={2} placeholder="매출, 점유율, 신규 고객 수 등 비즈니스 측면의 실질 기여도" value={kpiBiz} onChange={(e) => { setKpiBiz(e.target.value); }} />
            </FieldRow>
            <FieldRow label="(3) 브랜드 기여도" required fieldRef={kpiBrandRef}>
              <TextField size="small" fullWidth multiline minRows={2} placeholder="인지도, 선호도, 소비자 반응 등 브랜드 측면의 실질 기여도" value={kpiBrand} onChange={(e) => { setKpiBrand(e.target.value); }} />
            </FieldRow>
          </Box>
        </Paper>

        {/* 6. 예산 사용 계획 및 전용 계획 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={6} title="예산 사용 계획 및 전용 계획" required />
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
            <TransferTable rows={accountTransferRows} onUpdate={(id, field, val) => { updateTransferRow(setAccountTransferRows, id, field, val); }} onRemove={(id) => { setAccountTransferRows((prev) => prev.filter((r) => r.id !== id)); }} />
            <Button size="small" variant="outlined" startIcon={<Plus />} onClick={() => { addTransferRow(setAccountTransferRows, nextAccountTransferId); }} sx={{ mt: 1 }}>계정간 전용 행 추가</Button>

            <BudgetCaption title="부서간 전용" />
            <TransferTable rows={deptTransferRows} onUpdate={(id, field, val) => { updateTransferRow(setDeptTransferRows, id, field, val); }} onRemove={(id) => { setDeptTransferRows((prev) => prev.filter((r) => r.id !== id)); }} />
            <Button size="small" variant="outlined" startIcon={<Plus />} onClick={() => { addTransferRow(setDeptTransferRows, nextDeptTransferId); }} sx={{ mt: 1 }}>부서간 전용 행 추가</Button>

            <BudgetCaption title="이월" />
            <TransferTable rows={carryoverRows} onUpdate={(id, field, val) => { updateTransferRow(setCarryoverRows, id, field, val); }} onRemove={(id) => { setCarryoverRows((prev) => prev.filter((r) => r.id !== id)); }} />
            <Button size="small" variant="outlined" startIcon={<Plus />} onClick={() => { addTransferRow(setCarryoverRows, nextCarryoverId); }} sx={{ mt: 1 }}>이월 행 추가</Button>
          </Box>
        </Paper>

        {/* 첨부파일 */}
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <SectionHeader num={<Paperclip size={13} />} title="첨부파일" />
          <Box sx={{ p: 2 }}>
            <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={(e) => { if (e.target.files) setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files!)]); }} />
            <Box onClick={() => { fileInputRef.current?.click(); }} sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>파일을 이곳에 드래그하거나 <Box component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>파일 선택</Box>을 클릭하세요.</Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>캠페인 수행 현황 별첨, 정산 세금계산서, 결과 보고서 등 (개별 파일 50MB 이내)</Typography>
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

/* ---- Preview component ---- */

interface SettlementPreviewProps {
  today: string; selectedLineId: string;
  brand: string; projectName: string; activity: string;
  originalDocName: string; originalDocNo: string;
  executionSummary: string; campaignStatus: string;
  kpiItem: string; kpiBiz: string; kpiBrand: string;
  payMethod: string;
  execRows: AccountRow[];
  accountTransferRows: TransferRow[];
  deptTransferRows: TransferRow[];
  carryoverRows: TransferRow[];
}

function SettlementPreviewDoc({ today, selectedLineId, brand, projectName, activity, originalDocName, originalDocNo, executionSummary, campaignStatus, kpiItem, kpiBiz, kpiBrand, payMethod, execRows, accountTransferRows, deptTransferRows, carryoverRows }: SettlementPreviewProps) {
  const currentLine = APPROVAL_LINES.find((l) => l.id === selectedLineId) ?? APPROVAL_LINES[0];
  const title = brand && projectName ? `[${brand}] ${projectName}${activity ? ` (${activity})` : ''}` : '(제목 미입력)';

  function Empty({ val, placeholder }: { val: string; placeholder?: string }) {
    return val
      ? <Typography variant="body2" sx={{ pl: 1, color: '#495057', whiteSpace: 'pre-wrap' }}>{val}</Typography>
      : <Typography variant="body2" sx={{ pl: 1, color: '#adb5bd', fontStyle: 'italic' }}>{placeholder ?? '(미입력)'}</Typography>;
  }

  function Sec({ title: t, children }: { title: string; children: React.ReactNode }) {
    return (
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, pl: 1, borderLeft: '3px solid #1a3a6e', color: '#212529' }}>{t}</Typography>
        {children}
      </Box>
    );
  }

  function AccountPreviewTable({ rows, amtLabel }: { rows: AccountRow[]; amtLabel: string }) {
    return (
      <Table size="small" sx={{ mb: 1, border: '1px solid', borderColor: '#adb5bd', '& th,& td': { border: '1px solid #adb5bd', px: 1, py: 0.5, fontSize: '0.65rem' } }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#1a3a6e' }}>
            {['구분', '월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액', '현재잔액', amtLabel].map((h) => (
              <TableCell key={h} sx={{ color: '#fff', fontWeight: 500 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 600 }}>집행계정</TableCell>
              <TableCell>{r.month || '-'}</TableCell>
              <TableCell>{r.cc || '-'}</TableCell>
              <TableCell>{r.ccName || '-'}</TableCell>
              <TableCell>{r.accCode || '-'}</TableCell>
              <TableCell>{r.accName || '-'}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>{r.budget || '-'}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>{r.balance || '-'}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>{r.amount || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  function TransferPreviewTable({ rows, amtLabel }: { rows: TransferRow[]; amtLabel: string }) {
    return (
      <Table size="small" sx={{ mb: 1, border: '1px solid', borderColor: '#adb5bd', '& th,& td': { border: '1px solid #adb5bd', px: 1, py: 0.5, fontSize: '0.65rem' } }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#1a3a6e' }}>
            {['구분', '월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액', '현재잔액', amtLabel].map((h) => (
              <TableCell key={h} sx={{ color: '#fff', fontWeight: 500 }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 600 }}>{r.type}</TableCell>
              <TableCell>{r.month || '-'}</TableCell>
              <TableCell>{r.cc || '-'}</TableCell>
              <TableCell>{r.ccName || '-'}</TableCell>
              <TableCell>{r.accCode || '-'}</TableCell>
              <TableCell>{r.accName || '-'}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>{r.budget || '-'}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>{r.balance || '-'}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>{r.transferAmt || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Box sx={{ p: 4, fontFamily: '"Batang", "바탕", serif', lineHeight: 1.8 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 700, pb: 2, mb: 2.5, borderBottom: '3px double #212529', letterSpacing: '0.3em' }}>
        광고선전비 정산품의
      </Typography>
      <Table size="small" sx={{ mb: 3, border: '1px solid', borderColor: '#adb5bd', '& th,& td': { border: '1px solid #adb5bd', px: 1.5, py: 0.75, fontSize: '0.75rem' } }}>
        <TableBody>
          <TableRow>
            <TableCell component="th" sx={{ bgcolor: '#f1f3f5', fontWeight: 600, width: 70 }}>작성일</TableCell>
            <TableCell colSpan={3}>{today}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" sx={{ bgcolor: '#f1f3f5', fontWeight: 600 }}>기안자</TableCell><TableCell>기안자</TableCell>
            <TableCell component="th" sx={{ bgcolor: '#f1f3f5', fontWeight: 600 }}>소속</TableCell><TableCell>커머셜비용전략파트</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" sx={{ bgcolor: '#f1f3f5', fontWeight: 600 }}>결재선</TableCell>
            <TableCell colSpan={3} sx={{ fontSize: '0.7rem' }}>{currentLine.name} &nbsp;·&nbsp; {currentLine.steps.map((s) => `${s.type}(${s.name})`).join(' → ')}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Sec title="1. 품의 제목">
        <Typography variant="body2" sx={{ pl: 1, fontWeight: 500, color: brand && projectName ? '#212529' : '#adb5bd', fontStyle: brand && projectName ? 'normal' : 'italic' }}>{title}</Typography>
      </Sec>

      <Sec title="2. 사전품의 / 변경품의 명 (품의 번호 포함)">
        {[['품의 명', originalDocName], ['품의 번호', originalDocNo]].map(([label, val]) => (
          <Stack key={label} direction="row" spacing={1} sx={{ mb: 0.5, pl: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 80, flexShrink: 0 }}>· {label}</Typography>
            {val ? <Typography variant="body2">{val}</Typography> : <Typography variant="body2" sx={{ color: '#adb5bd', fontStyle: 'italic' }}>(미입력)</Typography>}
          </Stack>
        ))}
      </Sec>

      <Sec title="3. 주요 실행 내역"><Empty val={executionSummary} /></Sec>

      <Sec title="4. 캠페인 수행 현황 (별첨 대체 가능)">
        <Empty val={campaignStatus} placeholder="(미입력 또는 별첨 참조)" />
      </Sec>

      <Sec title="5. KPI 달성 여부">
        {[['(1) 항목별 KPI 측정', kpiItem], ['(2) 비즈니스 기여도', kpiBiz], ['(3) 브랜드 기여도', kpiBrand]].map(([label, val]) => (
          <Box key={label} sx={{ mb: 1.5, pl: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>{label}</Typography>
            <Empty val={val} />
          </Box>
        ))}
      </Sec>

      <Sec title="6. 예산 사용 계획 및 전용 계획">
        <Stack direction="row" spacing={1} sx={{ mb: 1.5, pl: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100, flexShrink: 0 }}>· 비용 지급 방식</Typography>
          {payMethod ? <Typography variant="body2">{payMethod}</Typography> : <Typography variant="body2" sx={{ color: '#adb5bd', fontStyle: 'italic' }}>(미입력)</Typography>}
        </Stack>

        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, mb: 0.5, pl: 1, fontWeight: 600, color: '#1a3a6e' }}>&lt;집행계정&gt;</Typography>
        <AccountPreviewTable rows={execRows} amtLabel="집행금액" />

        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, mb: 0.5, pl: 1, fontWeight: 600, color: '#1a3a6e' }}>&lt;계정간 전용&gt;</Typography>
        <TransferPreviewTable rows={accountTransferRows} amtLabel="이월/전용액" />

        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, mb: 0.5, pl: 1, fontWeight: 600, color: '#1a3a6e' }}>&lt;부서간 전용&gt;</Typography>
        <TransferPreviewTable rows={deptTransferRows} amtLabel="이월/전용액" />

        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, mb: 0.5, pl: 1, fontWeight: 600, color: '#1a3a6e' }}>&lt;이월&gt;</Typography>
        <TransferPreviewTable rows={carryoverRows} amtLabel="이월/전용액" />
      </Sec>

      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #dee2e6', textAlign: 'right' }}>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>삼양식품(주) / 커머셜비용전략파트 · 본 문서는 미리보기 화면입니다.</Typography>
      </Box>
    </Box>
  );
}
