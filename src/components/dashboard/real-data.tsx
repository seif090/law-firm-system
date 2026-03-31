'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { legalCases, legalClients } from '@/lib/legal-dashboard-data';

export default function RealData() {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg text-slate-950 dark:text-white">العملاء الحقيقيون</CardTitle>
          <CardDescription>بيانات محلية داخل المشروع، لا تعتمد على أي خدمة خارجية.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          {legalClients.slice(0, 6).map((client) => (
            <div key={client.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
              <p className="font-medium text-slate-950 dark:text-white">{client.name}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{client.email}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {client.company} - {client.city}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg text-slate-950 dark:text-white">القضايا الحية</CardTitle>
          <CardDescription>ملفات مختارة من قاعدة البيانات العرضية للمكتب.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {legalCases.slice(0, 6).map((caseItem) => (
            <div key={caseItem.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-950 dark:text-white">{caseItem.title}</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">{caseItem.status}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{caseItem.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
