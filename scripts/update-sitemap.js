#!/usr/bin/env node

/**
 * 定期更新sitemap脚本
 * 可以通过cron或定时任务定期运行此脚本
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'https://api-g.lacs.cc';
const SITE_URL = 'https://appfun.fun';
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

async function fetchSoftwareList() {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}/app/software?limit=1000`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          // 根据API响应结构获取软件列表
          const softwareList = result.data?.software || [];
          resolve(softwareList);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function generateSitemap() {
  try {
    // 获取软件列表
    let softwareList = [];
    try {
      console.log('正在获取软件列表...');
      softwareList = await fetchSoftwareList();
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

    // 写入文件
    fs.writeFileSync(SITEMAP_PATH, sitemap);
    
    console.log(`Sitemap已更新: ${SITEMAP_PATH}`);
    console.log(`包含 ${softwareList.length} 个软件页面`);
    
    return {
      success: true,
      softwareCount: softwareList.length,
      sitemapPath: SITEMAP_PATH
    };
  } catch (error) {
    console.error('生成sitemap失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  generateSitemap()
    .then(result => {
      if (result.success) {
        console.log('Sitemap更新成功!');
        process.exit(0);
      } else {
        console.error('Sitemap更新失败:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('运行出错:', error);
      process.exit(1);
    });
}

export { generateSitemap };