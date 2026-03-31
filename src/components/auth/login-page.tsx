'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

const demoAccounts = [
  {
    email: 'admin@legalpro.com',
    password: 'admin123',
    role: 'admin' as const,
    userName: 'مدير النظام',
  },
  {
    email: 'lawyer@legalpro.com',
    password: 'lawyer123',
    role: 'lawyer' as const,
    userName: 'محامي المكتب',
  },
  {
    email: 'staff@legalpro.com',
    password: 'staff123',
    role: 'staff' as const,
    userName: 'موظف الاستقبال',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (backendBaseUrl) {
        const response = await axios.post(`${backendBaseUrl}/auth/login`, {
          email,
          password,
        });

        localStorage.setItem('token', response.data.token);
        setUser(
          response.data.token,
          response.data.role ?? 'admin',
          response.data.userName ?? 'مدير النظام',
          response.data.userEmail ?? email
        );
      } else {
        const demoUser = demoAccounts.find(
          (account) => account.email === email.trim() && account.password === password
        );

        if (!demoUser) {
          throw new Error('بيانات الدخول غير صحيحة. استخدم أحد الحسابات التجريبية.');
        }

        const token = `demo-${demoUser.role}-${Date.now()}`;
        localStorage.setItem('token', token);
        setUser(token, demoUser.role, demoUser.userName, demoUser.email);
      }

      router.push('/');
      toast({
        title: 'نجاح تسجيل الدخول',
        description: 'تم تسجيل الدخول بنجاح',
      });
    } catch (error: unknown) {
      let message = 'فشل في تسجيل الدخول';

      if (error && typeof error === 'object' && 'response' in error) {
        const typedError = error as Record<string, unknown>;
        const response = typedError.response as Record<string, unknown> | undefined;
        const data = response?.data as Record<string, unknown> | undefined;
        const messageValue = data?.message;

        if (typeof messageValue === 'string') {
          message = messageValue;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: 'خطأ في تسجيل الدخول',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription className="text-center">
            أدخل بياناتك للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
              حسابات العرض: admin@legalpro.com / admin123, lawyer@legalpro.com / lawyer123, staff@legalpro.com / staff123
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
