import { cn } from "../../lib/utils";
import { createClient } from "../../lib/supabase/client";
import Button from "../ui/Button.jsx";
import {
  Card,
  CardContent,
} from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Label from "../ui/Label.jsx";
import { useState } from "react";

export default function LoginForm({ className = "", ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true); // 默认勾选记住登录状态
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
        {
          // 将记住登录状态选项传递给 Supabase
          remember: rememberMe,
          // 设置更长的过期时间以实现自动登录功能（7天）
          expiresIn: rememberMe ? "7d" : "1h",
        },
      );
      if (error) throw error;

      // 设置localStorage登录状态
      localStorage.setItem("isLoggedIn", "true");
      console.log("登录成功，正在跳转...");

      // 稍微延迟一下以确保 Supabase 客户端完成本地存储写入
      setTimeout(() => {
        window.location.href = "/";
      }, 200);
    } catch (error) {
      // 处理特定的错误消息
      if (error.message.includes("Invalid login credentials")) {
        setError("邮箱或密码错误，请检查后重试");
      } else if (error.message.includes("Email not confirmed")) {
        setError("您的邮箱尚未验证，请检查邮箱并点击验证链接");
      } else if (error.message.includes("Too many requests")) {
        setError("请求过于频繁，请稍后再试");
      } else {
        setError(error.message || "登录失败，请稍后重试");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          欢迎回来
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          请输入您的账号信息以继续
        </p>
      </div>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  邮箱
                </Label>
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
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    密码
                  </Label>
                  <a
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  >
                    忘记密码？
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 dark:bg-gray-800 dark:border-gray-700"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  记住登录状态
                </Label>
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-100 dark:border-red-800/50">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              还没有账户？{" "}
              <a
                href="/auth/sign-up"
                className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
              >
                立即注册
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
