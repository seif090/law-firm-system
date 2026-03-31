'use client';

import { useEffect, useState } from 'react';

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
};

type CaseItem = {
  id: number;
  title: string;
  status: 'جارية' | 'مغلقة';
  summary: string;
  client: string;
};

export default function RealData() {
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsRes, casesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/cases'),
        ]);

        if (!clientsRes.ok || !casesRes.ok) {
          throw new Error('فشل جلب البيانات من API.');
        }

        const clientsJson = await clientsRes.json();
        const casesJson = await casesRes.json();

        setClients(clientsJson.data ?? []);
        setCases(casesJson.data ?? []);
        setError('');
      } catch (err) {
        console.error(err);
        setError('لا يمكن تحميل البيانات الآن. حاول مرة أخرى لاحقاً.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">جاري تحميل البيانات من الخادم...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-2">العملاء الحقيقيون</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">البيانات تأتي من jsonplaceholder.typicode.com</p>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {clients.slice(0, 6).map((client) => (
            <div key={client.id} className="rounded-md border border-gray-100 dark:border-gray-700 p-3">
              <p className="font-semibold text-gray-800 dark:text-gray-100">{client.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">{client.email} | {client.phone}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">{client.company} - {client.city}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-2">القضايا الحقيقية</h3>
        <div className="space-y-2">
          {cases.slice(0, 6).map((caseItem) => (
            <div key={caseItem.id} className="rounded-md border border-gray-100 dark:border-gray-700 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{caseItem.title}</p>
                <span className={`text-xs font-semibold ${caseItem.status === 'جارية' ? 'text-green-600' : 'text-red-400'}`}>
                  {caseItem.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-300">{caseItem.summary}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{caseItem.client}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
