import { cn } from '../../lib/utils';
import { createClient } from '../../lib/supabase/client';
import Button from '../ui/Button.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Label from '../ui/Label.jsx';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordForm({ className = '', ...props }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    window.location.href = '/auth/login';
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      setError(error.message || '发生了错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {success ? (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">邮件已发送</h2>
            <p className="text-gray-600 mt-2">请检查您的邮箱并按照指示重置密码</p>
          </div>
          <Button
            onClick={handleBack}
            className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            返回登录
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800">重置密码</h2>
            <p className="text-gray-600 mt-2">输入您的邮箱，我们将向您发送重置密码的链接</p>
          </div>
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <form onSubmit={handleForgotPassword}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-700">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入邮箱地址"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
                  <div className="flex space-x-3">
                    <Button type="submit" className="flex-1 h-12 rounded-lg bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? '发送中...' : '发送重置邮件'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isLoading}
                      className="h-12 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      返回
                    </Button>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm text-gray-600">
                  已有账户？{' '}
                  <a href="/auth/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                    立即登录
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}