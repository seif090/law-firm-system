'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { caseTrendData, getStatusBreakdown } from '@/lib/legal-dashboard-data';

export default function DashboardCharts() {
  const statusBreakdown = getStatusBreakdown();

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg text-slate-950 dark:text-white">نمو القضايا والعملاء</CardTitle>
          <CardDescription>اتجاهات عرضية توضح كيف تتغير المحفظة عبر الأشهر.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={caseTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="#0f172a" strokeWidth={2.5} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="clients" stroke="#0284c7" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg text-slate-950 dark:text-white">توزيع حالات القضايا</CardTitle>
          <CardDescription>مقارنة سريعة بين الملفات الجارية والمعلقة والمغلقة.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusBreakdown} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
