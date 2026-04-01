import Layout from '@/components/layout/main-layout';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { legalClients } from '@/lib/legal-dashboard-data';

type PageProps = {
  params: {
    id: string;
  };
};

export default function ClientDetailsPage({ params }: PageProps) {
  const clientId = Number(params.id);
  const client = legalClients.find((item) => item.id === clientId);

  if (!client) {
    notFound();
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
      </div>
    </Layout>
  );
}
