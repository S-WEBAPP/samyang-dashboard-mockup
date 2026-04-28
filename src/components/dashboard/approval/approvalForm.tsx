'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PrinterIcon } from '@phosphor-icons/react/dist/ssr/Printer';

const approvalSteps = [
  { step: 0, type: '기안', name: '기안자', dept: '' },
  { step: 1, type: '합의', name: '윤선영 팀장', dept: '커머셜비용전략팀/삼양식품(주)' },
  { step: 2, type: '결재', name: '소속부서장', dept: '' },
  { step: 3, type: '수신', name: '커머셜비용전략파트', dept: '커머셜비용전략파트/삼양라운드스퀘어' },
];

const stepColorMap: Record<string, 'default' | 'info' | 'success' | 'secondary'> = {
  기안: 'default',
  합의: 'info',
  결재: 'success',
  수신: 'secondary',
};

function SectionTitle({ num, title }: { num: number; title: string }) {
  return (
    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
      {num}. {title}
    </Typography>
  );
}

function SubLabel({ label }: { label: string }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
      {label}
    </Typography>
  );
}

function TextInput({ placeholder, minRows = 2 }: { placeholder?: string; minRows?: number }) {
  return (
    <TextField
      fullWidth
      multiline
      minRows={minRows}
      placeholder={placeholder}
      size="small"
      variant="outlined"
    />
  );
}

const budgetCols = ['월', '코스트센터', '코스트센터명', '계정코드', '계정명', '배정액', '현재잔액'];

function BudgetTableExec() {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ border: '1px solid', borderColor: 'divider', minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'var(--mui-palette-grey-100)' }}>
            <TableCell />
            {budgetCols.map((col) => (
              <TableCell key={col} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{col}</TableCell>
            ))}
            <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>집행금액</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, bgcolor: 'var(--mui-palette-grey-50)', whiteSpace: 'nowrap' }}>
              집행계정
            </TableCell>
            {[...Array(8)].map((_, i) => (
              <TableCell key={i}>
                <TextField size="small" variant="standard" fullWidth />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}

function BudgetTableTransfer({ title }: { title: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {title}
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ border: '1px solid', borderColor: 'divider', minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--mui-palette-grey-100)' }}>
              <TableCell />
              {budgetCols.map((col) => (
                <TableCell key={col} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{col}</TableCell>
              ))}
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>이월/전용액</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>이월</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {['주는계정', '집행계정'].map((rowType) => (
              <TableRow key={rowType}>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'var(--mui-palette-grey-50)', whiteSpace: 'nowrap' }}>
                  {rowType}
                </TableCell>
                {[...Array(9)].map((_, i) => (
                  <TableCell key={i}>
                    <TextField size="small" variant="standard" fullWidth />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

export function ApprovalForm(): React.JSX.Element {
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          [광고선전비 사전품의]
        </Typography>
        <Button
          size="small"
          startIcon={<PrinterIcon />}
          variant="outlined"
          onClick={() => { window.print(); }}
        >
          인쇄
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 4 }}>
        <Stack spacing={4}>

          {/* 메타 정보 */}
          <Stack spacing={0.5}>
            {[
              { label: '작성자', value: '전자결재 기타 / 공용계정' },
              { label: '인쇄자', value: '커머셜비용전략파트 / 삼양식품(주)' },
              { label: 'Time Zone', value: 'Asia/Seoul/GMT+9' },
            ].map(({ label, value }) => (
              <Stack key={label} direction="row" spacing={2}>
                <Typography variant="body2" sx={{ minWidth: 90, fontWeight: 600 }}>{label}</Typography>
                <Typography variant="body2" color="text.secondary">{value}</Typography>
              </Stack>
            ))}
          </Stack>

          {/* 결재선 */}
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <TableBody>
                {approvalSteps.map((s) => (
                  <TableRow key={s.step}>
                    <TableCell sx={{ width: 40, textAlign: 'center', bgcolor: 'var(--mui-palette-grey-50)' }}>
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: 'text.disabled',
                        fontSize: '0.7rem',
                      }}>
                        {s.step}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: 80 }}>
                      <Chip label={s.type} size="small" color={stepColorMap[s.type]} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{s.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{s.dept}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Divider />

          {/* 1. 품의 제목 */}
          <Box>
            <SectionTitle num={1} title="품의 제목" />
            <Typography variant="caption" color="text.disabled" sx={{ mb: 1, display: 'block' }}>
              [브랜드] [프로젝트명] + (Activity 내용)
            </Typography>
            <TextInput placeholder="품의 제목을 입력하세요" minRows={1} />
          </Box>

          {/* 2. 프로젝트 TYPE */}
          <Box>
            <SectionTitle num={2} title="프로젝트 TYPE" />
            <Typography variant="caption" color="text.disabled" sx={{ mb: 1, display: 'block' }}>
              브랜드 인지도 관리 / 신제품, 브랜드 런칭
            </Typography>
            <TextInput placeholder="프로젝트 타입을 선택하거나 입력하세요" minRows={1} />
          </Box>

          {/* 3. 세부내역 */}
          <Box>
            <SectionTitle num={3} title="세부내역" />
            <Stack spacing={2}>
              {[
                { label: '(1) 활동명', placeholder: '' },
                { label: '(2) 기간', placeholder: '예: 2024.01.01 ~ 2024.03.31' },
                { label: '(3) 대상 국가 / 지역', placeholder: '' },
                { label: '(4) 주요 타겟', placeholder: '' },
                { label: '(5) 총 사용 비용', placeholder: '예: ₩10,000,000' },
              ].map(({ label, placeholder }) => (
                <Box key={label}>
                  <SubLabel label={label} />
                  <TextInput placeholder={placeholder} minRows={1} />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* 4. 목적 및 배경 */}
          <Box>
            <SectionTitle num={4} title="목적 및 배경" />
            <Stack spacing={2}>
              <Box>
                <SubLabel label="(1) 시장 및 경쟁 현황" />
                <TextInput minRows={3} />
              </Box>
              <Box>
                <SubLabel label="(2) 주요 목표" />
                <TextInput minRows={2} />
              </Box>
            </Stack>
          </Box>

          {/* 5. 주요 실행 방안 */}
          <Box>
            <SectionTitle num={5} title="주요 실행 방안" />
            <TextInput minRows={3} />
          </Box>

          {/* 6. 세부 예산 내역 */}
          <Box>
            <SectionTitle num={6} title="세부 예산 내역" />
            <TextInput minRows={4} />
          </Box>

          {/* 7. 업체 비딩 내역 */}
          <Box>
            <SectionTitle num={7} title="업체 비딩 내역" />
            <Stack spacing={2}>
              <Box>
                <SubLabel label="최종 업체 선정 사유" />
                <TextInput minRows={2} />
              </Box>
              <Box>
                <SubLabel label="비딩 생략 근거" />
                <TextInput minRows={2} />
              </Box>
            </Stack>
          </Box>

          {/* 8. 기대효과 및 KPI */}
          <Box>
            <SectionTitle num={8} title="기대효과 및 KPI" />
            <Stack spacing={2}>
              {['(1) 항목별 기대 효과', '(2) 비즈니스 기대 효과', '(3) 브랜드 기대 효과'].map((label) => (
                <Box key={label}>
                  <SubLabel label={label} />
                  <TextInput minRows={2} />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* 9. 예산 사용 계획 및 전용 계획 */}
          <Box>
            <SectionTitle num={9} title="예산 사용 계획 및 전용 계획" />
            <Box sx={{ mb: 3 }}>
              <SubLabel label="비용 지급 방식 (월별 / 선수-중도-잔액 지급 등)" />
              <TextInput minRows={1} />
            </Box>
            <Stack spacing={3}>
              <BudgetTableExec />
              <BudgetTableTransfer title="<계간간 전용>" />
              <BudgetTableTransfer title="<부서간 전용>" />
              <BudgetTableTransfer title="<이월>" />
            </Stack>
          </Box>

          <Divider />

          {/* 버튼 */}
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="inherit">임시저장</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#FF6400', '&:hover': { bgcolor: '#e05a00' } }}
            >
              제출
            </Button>
          </Stack>

        </Stack>
      </Paper>
    </Box>
  );
}
