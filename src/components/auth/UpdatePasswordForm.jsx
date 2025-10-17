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

export default function UpdatePasswordForm({ className = '', ...props }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // 密码更新成功后重定向到主页
      window.location.href = '/';
    } catch (error) {
      setError(error.message || '发生了错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">设置新密码</h2>
        <p className="text-gray-600 mt-2">请输入您的新密码以完成密码重置</p>
      </div>
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <form onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-gray-700">新密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入新密码"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
              <Button type="submit" className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? '保存中...' : '保存新密码'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}