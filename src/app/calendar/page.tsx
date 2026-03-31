import Layout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUpcomingDeadlines, legalActivities } from '@/lib/legal-dashboard-data';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'short' }).format(new Date(value));

export default function CalendarPage() {
  const deadlines = getUpcomingDeadlines();

  return (
    <Layout>
      <div className="space-y-6 text-right">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-950 dark:text-white">التقويم والمهام</CardTitle>
            <CardDescription>المواعيد القادمة والأحداث الأخيرة داخل المكتب.</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg text-slate-950 dark:text-white">مواعيد قريبة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deadlines.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.client} - {item.stage}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(item.dueDate)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg text-slate-950 dark:text-white">سجل الأنشطة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {legalActivities.map((activity) => (
                <div key={activity.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <p className="font-medium text-slate-950 dark:text-white">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activity.detail}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(activity.timestamp)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
