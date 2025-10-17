import { useState, useEffect, useRef } from 'react';
import { createClient } from '../../lib/supabase/client';
import Button from '../ui/Button.jsx';

export default function AuthButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // 获取用户信息
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = createClient().auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        // 状态变化时关闭菜单
        setMenuOpen(false);
      }
    );

    // 监听点击外部关闭菜单
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // 清除localStorage登录状态
      localStorage.setItem('isLoggedIn', 'false');
      
      window.location.href = '/';
    };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>;
  }

  if (user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors focus:outline-none"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="用户菜单"
        >
          {user.email?.split('@')[0] || '账户'}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="py-1">
              <a
                href="/account"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                个人中心
              </a>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => window.location.href = '/auth/login'}>
        登录
      </Button>
      <Button size="sm" onClick={() => window.location.href = '/auth/sign-up'}>
        注册
      </Button>
    </div>
  );
}