import Layout from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="space-y-6 text-right">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-950 dark:text-white">الإعدادات</CardTitle>
            <CardDescription>خيارات النشر والتشغيل والمصادقة التجريبية.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-medium text-slate-950 dark:text-white">النشر على Vercel</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                المشروع جاهز كنموذج Next.js مباشر. أضف المتغير <code>NEXT_PUBLIC_API_BASE_URL</code> فقط إذا كان لديك
                backend خارجي.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-medium text-slate-950 dark:text-white">حسابات العرض</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                admin@legalpro.com / admin123
                <br />
                lawyer@legalpro.com / lawyer123
                <br />
                staff@legalpro.com / staff123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
