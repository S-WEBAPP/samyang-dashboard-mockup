/* Shared types, constants, and utilities for approval form documents */

export type StepType = '기안' | '합의' | '결재' | '수신';

export interface ApprovalStep {
  type: StepType;
  name: string;
  dept: string;
}

export interface ApprovalLineOption {
  id: string;
  name: string;
  tag: string;
  desc: string;
  steps: ApprovalStep[];
}

export interface BudgetRow {
  id: number;
  item: string;
  detail: string;
  qty: string;
  price: string;
  amount: string;
  note: string;
}

export interface AccountRow {
  id: number;
  month: string;
  cc: string;
  ccName: string;
  accCode: string;
  accName: string;
  budget: string;
  balance: string;
  amount: string;
}

export interface TransferRow {
  id: number;
  type: string;
  month: string;
  cc: string;
  ccName: string;
  accCode: string;
  accName: string;
  budget: string;
  balance: string;
  transferAmt: string;
}

export interface ToastState {
  msg: string;
  type: 'success' | 'error' | 'info';
}

export const APPROVAL_LINES: ApprovalLineOption[] = [
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

export const stepColorMap: Record<StepType, 'default' | 'info' | 'success' | 'secondary'> = {
  기안: 'default',
  합의: 'info',
  결재: 'success',
  수신: 'secondary',
};

export function numFmt(v: string): string {
  const digits = v.replace(/\D/g, '');
  return digits ? parseInt(digits, 10).toLocaleString('ko-KR') : '';
}

export function monthFmt(v: string): string {
  return v.replace(/\D/g, '').slice(0, 2);
}

export function printHtmlInFrame(html: string): void {
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

/* Shared XLSX cell styles */
const bThin = { style: 'thin' as const, color: { rgb: 'BFBFBF' } };
const bMed  = { style: 'medium' as const, color: { rgb: '1A3A6E' } };
const bAll  = { top: bThin, bottom: bThin, left: bThin, right: bThin };

export const xlsxStyles = {
  bThin,
  bMed,
  bAll,
  bLeftAccent: { top: bThin, bottom: bThin, left: bMed, right: bThin },
  title: {
    font: { bold: true, sz: 15, name: '맑은 고딕' },
    alignment: { horizontal: 'center', vertical: 'center' },
  },
  section: {
    font: { bold: true, sz: 9, name: '맑은 고딕', color: { rgb: '1A3A6E' } },
    fill: { fgColor: { rgb: 'E8EDF5' }, patternType: 'solid' },
    border: { top: bThin, bottom: bThin, left: bMed, right: bThin },
    alignment: { vertical: 'center' },
  },
  label: {
    font: { bold: true, sz: 9, name: '맑은 고딕', color: { rgb: '495057' } },
    fill: { fgColor: { rgb: 'F1F3F5' }, patternType: 'solid' },
    border: bAll,
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  },
  value: {
    font: { sz: 9, name: '맑은 고딕' },
    border: bAll,
    alignment: { vertical: 'top', wrapText: true },
  },
  budgetHead: {
    font: { bold: true, sz: 9, name: '맑은 고딕', color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '1A3A6E' }, patternType: 'solid' },
    border: bAll,
    alignment: { horizontal: 'center', vertical: 'center' },
  },
  budgetData: {
    font: { sz: 9, name: '맑은 고딕' },
    border: bAll,
    alignment: { vertical: 'center' },
  },
  budgetTotalLabel: {
    font: { bold: true, sz: 9, name: '맑은 고딕' },
    fill: { fgColor: { rgb: 'F0F4FA' }, patternType: 'solid' },
    border: { top: bMed, bottom: bMed, left: bThin, right: bThin },
    alignment: { horizontal: 'right', vertical: 'center' },
  },
  budgetTotalVal: {
    font: { bold: true, sz: 10, name: '맑은 고딕', color: { rgb: '1A3A6E' } },
    fill: { fgColor: { rgb: 'F0F4FA' }, patternType: 'solid' },
    border: { top: bMed, bottom: bMed, left: bThin, right: bThin },
    alignment: { horizontal: 'right', vertical: 'center' },
  },
};
