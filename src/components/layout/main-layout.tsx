'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
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
    const fetchNotifications = async () => {
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

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const meta = isMac ? event.metaKey : event.ctrlKey;

      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsMobileMenuOpen((prev) => !prev);
      }

      if (event.key.toLowerCase() === 'g') {
        event.preventDefault();
        setGotoModalOpen(true);
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

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: flatNavItems.find((item) => item.href === `/${segment}`)?.label ?? segment,
      href: `/${arr.slice(0, index + 1).join('/')}`,
    }));

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
          </div>
          
          <div className="flex items-center space-x-4">
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
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">لا توجد إشعارات</div>
                ) : (
                  notifications.map((note) => (
                    <DropdownMenuItem key={note.id} onSelect={() => router.push(note.url)}>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{note.title}</p>
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
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">اكتب مسارًا للانتقال إليه (مثال: /cases).</p>
              <div className="flex gap-2">
                <input
                  id="goto-input"
                  type="text"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-right text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="/cases"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        router.push(value);
                        setGotoModalOpen(false);
                      }
                    }
                  }}
                />
                <button
                  className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                  onClick={() => {
                    const input = document.getElementById('goto-input') as HTMLInputElement | null;
                    if (input?.value.trim()) {
                      router.push(input.value.trim());
                      setGotoModalOpen(false);
                    }
                  }}
                >
                  انتقال
                </button>
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
