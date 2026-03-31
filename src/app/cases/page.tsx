'use client';

import { useMemo, useState } from 'react';
import Layout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { filterCases, getDashboardSummary } from '@/lib/legal-dashboard-data';

const statusOptions = ['الكل', 'جارية', 'معلقة', 'مغلقة'] as const;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'short' }).format(new Date(value));

export default function CasesPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statusOptions)[number]>('الكل');

  const cases = useMemo(() => filterCases(query, status), [query, status]);
  const summary = getDashboardSummary();

  return (
    <Layout>
      <div className="space-y-6 text-right">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-slate-950 dark:text-white">إدارة القضايا</CardTitle>
            <CardDescription>
              {summary.totalCases} قضية إجمالاً، مع {summary.urgentCases} ملفات حرجة تحتاج متابعة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button key={option} type="button" variant={status === option ? 'default' : 'outline'} onClick={() => setStatus(option)}>
                  {option}
                </Button>
              ))}
            </div>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث في القضايا..."
              className="bg-slate-50 dark:bg-slate-950"
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((item) => (
            <Card key={item.id} className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-slate-950 dark:text-white">{item.title}</CardTitle>
                <CardDescription>{item.client} - {item.stage}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{item.status}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{item.priority}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">تحديث {formatDate(item.updatedAt)}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">استحقاق {formatDate(item.dueDate)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
