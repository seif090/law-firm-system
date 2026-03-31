import Layout from '@/components/layout/main-layout';
import DashboardCharts from '@/components/dashboard/charts';
import RealData from '@/components/dashboard/real-data';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col gap-4 text-right">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مرحباً بكم في لوحة التحكم</h1>
        <p className="text-gray-600 dark:text-gray-300">هذه الصفحة الرئيسية لنظام إدارة مكتب المحاماة الخاص بك.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">عرض سريع للمهام</div>
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">إحصائيات العملاء والقضايا</div>
        </div>

        <div className="mt-4">
          <DashboardCharts />
        </div>

        <div className="mt-4">
          <RealData />
        </div>
      </div>
    </Layout>
  );
}

