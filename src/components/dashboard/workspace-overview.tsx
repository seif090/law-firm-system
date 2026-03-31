'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  caseTrendData,
  filterCases,
  filterClients,
  getDashboardSummary,
  getPipelineData,
  getStatusBreakdown,
  getTopClients,
  getUrgentCases,
  getUpcomingDeadlines,
  legalActivities,
  legalNotifications,
} from '@/lib/legal-dashboard-data';
import {
  ArrowRight,
  CalendarClock,
  ClipboardCopy,
  FileText,
  Fingerprint,
  Search,
  ShieldAlert,
  Users,
} from 'lucide-react';

const statusOptions = ['الكل', 'جارية', 'معلقة', 'مغلقة'] as const;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value));

const priorityStyle: Record<string, string> = {
  عالية: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  متوسطة: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  منخفضة: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
};

const severityStyle: Record<string, string> = {
  critical: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
  info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200',
};

export default function WorkspaceOverview() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('الكل');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const summary = getDashboardSummary();
  const filteredCases = useMemo(() => filterCases(query, statusFilter), [query, statusFilter]);
  const filteredClients = useMemo(() => filterClients(query), [query]);
  const pipeline = useMemo(() => getPipelineData(), []);
  const statusBreakdown = useMemo(() => getStatusBreakdown(), []);
  const topClients = useMemo(() => getTopClients(), []);
  const urgentCases = useMemo(() => getUrgentCases(), []);
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(), []);
  const quickNotifications = legalNotifications.slice(0, 3);

  const shareSnapshot = async () => {
    const payload = [
      `القضايا النشطة: ${summary.activeCases}`,
      `العملاء: ${summary.totalClients}`,
      `القضايا العاجلة: ${summary.urgentCases}`,
      `أقرب موعد: ${summary.nextDeadline ? formatDate(summary.nextDeadline) : 'لا يوجد'}`,
    ].join(' | ');

    try {
      await navigator.clipboard.writeText(payload);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('idle');
    }
  };

  const metricCards = [
    { label: 'إجمالي القضايا', value: summary.totalCases, hint: 'تغطية كاملة للملفات المفتوحة والمغلقة', icon: FileText },
    { label: 'القضايا النشطة', value: summary.activeCases, hint: `${summary.pendingCases} ملفات معلقة تحتاج متابعة`, icon: ShieldAlert },
    { label: 'العملاء', value: summary.totalClients, hint: 'شبكة العملاء المسجلين داخل النظام', icon: Users },
    { label: 'المواعيد القادمة', value: summary.upcomingHearings, hint: 'جلسات ومهام قصيرة الأجل', icon: CalendarClock },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-200/70 bg-slate-950 text-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="grid gap-6 p-6 md:grid-cols-[1.6fr_1fr] md:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              <Fingerprint className="h-3.5 w-3.5" />
              مركز قيادة مكتب المحاماة
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                لوحة تشغيل متقدمة للملفات والعملاء والمهام العاجلة
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                متابعة ذكية للقضايا، تنبيهات بالمواعيد القريبة، وتحليل سريع لتوزيع الملفات بحيث ترى
                ما يحتاج تحركاً فورياً بدون التنقل بين الشاشات.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-white text-slate-950 hover:bg-slate-200">
                <Link href="/cases">
                  <ArrowRight className="h-4 w-4" />
                  فتح القضايا
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Link href="/clients">
                  <Users className="h-4 w-4" />
                  إدارة العملاء
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={shareSnapshot}
              >
                <ClipboardCopy className="h-4 w-4" />
                {copyState === 'copied' ? 'تم نسخ الملخص' : 'نسخ ملخص سريع'}
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">أقرب موعد</p>
                <p className="mt-1 text-lg font-semibold">{summary.nextDeadline ? formatDate(summary.nextDeadline) : 'لا يوجد'}</p>
              </div>
              <CalendarClock className="h-5 w-5 text-sky-300" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">قيمة الملفات</p>
                <p className="mt-2 text-2xl font-semibold">
                  {new Intl.NumberFormat('ar-EG').format(summary.totalMatterValue)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">قضايا حرجة</p>
                <p className="mt-2 text-2xl font-semibold">{summary.urgentCases}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-sky-500/15 to-cyan-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200">تنبيه سريع</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {legalNotifications[0].title} - {legalNotifications[0].body}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border-slate-200/80 bg-white/90 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{card.value}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{card.hint}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 p-3 text-white dark:bg-white dark:text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg text-slate-950 dark:text-white">مسار المعالجة</CardTitle>
          <CardDescription>توزيع القضايا داخل رحلة العمل من التحضير حتى التنفيذ.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pipeline.map((stage) => {
            const total = Math.max(summary.totalCases, 1);
            const width = Math.max((stage.value / total) * 100, 8);

            return (
              <div key={stage.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{stage.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">{stage.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-slate-950 dark:bg-white" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <CardTitle className="text-xl text-slate-950 dark:text-white">مستكشف القضايا</CardTitle>
                <CardDescription>ابحث وفلتر الملفات حسب الحالة بدون مغادرة الصفحة.</CardDescription>
              </div>
              <div className="ms-auto flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={statusFilter === option ? 'default' : 'outline'}
                    className={statusFilter === option ? '' : 'bg-transparent'}
                    onClick={() => setStatusFilter(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن قضية، عميل، أو مرحلة..."
                className="pe-10 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {statusBreakdown.map((item) => (
                <div key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.name}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {filteredCases.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle[item.priority]}`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      <p>{item.client}</p>
                      <p className="mt-1">{formatDate(item.dueDate)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{item.stage}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{item.status}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                      آخر تحديث {formatDate(item.updatedAt)}
                    </span>
                  </div>
                </div>
              ))}
              {filteredCases.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  لا توجد نتائج مطابقة للبحث الحالي.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg text-slate-950 dark:text-white">القضايا العاجلة</CardTitle>
              <CardDescription>أعلى الأولويات التي تحتاج معالجة اليوم.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentCases.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle[item.priority]}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.client}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">الاستحقاق {formatDate(item.dueDate)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg text-slate-950 dark:text-white">العملاء الأكثر نشاطاً</CardTitle>
              <CardDescription>العملاء أصحاب أكبر عدد من الملفات المفتوحة.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topClients.map((client) => (
                <div key={client.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950 dark:text-white">{client.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{client.company} - {client.city}</p>
                    </div>
                    <div className="text-left text-sm">
                      <p className="font-semibold text-slate-950 dark:text-white">{client.activeCases} ملف</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">مخاطر {client.riskLevel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg text-slate-950 dark:text-white">التنبيهات السريعة</CardTitle>
              <CardDescription>إشعارات داخلية مرتبطة بأولوية المكتب.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickNotifications.map((note) => (
                <div key={note.id} className={`rounded-2xl border p-3 ${severityStyle[note.severity]}`}>
                  <p className="font-medium">{note.title}</p>
                  <p className="mt-1 text-sm opacity-90">{note.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-slate-950 dark:text-white">الجدول الزمني القريب</CardTitle>
            <CardDescription>قائمة استباقية بالمهام والمواعيد التي تقترب.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.client} - {item.stage}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{formatDate(item.dueDate)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">موعد الاستحقاق</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-slate-950 dark:text-white">سجل النشاطات</CardTitle>
            <CardDescription>آخر التحديثات التي تمت داخل المكتب.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {legalActivities.map((activity) => (
              <div key={activity.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <p className="font-medium text-slate-950 dark:text-white">{activity.title}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{activity.detail}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(activity.timestamp)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg text-slate-950 dark:text-white">اتجاهات المحفظة</CardTitle>
            <CardDescription>قراءة سريعة لتطور القضايا والعملاء خلال الأشهر الأخيرة.</CardDescription>
          </div>
          <div className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            بيانات عرض توضيحي
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {caseTrendData.slice(-3).map((entry) => (
            <div key={entry.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">{entry.name}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-semibold text-slate-950 dark:text-white">{entry.cases}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">قضايا</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-semibold text-slate-950 dark:text-white">{entry.clients}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">عملاء</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-slate-950 dark:text-white">نتائج البحث الحالية</CardTitle>
            <CardDescription>ملفات مطابقة لاستعلامك مع العملاء المتصلين بها.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              النتائج: {filteredCases.length} قضية و {filteredClients.length} عميل
            </div>
            {filteredClients.slice(0, 4).map((client) => (
              <div key={client.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-medium text-slate-950 dark:text-white">{client.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{client.company} - {client.email}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg text-slate-950 dark:text-white">اختصارات سريعة</CardTitle>
            <CardDescription>روابط مباشرة لأهم أماكن العمل داخل النظام.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link href="/cases" className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">إدارة القضايا</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">فتح، فرز، ومتابعة الملفات.</p>
                </div>
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
            </Link>
            <Link href="/clients" className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">قاعدة العملاء</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">السجل التجاري والاتصال.</p>
                </div>
                <Users className="h-5 w-5 text-slate-500" />
              </div>
            </Link>
            <Link href="/calendar" className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">التقويم</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">مواعيد الجلسات والمهام.</p>
                </div>
                <CalendarClock className="h-5 w-5 text-slate-500" />
              </div>
            </Link>
            <button
              type="button"
              onClick={shareSnapshot}
              className="rounded-2xl border border-slate-200 p-4 text-start transition hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">نسخ الملخص</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">مناسب للإرسال السريع داخل المكتب.</p>
                </div>
                <ClipboardCopy className="h-5 w-5 text-slate-500" />
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
