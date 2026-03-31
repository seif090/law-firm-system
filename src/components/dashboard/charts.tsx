'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const demoChartData = [
  { name: 'يناير', cases: 35, clients: 20 },
  { name: 'فبراير', cases: 42, clients: 26 },
  { name: 'مارس', cases: 31, clients: 29 },
  { name: 'أبريل', cases: 48, clients: 34 },
  { name: 'مايو', cases: 55, clients: 38 },
  { name: 'يونيو', cases: 50, clients: 44 },
];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2">نموذج المخطط البياني للقضايا</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={demoChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2">بيانات العملاء والقضايا شهرياً</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={demoChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cases" fill="#3b82f6" />
            <Bar dataKey="clients" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
