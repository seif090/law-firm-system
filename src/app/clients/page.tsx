'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { filterClients, getDashboardSummary } from '@/lib/legal-dashboard-data';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'short' }).format(new Date(value));

export default function ClientsPage() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const savedQuery = localStorage.getItem('lawpro-clients-query');
    if (savedQuery !== null) setQuery(savedQuery);
  }, []);

  useEffect(() => {
    localStorage.setItem('lawpro-clients-query', query);
  }, [query]);

  const clients = useMemo(() => filterClients(query), [query]);
  const summary = getDashboardSummary();

  return (
    <Layout>
      <div className="space-y-6 text-right">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-950 dark:text-white">قاعدة العملاء</CardTitle>
            <CardDescription>
              {summary.totalClients} عميل مسجل، مع متابعة نشطة لحالة الملفات والتواصل الأخير.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث باسم العميل أو الشركة..."
              className="bg-slate-50 dark:bg-slate-950"
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-slate-950 dark:text-white">{client.name}</CardTitle>
                <CardDescription>{client.company} - {client.city}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>{client.email}</p>
                <p>{client.phone}</p>
                <p>عدد الملفات: {client.matterCount}</p>
                <p>القضايا النشطة: {client.activeCases}</p>
                <p>مستوى المخاطر: {client.riskLevel}</p>
                <p>آخر تواصل: {formatDate(client.lastContact)}</p>
                <Link
                  href={`/clients/${client.id}`}
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  عرض تفاصيل العميل
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
