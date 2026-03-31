'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the authentication API
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Store the token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">تسجيل الدخول</CardTitle>
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