import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    const supabase = createClient(cookies);

    // 获取查询参数
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status'); // 'active', 'used', 'expired', 'all'

    try {
      let query = supabase
        .from('invitation_codes')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // 根据状态过滤
      if (status === 'active') {
        query = query
          .eq('is_active', true)
          .is('used_at', null)
          .gt('expires_at', new Date().toISOString());
      } else if (status === 'used') {
        query = query.not('used_at', 'is', null);
      } else if (status === 'expired') {
        query = query.lt('expires_at', new Date().toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('获取邀请码列表时发生错误:', error);

        // 如果表不存在，返回模拟数据
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('数据库表不存在，返回模拟邀请码数据');

          const mockInvitations = [
            {
              id: '1',
              code: 'TEST0001',
              created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              expires_at: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
              used_at: null,
              used_by: null,
              used_by_profile_id: null,
              ad_watch_id: 'test-ad-001',
              is_active: true,
              current_uses: 0,
              max_uses: 1
            },
            {
              id: '2',
              code: 'TEST0002',
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              expires_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
              used_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              used_by: 'auth-uuid-123',
              used_by_profile_id: 1001,
              ad_watch_id: 'test-ad-002',
              is_active: false,
              current_uses: 1,
              max_uses: 1
            },
            {
              id: '3',
              code: 'DEMO1234',
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              expires_at: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
              used_at: null,
              used_by: null,
              used_by_profile_id: null,
              ad_watch_id: 'demo-ad-001',
              is_active: true,
              current_uses: 0,
              max_uses: 1
            }
          ];

          return new Response(
            JSON.stringify({
              success: true,
              invitations: mockInvitations,
              total: mockInvitations.length,
              message: '使用模拟数据（数据库表不存在）'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: false,
            error: '获取邀请码列表失败'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          invitations: data || [],
          total: data?.length || 0
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('查询邀请码列表时发生异常:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: '获取邀请码列表失败'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('获取邀请码列表API错误:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
