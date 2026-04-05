import { cn } from '../../lib/utils';
import { createClient } from '../../lib/supabase/client';
import Button from '../ui/Button.jsx';
import {
  Card,
  CardContent,
} from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Label from '../ui/Label.jsx';
import { useState } from 'react';

export default function SignUpForm({ className = '', ...props }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // 验证密码长度
    if (password.length < 8) {
      setError('密码长度不能少于8位');
      setIsLoading(false);
      return;
    }

    if (password.length > 16) {
      setError('密码长度不能超过16位');
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError('两次输入的密码不匹配');
      setIsLoading(false);
      return;
    }

    try {
      // 注册用户
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // 注册成功后重定向到成功页面
      window.location.href = '/auth/sign-up-success';
    } catch (error) {
      // 处理特定的错误消息
      if (error.message.includes('User already registered')) {
        setError('该邮箱已被注册，请直接登录或使用其他邮箱');
      } else if (error.message.includes('Password should be at least')) {
        setError('密码长度不符合要求，请设置至少8位密码');
      } else {
        setError(error.message || '注册失败，请稍后重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">创建账号</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">加入我们，获取更多有趣软件内容</p>
      </div>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">密码</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-all"
                  minLength={8}
                  maxLength={16}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">密码长度需在8-16位之间</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password" className="text-gray-700 dark:text-gray-300">确认密码</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-all"
                  minLength={8}
                  maxLength={16}
                />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-100 dark:border-red-800/50">{error}</p>}
              <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? '注册中...' : '注册'}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              已有账户？{' '}
              <a
                href="/auth/login"
                className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
              >
                立即登录
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}