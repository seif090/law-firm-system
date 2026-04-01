import Layout from '@/components/layout/main-layout';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { legalCases, legalActivities } from '@/lib/legal-dashboard-data';

type PageProps = {
  params: {
    id: string;
  };
};

export default function CaseDetailsPage({ params }: PageProps) {
  const caseId = Number(params.id);
  const caseItem = legalCases.find((item) => item.id === caseId);

  if (!caseItem) {
    notFound();
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
            {legalActivities.filter((activity) => activity.type === 'case').map((activity) => (
              <div key={activity.id} className="rounded-lg border border-gray-200 p-3 text-right dark:border-gray-700">
                <p className="font-semibold">{activity.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.detail}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(activity.timestamp).toLocaleString('ar-EG')}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
