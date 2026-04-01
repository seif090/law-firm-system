'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { legalClients } from '@/lib/legal-dashboard-data';
import { useDashboardStore } from '@/store/use-dashboard-store';

type PageProps = {
  params: {
    id: string;
  };
};

export default function ClientDetailsPage({ params }: PageProps) {
  const clientId = Number(params.id);
  const client = legalClients.find((item) => item.id === clientId);
  const timelineFromStore = useDashboardStore((state) => state.getTimelineByEntity('client', clientId));
  const setTimelineByEntity = useDashboardStore((state) => state.setTimelineByEntity);
  const [timeline, setTimeline] = useState<Array<{id:number; title:string; detail:string; timestamp:string}>>(timelineFromStore);

  useEffect(() => {
    if (timelineFromStore.length) {
      setTimeline(timelineFromStore);
    }
  }, [timelineFromStore, setTimelineByEntity]);

  useEffect(() => {
    if (!client) return;

    const fetchTimeline = async () => {
      try {
        const resp = await fetch(`/api/timeline/client/${clientId}`);
        if (!resp.ok) throw new Error('Failed to fetch timeline');
        const json = await resp.json();
        const incomingTimeline = json.timeline || [];
        setTimeline(incomingTimeline);
        setTimelineByEntity('client', clientId, incomingTimeline);
      } catch (error) {
        console.error('Timeline fetch failed', error);
        setTimeline(timelineFromStore);
      }
    };

    fetchTimeline();
  }, [clientId, client, setTimelineByEntity, timelineFromStore]);

  if (!client) {
    return (
      <Layout>
        <div className="text-right p-6 text-red-500">العميل غير موجود.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-right space-y-4">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl">عميل: {client.name}</CardTitle>
            <CardDescription>اسم الشركة: {client.company} | المدينة: {client.city}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <p>البريد الإلكتروني: {client.email}</p>
            <p>الهاتف: {client.phone}</p>
            <p>القضايا الكلية: {client.matterCount}</p>
            <p>القضايا النشطة: {client.activeCases}</p>
            <p>مستوى المخاطر: {client.riskLevel}</p>
            <p>آخر تواصل: {new Date(client.lastContact).toLocaleDateString('ar-EG')}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-xl">Timeline</CardTitle>
            <CardDescription>النشاط الأخير المرتبط بهذا العميل</CardDescription>
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
