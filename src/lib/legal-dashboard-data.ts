export type CaseStatus = 'جارية' | 'معلقة' | 'مغلقة';
export type CasePriority = 'عالية' | 'متوسطة' | 'منخفضة';

export type LegalCase = {
  id: number;
  title: string;
  client: string;
  clientId: number;
  status: CaseStatus;
  priority: CasePriority;
  stage: string;
  summary: string;
  dueDate: string;
  hearingDate: string;
  updatedAt: string;
  matterValue: number;
};

export type LegalClient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  matterCount: number;
  activeCases: number;
  riskLevel: 'منخفض' | 'متوسط' | 'مرتفع';
  lastContact: string;
};

export type LegalNotification = {
  id: number;
  title: string;
  body: string;
  read: boolean;
  url: string;
  severity: 'info' | 'warning' | 'critical';
};

export type LegalActivity = {
  id: number;
  title: string;
  detail: string;
  timestamp: string;
  type: 'case' | 'client' | 'task' | 'hearing';
};

export type DashboardSummary = {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  pendingCases: number;
  totalClients: number;
  urgentCases: number;
  upcomingHearings: number;
  totalMatterValue: number;
  nextDeadline: string;
};

const today = new Date();
const daysFromNow = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const dateOnly = (offsetDays: number) => daysFromNow(offsetDays).slice(0, 10);

export const legalClients: LegalClient[] = [
  {
    id: 1,
    name: 'أحمد منصور',
    email: 'ahmed.mansour@example.com',
    phone: '+20 100 123 4567',
    company: 'Manar Trading',
    city: 'Cairo',
    matterCount: 4,
    activeCases: 2,
    riskLevel: 'متوسط',
    lastContact: dateOnly(-2),
  },
  {
    id: 2,
    name: 'ليلى حسن',
    email: 'leila.hassan@example.com',
    phone: '+20 101 222 3311',
    company: 'Nile Logistics',
    city: 'Giza',
    matterCount: 3,
    activeCases: 1,
    riskLevel: 'منخفض',
    lastContact: dateOnly(-1),
  },
  {
    id: 3,
    name: 'سامي عبد السلام',
    email: 'sami.abdelsalam@example.com',
    phone: '+20 102 555 7799',
    company: 'Delta Foods',
    city: 'Alexandria',
    matterCount: 5,
    activeCases: 3,
    riskLevel: 'مرتفع',
    lastContact: dateOnly(-4),
  },
  {
    id: 4,
    name: 'هبة فؤاد',
    email: 'heba.fouad@example.com',
    phone: '+20 103 778 1199',
    company: 'Atlas Real Estate',
    city: 'Mansoura',
    matterCount: 2,
    activeCases: 1,
    riskLevel: 'متوسط',
    lastContact: dateOnly(-3),
  },
  {
    id: 5,
    name: 'محمود ربيع',
    email: 'mahmoud.rabee@example.com',
    phone: '+20 104 404 8080',
    company: 'Blue Horizon',
    city: 'Tanta',
    matterCount: 1,
    activeCases: 1,
    riskLevel: 'منخفض',
    lastContact: dateOnly(-5),
  },
  {
    id: 6,
    name: 'نورا سعيد',
    email: 'nora.saeed@example.com',
    phone: '+20 105 333 2244',
    company: 'Sphinx Media',
    city: 'Cairo',
    matterCount: 3,
    activeCases: 2,
    riskLevel: 'مرتفع',
    lastContact: dateOnly(-2),
  },
];

export const legalCases: LegalCase[] = [
  {
    id: 101,
    title: 'اعتراض على حكم تجاري',
    client: 'أحمد منصور',
    clientId: 1,
    status: 'جارية',
    priority: 'عالية',
    stage: 'المرافعات',
    summary: 'الطعن جاهز للتقديم قبل جلسة الاستئناف القادمة مع استكمال المرفقات.',
    dueDate: dateOnly(2),
    hearingDate: dateOnly(5),
    updatedAt: daysFromNow(-1),
    matterValue: 180000,
  },
  {
    id: 102,
    title: 'تحصيل مستحقات متأخرة',
    client: 'ليلى حسن',
    clientId: 2,
    status: 'جارية',
    priority: 'متوسطة',
    stage: 'التنفيذ',
    summary: 'مخاطبات التنفيذ مستمرة مع متابعة الحجز على المستحقات المتأخرة.',
    dueDate: dateOnly(4),
    hearingDate: dateOnly(9),
    updatedAt: daysFromNow(-2),
    matterValue: 96000,
  },
  {
    id: 103,
    title: 'نزاع إيجاري',
    client: 'سامي عبد السلام',
    clientId: 3,
    status: 'معلقة',
    priority: 'عالية',
    stage: 'التحضير',
    summary: 'بانتظار مستندات الملكية وعقد الإيجار لاستكمال المذكرة القانونية.',
    dueDate: dateOnly(1),
    hearingDate: dateOnly(3),
    updatedAt: daysFromNow(-1),
    matterValue: 124000,
  },
  {
    id: 104,
    title: 'صياغة عقد توزيع',
    client: 'هبة فؤاد',
    clientId: 4,
    status: 'جارية',
    priority: 'منخفضة',
    stage: 'المراجعة النهائية',
    summary: 'تمت مراجعة البنود الأساسية مع إضافة حماية للسرية وعدم المنافسة.',
    dueDate: dateOnly(6),
    hearingDate: dateOnly(12),
    updatedAt: daysFromNow(-3),
    matterValue: 54000,
  },
  {
    id: 105,
    title: 'خلاف توريد تجاري',
    client: 'محمود ربيع',
    clientId: 5,
    status: 'مغلقة',
    priority: 'متوسطة',
    stage: 'مغلقة',
    summary: 'تم الوصول لتسوية ودية وتم حفظ الملف مع تنفيذ الاتفاق.',
    dueDate: dateOnly(-5),
    hearingDate: dateOnly(-2),
    updatedAt: daysFromNow(-7),
    matterValue: 73000,
  },
  {
    id: 106,
    title: 'مخالصة عمالية',
    client: 'نورا سعيد',
    clientId: 6,
    status: 'جارية',
    priority: 'عالية',
    stage: 'الجلسات',
    summary: 'القضية في مسار سريع بسبب اقتراب موعد الجلسة وطلب المستندات.',
    dueDate: dateOnly(0),
    hearingDate: dateOnly(2),
    updatedAt: daysFromNow(-1),
    matterValue: 112000,
  },
  {
    id: 107,
    title: 'مراجعة اتفاقية شراكة',
    client: 'أحمد منصور',
    clientId: 1,
    status: 'جارية',
    priority: 'متوسطة',
    stage: 'التحضير',
    summary: 'يتم تدقيق بنود المخاطر والحوكمة قبل التوقيع النهائي.',
    dueDate: dateOnly(7),
    hearingDate: dateOnly(14),
    updatedAt: daysFromNow(-4),
    matterValue: 150000,
  },
  {
    id: 108,
    title: 'اعتراض ضريبي',
    client: 'سامي عبد السلام',
    clientId: 3,
    status: 'معلقة',
    priority: 'عالية',
    stage: 'انتظار رد',
    summary: 'تم رفع المستندات الأساسية وما زال الرد من الجهة المختصة قيد الانتظار.',
    dueDate: dateOnly(1),
    hearingDate: dateOnly(6),
    updatedAt: daysFromNow(-2),
    matterValue: 205000,
  },
];

export const legalNotifications: LegalNotification[] = [
  {
    id: 201,
    title: 'موعد جلسة خلال 48 ساعة',
    body: 'القضية "مخالصة عمالية" تحتاج تأكيد الحضور وتجهيز الملف.',
    read: false,
    url: '/cases',
    severity: 'critical',
  },
  {
    id: 202,
    title: 'مستند ناقص',
    body: 'عقد الإيجار في نزاع سامي عبد السلام لم يُرفق بعد.',
    read: false,
    url: '/clients',
    severity: 'warning',
  },
  {
    id: 203,
    title: 'تسوية ناجحة',
    body: 'تم إغلاق خلاف التوريد التجاري وتحديث الحالة تلقائياً.',
    read: true,
    url: '/cases',
    severity: 'info',
  },
  {
    id: 204,
    title: 'متابعة عميل',
    body: 'يوصى بالتواصل مع نورا سعيد قبل نهاية الأسبوع.',
    read: false,
    url: '/clients',
    severity: 'warning',
  },
];

export const legalActivities: LegalActivity[] = [
  {
    id: 301,
    title: 'تم تحديث مذكرة الطعن',
    detail: 'أضيفت ملاحظات الشريك القانوني على المسودة النهائية.',
    timestamp: daysFromNow(-1),
    type: 'case',
  },
  {
    id: 302,
    title: 'مكالمة متابعة مع عميل',
    detail: 'تم الاتفاق على إرسال المستندات الناقصة عبر البريد الإلكتروني.',
    timestamp: daysFromNow(-2),
    type: 'client',
  },
  {
    id: 303,
    title: 'جلسة تحضير جديدة',
    detail: 'تمت إضافة الجلسة القادمة إلى التقويم مع تنبيه قبل الموعد بساعتين.',
    timestamp: daysFromNow(-3),
    type: 'hearing',
  },
  {
    id: 304,
    title: 'إقفال مهمة تنفيذ',
    detail: 'تمت مراجعة حالة تنفيذ الحكم وتسجيل النتيجة النهائية.',
    timestamp: daysFromNow(-4),
    type: 'task',
  },
];

export const caseTrendData = [
  { name: 'يناير', cases: 19, clients: 11 },
  { name: 'فبراير', cases: 22, clients: 13 },
  { name: 'مارس', cases: 18, clients: 16 },
  { name: 'أبريل', cases: 25, clients: 19 },
  { name: 'مايو', cases: 29, clients: 23 },
  { name: 'يونيو', cases: 26, clients: 25 },
];

export const getDashboardSummary = (): DashboardSummary => {
  const activeCases = legalCases.filter((item) => item.status !== 'مغلقة').length;
  const closedCases = legalCases.filter((item) => item.status === 'مغلقة').length;
  const pendingCases = legalCases.filter((item) => item.status === 'معلقة').length;
  const urgentCases = legalCases.filter((item) => item.priority === 'عالية').length;
  const upcomingHearings = legalCases.filter((item) => new Date(item.hearingDate) >= today).length;
  const totalMatterValue = legalCases.reduce((sum, item) => sum + item.matterValue, 0);
  const nextDeadline = legalCases
    .filter((item) => new Date(item.dueDate) >= today)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]?.dueDate ?? '';

  return {
    totalCases: legalCases.length,
    activeCases,
    closedCases,
    pendingCases,
    totalClients: legalClients.length,
    urgentCases,
    upcomingHearings,
    totalMatterValue,
    nextDeadline,
  };
};

export const getPipelineData = () => [
  { name: 'التحضير', value: legalCases.filter((item) => item.stage === 'التحضير').length },
  { name: 'الجلسات', value: legalCases.filter((item) => item.stage === 'الجلسات').length },
  { name: 'المرافعات', value: legalCases.filter((item) => item.stage === 'المرافعات').length },
  { name: 'التنفيذ', value: legalCases.filter((item) => item.stage === 'التنفيذ').length },
];

export const getStatusBreakdown = () => [
  { name: 'جارية', value: legalCases.filter((item) => item.status === 'جارية').length },
  { name: 'معلقة', value: legalCases.filter((item) => item.status === 'معلقة').length },
  { name: 'مغلقة', value: legalCases.filter((item) => item.status === 'مغلقة').length },
];

export const getTopClients = () =>
  [...legalClients]
    .sort((a, b) => b.activeCases - a.activeCases || b.matterCount - a.matterCount)
    .slice(0, 4);

export const getUrgentCases = () =>
  [...legalCases]
    .filter((item) => item.priority === 'عالية' || item.status === 'معلقة')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

export const getUpcomingDeadlines = () =>
  [...legalCases]
    .filter((item) => new Date(item.dueDate) >= today)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

export type CasesStatusFilter = 'الكل' | CaseStatus | 'urgent';

export const filterCases = (query: string, status: CasesStatusFilter) =>
  legalCases.filter((item) => {
    const searchable = `${item.title} ${item.client} ${item.summary} ${item.stage}`.toLowerCase();
    const matchesQuery = query.trim() ? searchable.includes(query.trim().toLowerCase()) : true;

    let matchesStatus = true;
    if (status === 'urgent') {
      matchesStatus = item.status === 'معلقة' || item.priority === 'عالية';
    } else if (status !== 'الكل') {
      matchesStatus = item.status === status;
    }

    return matchesQuery && matchesStatus;
  });

export const filterClients = (query: string) =>
  legalClients.filter((item) => {
    const searchable = `${item.name} ${item.email} ${item.company} ${item.city}`.toLowerCase();
    return query.trim() ? searchable.includes(query.trim().toLowerCase()) : true;
  });
