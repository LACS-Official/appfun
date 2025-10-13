import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const API_BASE_URL = 'https://api-g.lacs.cc';
    const SITE_URL = 'https://appfun.fun';
    
    // 获取软件列表
    let softwareList: any[] = [];
    try {
      const response = await fetch(`${API_BASE_URL}/app/software/list?limit=1000`);
      if (response.ok) {
        const data = await response.json();
        softwareList = data.data || [];
      }
    } catch (error) {
      console.error('获取软件列表失败:', error);
    }

    // 获取当前日期
    const currentDate = new Date().toISOString().split('T')[0];

    // 构建sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- 首页 -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/" />
  </url>
  
  <!-- 主要页面 -->
  <url>
    <loc>${SITE_URL}/software</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/software" />
  </url>
  
  <url>
    <loc>${SITE_URL}/ranking</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/ranking" />
  </url>
  
  <url>
    <loc>${SITE_URL}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/search" />
  </url>
  
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/about" />
  </url>
  
  <url>
    <loc>${SITE_URL}/sitemap</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/sitemap" />
  </url>
  
  <!-- 分类页面 -->
  <url>
    <loc>${SITE_URL}/categories/tools</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/tools" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/development</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/development" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/design</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/design" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/multimedia</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/multimedia" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/education</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/education" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/games</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/games" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/security</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/security" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/productivity</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/productivity" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/network</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/network" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/system</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/system" />
  </url>
  
  <url>
    <loc>${SITE_URL}/categories/other</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/categories/other" />
  </url>
`;

    // 添加软件详情页面
    if (softwareList.length > 0) {
      softwareList.forEach((software) => {
        const lastmod = software.updated_at ? 
          new Date(software.updated_at).toISOString().split('T')[0] : 
          currentDate;
        
        sitemap += `
  <url>
    <loc>${SITE_URL}/software/${software.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/software/${software.id}" />
  </url>`;
      });
    }

    sitemap += '\n</urlset>';

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // 缓存1小时
      }
    });
  } catch (error) {
    console.error('生成sitemap失败:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: '生成sitemap失败'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};