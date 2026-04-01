'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { legalCases } from '@/lib/legal-dashboard-data';
import { useDashboardStore } from '@/store/use-dashboard-store';

type PageProps = {
  params: {
    id: string;
  };
};

export default function CaseDetailsPage({ params }: PageProps) {
  const caseId = Number(params.id);
  const caseItem = legalCases.find((item) => item.id === caseId);
  const timelineFromStore = useDashboardStore((state) => state.getTimelineByEntity('case', caseId));
  const setTimelineByEntity = useDashboardStore((state) => state.setTimelineByEntity);
  const [timeline, setTimeline] = useState<Array<{id: number; title: string; detail: string; timestamp: string}>>(timelineFromStore);

  useEffect(() => {
    if (timelineFromStore.length) {
      setTimeline(timelineFromStore);
    }
  }, [timelineFromStore, setTimelineByEntity]);

  useEffect(() => {
    if (!caseItem) return;

    const fetchTimeline = async () => {
      try {
        const resp = await fetch(`/api/timeline/case/${caseId}`);
        if (!resp.ok) throw new Error('Failed to fetch timeline');
        const json = await resp.json();
        const incomingTimeline = json.timeline || [];
        setTimeline(incomingTimeline);
        setTimelineByEntity('case', caseId, incomingTimeline);
      } catch (error) {
        console.error('Timeline fetch failed', error);
        setTimeline(timelineFromStore);
      }
    };

    fetchTimeline();
  }, [caseId, caseItem, setTimelineByEntity, timelineFromStore]);

  if (!caseItem) {
    return (
      <Layout>
        <div className="text-right p-6 text-red-500">القضية غير موجودة.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-right space-y-4">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl">قضية: {caseItem.title}</CardTitle>
            <CardDescription>رقم الملف: {caseItem.id} | العميل: {caseItem.client}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>المرحلة: {caseItem.stage}</p>
            <p>الحالة: {caseItem.status}</p>
            <p>الأولوية: {caseItem.priority}</p>
            <p>الموعد النهائي: {new Date(caseItem.dueDate).toLocaleDateString('ar-EG')}</p>
            <p>موعد الجلسة: {new Date(caseItem.hearingDate).toLocaleDateString('ar-EG')}</p>
            <p>القيمة: {caseItem.matterValue.toLocaleString('ar-EG')} ج.م</p>
            <p>ملخص: {caseItem.summary}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-xl">Timeline</CardTitle>
            <CardDescription>النشاط الأخير المرتبط بهذه القضية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">لا توجد بيانات Timeline بعد.</p>
            ) : (
              timeline.map((activity) => (
                <div key={activity.id} className="rounded-lg border border-gray-200 p-3 text-right dark:border-gray-700">
                  <p className="font-semibold">{activity.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.detail}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(activity.timestamp).toLocaleString('ar-EG')}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
