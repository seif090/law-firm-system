'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { getDashboardSummary, getUrgentCases, legalCases, legalClients } from '@/lib/legal-dashboard-data';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  FileText, 
  Users, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Array<{ id: number; title: string; body: string; read: boolean; url: string }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [gotoModalOpen, setGotoModalOpen] = useState(false);
  const [gotoQuery, setGotoQuery] = useState('');
  const [selectedGotoIndex, setSelectedGotoIndex] = useState(0);
  const [newEntityModalOpen, setNewEntityModalOpen] = useState<null | 'case' | 'client'>(null);
  const [newEntityTitle, setNewEntityTitle] = useState('');
  const [newEntityDetails, setNewEntityDetails] = useState('');

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const savedMenu = localStorage.getItem('lawpro-mobileMenuOpen');
    const savedCollapsed = localStorage.getItem('lawpro-collapsedGroups');
    const savedGoto = localStorage.getItem('lawpro-goto-query');
    const savedSearch = localStorage.getItem('lawpro-nav-search');

    if (savedMenu !== null) {
      setIsMobileMenuOpen(savedMenu === 'true');
    }

    if (savedCollapsed) {
      try {
        const parsed = JSON.parse(savedCollapsed) as Record<string, boolean>;
        setCollapsedGroups(parsed);
      } catch (error) {
        console.warn('فشل تحليل collapsedGroups من localStorage', error);
      }
    }

    if (savedGoto !== null) {
      setGotoQuery(savedGoto);
    }

    if (savedSearch !== null) {
      setSearchQuery(savedSearch);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lawpro-nav-search', searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    localStorage.setItem('lawpro-goto-query', gotoQuery);
  }, [gotoQuery]);

  useEffect(() => {
    localStorage.setItem('lawpro-mobileMenuOpen', String(isMobileMenuOpen));
  }, [isMobileMenuOpen]);

  useEffect(() => {
    localStorage.setItem('lawpro-collapsedGroups', JSON.stringify(collapsedGroups));
  }, [collapsedGroups]);

  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const updateNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) throw new Error('فشل جلب الإشعارات');
        const json = await response.json();
        const data: Array<{ id: number; title: string; body: string; read: boolean; url: string }> = json.data || [];
        setNotifications(data);
        setUnreadCount(data.filter((item) => !item.read).length);
      } catch (error) {
        console.error('Notification fetch error', error);
      }
    };

    updateNotifications();

    let pollingTimer: number | undefined;
    let stream: EventSource | null = null;
    let ws: WebSocket | null = null;

    const connectSSE = () => {
      if (stream) return;
      stream = new EventSource('/api/notifications/stream');

      stream.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const incoming = Array.isArray(payload) ? payload : payload?.id ? [payload] : [];

          if (incoming.length > 0) {
            setNotifications((prev) => [...incoming, ...prev]);
            setUnreadCount((prev) => prev + incoming.filter((n) => !n.read).length);
          }
        } catch (error) {
          console.error('SSE notification parse error', error);
        }
      };

      stream.onerror = (error) => {
        console.warn('SSE connection error, switching to polling', error);
        stream?.close();
        stream = null;
        pollingTimer = window.setInterval(updateNotifications, 30000);
      };
    };

    const connectWebSocket = () => {
      if (typeof window === 'undefined' || !('WebSocket' in window)) {
        connectSSE();
        return;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${protocol}://${window.location.hostname}:8080`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsConnected(true);
        if (pollingTimer) {
          window.clearInterval(pollingTimer);
          pollingTimer = undefined;
        }
        if (stream) {
          stream.close();
          stream = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.title) {
            const incoming = [{ ...payload, read: payload.read ?? false, id: payload.id ?? Date.now(), url: payload.url ?? '/cases' }];
            setNotifications((prev) => [...incoming, ...prev]);
            setUnreadCount((prev) => prev + incoming.filter((n) => !n.read).length);
          }
        } catch (error) {
          console.error('WS notification parse error', error);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        ws = null;
        pollingTimer = window.setInterval(updateNotifications, 30000);
        connectSSE();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error, falling back to SSE', error);
        setWsConnected(false);
        ws?.close();
        ws = null;
        connectSSE();
      };
    };

    connectWebSocket();

    return () => {
      ws?.close();
      stream?.close();
      if (pollingTimer) {
        window.clearInterval(pollingTimer);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const meta = isMac ? event.metaKey : event.ctrlKey;

      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setGotoModalOpen(true);
        setGotoQuery('');
        setSelectedGotoIndex(0);
        setIsMobileMenuOpen(false);
      }

      if (event.key.toLowerCase() === 'g') {
        event.preventDefault();
        setGotoModalOpen(true);
        setGotoQuery('');
        setSelectedGotoIndex(0);
      }

      if (event.key === 'Escape') {
        setGotoModalOpen(false);
      }


    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { role, userName, userEmail, setUser, clearUser } = useAuth();

  useEffect(() => {
    if (!role) {
      setUser('local-token', 'admin', 'مدير النظام', 'admin@legalpro.com');
    }
  }, [role, setUser]);

  const navItems = [
    {
      group: 'إدارة النظام',
      items: [
        { href: '/', label: 'الرئيسية', icon: Home, roles: ['admin', 'lawyer', 'staff'] },
        { href: '/settings', label: 'الإعدادات', icon: Settings, roles: ['admin'] },
      ],
    },
    {
      group: 'القضايا',
      items: [
        { href: '/cases', label: 'القضايا', icon: FileText, roles: ['admin', 'lawyer'] },
        { href: '/clients', label: 'العملاء', icon: Users, roles: ['admin', 'lawyer', 'staff'] },
        { href: '/calendar', label: 'التقويم', icon: Calendar, roles: ['admin', 'lawyer', 'staff'] },
      ],
    },
  ];

  const accessibleGroups = navItems.map((groupItem) => ({
    ...groupItem,
    items: groupItem.items.filter((item) =>
      !item.roles || (role ? item.roles.includes(role) : true)
    ),
  })).filter((groupItem) => groupItem.items.length > 0);

  const filteredNavItems = accessibleGroups.map((groupItem) => ({
    ...groupItem,
    items: groupItem.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ),
  })).filter((groupItem) => groupItem.items.length > 0);

  const flatNavItems = accessibleGroups.flatMap((groupItem) => groupItem.items);

  const gotoOptions = useMemo(
    () => [
      { label: 'إنشاء قضية جديدة', href: '/create/case' },
      { label: 'إنشاء عميل جديد', href: '/create/client' },
      { label: 'عرض القضايا العاجلة', href: 'action:urgent-cases' },
      { label: 'عرض أفضل العملاء', href: 'action:top-clients' },
      { label: 'أضف تذكير جلسة لـ X', href: 'bot:remind' },
      { label: 'خصص مهمة للموظف', href: 'bot:assign-task' },
      ...flatNavItems.map((item) => ({
        label: item.label,
        href: item.href,
      })),
    ],
    [flatNavItems]
  );

  const performGotoAction = (href: string) => {
    if (href === '/create/case') {
      setNewEntityModalOpen('case');
      return;
    }
    if (href === '/create/client') {
      setNewEntityModalOpen('client');
      return;
    }

    if (href === 'action:urgent-cases') {
      localStorage.setItem('lawpro-cases-status', 'urgent');
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: 'القضايا العاجلة',
          body: 'عرض الحالات ذات الأولوية العالية والمعلقة.',
          read: false,
          url: '/cases',
        },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);
      router.push('/cases');
      return;
    }

    if (href === 'action:top-clients') {
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: 'أعلى العملاء نشاطًا',
          body: 'انتقل وعرض أعلى عملاء بحسب عدد القضايا النشطة.',
          read: false,
          url: '/clients',
        },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);
      router.push('/clients');
      return;
    }

    if (href === 'bot:remind' || href.startsWith('bot:remind:')) {
      const target = href === 'bot:remind' ? 'X' : href.replace('bot:remind:', '');
      const reminderText = `تذكير جلسة لـ ${target} تم إضافة طلب. يمكنك إدارة التفاصيل من لوحة المتابعة.`;
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: 'تذكير جلسة جديد',
          body: reminderText,
          read: false,
          url: '/calendar',
        },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);
      router.push('/calendar');
      return;
    }

    if (href === 'bot:assign-task' || href.startsWith('bot:assign-task:')) {
      const details = href === 'bot:assign-task' ? 'مهمة عامة' : href.replace('bot:assign-task:', '');
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: 'مهمة جديدة',
          body: `تم تعيين: ${details}`,
          read: false,
          url: '/cases',
        },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);
      router.push('/cases');
      return;
    }

    const path = href.trim();

    // دعم /cases/123 و /clients/123
    const caseMatch = path.match(/^\/cases\/(\d+)$/);
    const clientMatch = path.match(/^\/clients\/(\d+)$/);
    if (caseMatch) {
      router.push(path);
      return;
    }
    if (clientMatch) {
      router.push(path);
      return;
    }

    // دعم صيغة الأمر النصي: "case 101" أو "client 3"
    const directCase = href.match(/^case\s+(\d+)$/i);
    const directClient = href.match(/^client\s+(\d+)$/i);
    if (directCase) {
      router.push(`/cases/${directCase[1]}`);
      return;
    }
    if (directClient) {
      router.push(`/clients/${directClient[1]}`);
      return;
    }

    if (path.startsWith('/')) {
      router.push(path);
      return;
    }

    // fallback route
    router.push(href);
  };

  const filteredGotoOptions = useMemo(() => {
    const query = gotoQuery.trim().toLowerCase();
    if (!query) return gotoOptions;
    return gotoOptions.filter((item) =>
      item.label.toLowerCase().includes(query) || item.href.toLowerCase().includes(query)
    );
  }, [gotoOptions, gotoQuery]);

  useEffect(() => {
    if (selectedGotoIndex >= filteredGotoOptions.length) {
      setSelectedGotoIndex(0);
    }
  }, [filteredGotoOptions, selectedGotoIndex]);

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: flatNavItems.find((item) => item.href === `/${segment}`)?.label ?? segment,
      href: `/${arr.slice(0, index + 1).join('/')}`,
    }));

  const dashboardSummary = useMemo(() => getDashboardSummary(), []);
  const urgentCases = useMemo(() => getUrgentCases(), []);

  const activeRouteLabel =
    flatNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? 'لوحة التحكم';

  const isActiveRoute = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const getLinkClasses = (href: string) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition ${
      isActiveRoute(href)
        ? 'bg-blue-500 text-white dark:bg-blue-600'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    }`;
  const handleLogout = () => {
    // Clear authentication store and tokens
    clearUser();
    localStorage.removeItem('token');
    router.push('/login');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
    setUnreadCount(0);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">LegalPro</h1>
          </div>

          {/* Navigation */}
          <div className="px-4 py-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في القائمة..."
              className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <nav className="flex-1 px-2 py-4 space-y-3">
            {filteredNavItems.map((groupItem) => (
              <div key={groupItem.group}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right dark:text-gray-400"
                  onClick={() =>
                    setCollapsedGroups((prev) => ({
                      ...prev,
                      [groupItem.group]: !prev[groupItem.group],
                    }))
                  }
                >
                  {groupItem.group}
                </button>
                <div className={`${collapsedGroups[groupItem.group] ? 'hidden' : 'block'} space-y-1 pl-2`}>
                  {groupItem.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={getLinkClasses(item.href)}
                        onClick={closeMobileMenu}
                      >
                        <Icon className="w-5 h-5 ml-3" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center w-full p-2 text-right">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 text-right">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{userName || 'مدير النظام'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail || 'admin@legalpro.com'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2 mt-2" align="end">
                <DropdownMenuLabel>الحساب</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 ml-2" />
                  الإعدادات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-col">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen((prev) => !prev)} aria-label="Toggle sidebar">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{activeRouteLabel}</h2>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>الرابط:</span>
              <nav aria-label="breadcrumb" className="flex items-center gap-1">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">الرئيسية</Link>
                {breadcrumbs.map((bc) => (
                  <span key={bc.href} className="flex items-center">
                    <span>/</span>
                    <Link href={bc.href} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {bc.label}
                    </Link>
                  </span>
                ))}
              </nav>
            </div>
            <div className="mt-1 flex gap-3 text-xs text-gray-600 dark:text-gray-300">
              <span className="rounded-full bg-orange-100 px-2 py-1 dark:bg-orange-900/30">قضايا عاجلة: {urgentCases.length}</span>
              <span className="rounded-full bg-sky-100 px-2 py-1 dark:bg-sky-900/30">قضايا نشطة: {dashboardSummary.activeCases}</span>
              <span className="rounded-full bg-green-100 px-2 py-1 dark:bg-green-900/30">أقرب استحقاق: {dashboardSummary.nextDeadline || 'لا يوجد'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="rounded-full border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200">
              {wsConnected ? 'WS متصل' : 'SSE / Polling'}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode((prev) => !prev)} aria-label="Toggle theme">
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 mr-2 mt-2" align="end">
                <DropdownMenuLabel>الإشعارات ({unreadCount})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={markAllNotificationsRead} className="justify-between">
                  <span>تمييز الكل كمقروء</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{unreadCount} غير مقروءة</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">لا توجد إشعارات</div>
                ) : (
                  notifications.map((note) => (
                    <DropdownMenuItem
                      key={note.id}
                      onSelect={() => {
                        router.push(note.url);
                        setNotifications((prev) => prev.map((n) => (n.id === note.id ? { ...n, read: true } : n)));
                        setUnreadCount((prev) => Math.max(0, prev - 1));
                      }}
                    >
                      <div className="text-right">
                        <p className="text-sm font-semibold">{note.title} {note.read ? '' : '(جديد)'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{note.body}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2 mt-2" align="end">
                <DropdownMenuLabel>الحساب</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 ml-2" />
                  الإعدادات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {gotoModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">انتقال سريع</h3>
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">اكتب اسم صفحة أو مساراً للانتقال إليه بسرعة.</p>
              <input
                id="goto-input"
                autoFocus
                value={gotoQuery}
                onChange={(e) => {
                  setGotoQuery(e.target.value);
                  setSelectedGotoIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedGotoIndex((prev) => (prev + 1) % Math.max(1, filteredGotoOptions.length));
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedGotoIndex((prev) => (prev - 1 + filteredGotoOptions.length) % Math.max(1, filteredGotoOptions.length));
                  }
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const customPath = gotoQuery.trim();
                    if (customPath.startsWith('/')) {
                      performGotoAction(customPath);
                      setGotoModalOpen(false);
                      return;
                    }

                    // دعم "case 106" و "client 3" مباشرة من الحقل
                    const directCase = customPath.match(/^case\s+(\d+)$/i);
                    const directClient = customPath.match(/^client\s+(\d+)$/i);
                    if (directCase) {
                      performGotoAction(`/cases/${directCase[1]}`);
                      setGotoModalOpen(false);
                      return;
                    }
                    if (directClient) {
                      performGotoAction(`/clients/${directClient[1]}`);
                      setGotoModalOpen(false);
                      return;
                    }

                    // أوامر البوت
                    const remindMatch = customPath.match(/^remind\s+(.+)$/i);
                    if (remindMatch) {
                      performGotoAction(`bot:remind:${remindMatch[1].trim()}`);
                      setGotoModalOpen(false);
                      return;
                    }

                    const assignMatch = customPath.match(/^assign\s+(.+)$/i);
                    if (assignMatch) {
                      performGotoAction(`bot:assign-task:${assignMatch[1].trim()}`);
                      setGotoModalOpen(false);
                      return;
                    }

                    const target = filteredGotoOptions[selectedGotoIndex];
                    if (target) {
                      performGotoAction(target.href);
                      setGotoModalOpen(false);
                    }
                  }
                  if (e.key === 'Escape') {
                    setGotoModalOpen(false);
                  }
                }}
                placeholder="ابحث أو اكتب مسارًا..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <div className="mt-3 max-h-56 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                {filteredGotoOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">لا توجد نتائج.</div>
                ) : (
                  filteredGotoOptions.map((item, index) => (
                    <button
                      type="button"
                      key={item.href}
                      onClick={() => {
                        performGotoAction(item.href);
                        setGotoModalOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 text-sm ${index === selectedGotoIndex ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.href}</div>
                    </button>
                  ))
                )}
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  className="rounded-md bg-gray-200 px-3 py-2 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                  onClick={() => setGotoModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {newEntityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {newEntityModalOpen === 'case' ? 'إضافة قضية جديدة' : 'إضافة عميل جديد'}
              </h3>
              <div className="space-y-3 text-right">
                <input
                  type="text"
                  value={newEntityTitle}
                  onChange={(e) => setNewEntityTitle(e.target.value)}
                  placeholder={newEntityModalOpen === 'case' ? 'عنوان القضية' : 'اسم العميل'}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-right text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
                <textarea
                  value={newEntityDetails}
                  onChange={(e) => setNewEntityDetails(e.target.value)}
                  placeholder={newEntityModalOpen === 'case' ? 'تفاصيل القضية...' : 'تفاصيل العميل...'}
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-right text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
                <div className="flex justify-between gap-2">
                  <button
                    className="rounded-md bg-gray-200 px-3 py-2 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                    onClick={() => setNewEntityModalOpen(null)}
                  >
                    إلغاء
                  </button>
                  <button
                    className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    onClick={() => {
                      if (!newEntityTitle.trim()) return;
                      const id = Date.now();
                      const type = newEntityModalOpen;
                      const itemLabel = type === 'case' ? 'قضية' : 'عميل';
                      setNotifications((prev) => [
                        {
                          id,
                          title: `${itemLabel} جديد: ${newEntityTitle.trim()}`,
                          body: `${itemLabel} تمت إضافته بنجاح. ${newEntityDetails.trim()}`,
                          read: false,
                          url: type === 'case' ? '/cases' : '/clients',
                        },
                        ...prev,
                      ]);
                      setUnreadCount((prev) => prev + 1);
                      setNewEntityTitle('');
                      setNewEntityDetails('');
                      setNewEntityModalOpen(null);
                      setGotoModalOpen(false);
                      router.push(type === 'case' ? '/cases' : '/clients');
                    }}
                  >
                    حفظ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
