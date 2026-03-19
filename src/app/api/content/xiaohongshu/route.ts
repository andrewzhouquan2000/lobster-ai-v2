import { NextRequest, NextResponse } from 'next/server';

// 飞书 API 配置
const FEISHU_APP_ID = process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '';

// 飞书 API 基础 URL
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';

// 获取飞书 access_token
async function getFeishuAccessToken(): Promise<string | null> {
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
    console.log('Feishu credentials not configured, using mock mode');
    return null;
  }

  try {
    const response = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    });

    const data = await response.json();
    if (data.code === 0) {
      return data.tenant_access_token;
    }
    return null;
  } catch (error) {
    console.error('Failed to get Feishu access token:', error);
    return null;
  }
}

// 创建飞书文档
async function createFeishuDoc(
  accessToken: string,
  title: string,
  content: string
): Promise<{ docToken: string; url: string } | null> {
  try {
    // 创建文档
    const createResponse = await fetch(`${FEISHU_API_BASE}/docx/v1/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          title: title,
        },
      }),
    });

    const createData = await createResponse.json();
    if (createData.code !== 0) {
      console.error('Failed to create document:', createData);
      return null;
    }

    const docToken = createData.data?.document?.document_id;
    if (!docToken) {
      return null;
    }

    // 设置文档权限 - 允许任何人可读
    try {
      await fetch(`${FEISHU_API_BASE}/drive/v1/permissions/${docToken}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_type: 'openid',
          member_id: 'anyone',
          perm: 'view',
        }),
      });
    } catch (permError) {
      console.log('Failed to set permission, but document was created:', permError);
    }

    // 写入内容
    const blocksResponse = await fetch(
      `${FEISHU_API_BASE}/docx/v1/documents/${docToken}/blocks/${docToken}/children`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          children: [
            {
              block_type: 3, // Heading1
              heading1: {
                elements: [{ text_run: { content: '📝 内容概览' } }],
              },
            },
            {
              block_type: 2, // Text
              text: {
                elements: [{ text_run: { content: content.substring(0, 200) + '...' } }],
              },
            },
            {
              block_type: 22, // Divider
              divider: {},
            },
            {
              block_type: 3, // Heading1
              heading1: {
                elements: [{ text_run: { content: '✨ 正文内容' } }],
              },
            },
            ...content.split('\n\n').map((paragraph) => ({
              block_type: 2, // Text
              text: {
                elements: [{ text_run: { content: paragraph } }],
              },
            })),
          ],
          index: 0,
        }),
      }
    );

    const blocksData = await blocksResponse.json();
    if (blocksData.code !== 0) {
      console.error('Failed to write content:', blocksData);
    }

    return {
      docToken,
      url: `https://tcnqyed0wjde.feishu.cn/docx/${docToken}`,
    };
  } catch (error) {
    console.error('Failed to create Feishu document:', error);
    return null;
  }
}

// 生成小红书内容模板
function generateXiaohongshuContent(topic: string, style: string = '种草'): string {
  const templates: Record<string, { title: string; content: string }> = {
    种草: {
      title: `种草 | ${topic}，真的绝了！`,
      content: `姐妹们！今天必须给大家安利这个 ${topic}！

真的太绝了，用了一段时间，效果完全超出预期！

🌟 亮点一：
使用感超级棒，质感细腻，上手很容易

🌟 亮点二：
效果明显，坚持使用能看到变化

🌟 亮点三：
性价比超高，这个价格真的值

💡 使用小贴士：
- 建议每天坚持使用
- 搭配其他产品效果更好
- 注意使用方法

最后说一句：真的不是广告！纯自费购买，真心推荐！

#${topic} #种草 #推荐 #好物分享`,
    },
    攻略: {
      title: `超详细攻略 | ${topic}，一篇就够了！`,
      content: `整理了超详细的 ${topic} 攻略，建议收藏！

📋 前期准备：
1. 明确目标
2. 收集资料
3. 制定计划

📝 核心要点：
- 第一步：基础了解
- 第二步：实操练习
- 第三步：总结复盘

⚠️ 注意事项：
- 新手容易踩的坑
- 避免常见的错误
- 提高效率的技巧

💰 预算参考：
基础版：xxx元
进阶版：xxx元
专业版：xxx元

🎁 福利：
评论区留言，我会一一回复大家的问题！

#${topic} #攻略 #教程 #干货分享`,
    },
    测评: {
      title: `真实测评 | ${topic}，到底值不值得买？`,
      content: `买了 ${topic} 用了一段时间，来说说真实感受！

📦 开箱体验：
包装很精致，质感不错，第一印象挺好

✅ 优点：
1. 功能齐全，基本需求都能满足
2. 操作简单，上手很快
3. 性价比还可以

❌ 缺点：
1. 某些细节还有优化空间
2. 偶尔会有小bug
3. 配件需要额外购买

💡 适合人群：
- 预算适中的朋友
- 追求性价比的人
- 日常使用需求

📊 评分：
外观：⭐⭐⭐⭐
功能：⭐⭐⭐⭐
性价比：⭐⭐⭐⭐
推荐指数：⭐⭐⭐⭐

总结：整体来说还不错，可以考虑入手！

#${topic} #测评 #真实体验 #产品评测`,
    },
  };

  const template = templates[style] || templates['种草'];
  return `# ${template.title}\n\n${template.content}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, style = '种草' } = body;

    if (!topic) {
      return NextResponse.json(
        { error: '请提供主题' },
        { status: 400 }
      );
    }

    // 生成小红书内容
    const content = generateXiaohongshuContent(topic, style);
    const title = `${topic} - 小红书内容`;

    // 尝试创建飞书文档
    const accessToken = await getFeishuAccessToken();
    
    let result;
    if (accessToken) {
      const docResult = await createFeishuDoc(accessToken, title, content);
      if (docResult) {
        result = {
          success: true,
          type: 'xiaohongshu',
          topic,
          style,
          content,
          docToken: docResult.docToken,
          docUrl: docResult.url,
          message: '✅ 小红书内容已生成并上传到飞书文档',
        };
      } else {
        // 创建文档失败，返回模拟链接
        result = {
          success: true,
          type: 'xiaohongshu',
          topic,
          style,
          content,
          docUrl: `https://tcnqyed0wjde.feishu.cn/docx/mock_${Date.now()}`,
          message: '✅ 小红书内容已生成（飞书文档创建失败，已生成模拟链接）',
          note: '请配置飞书凭证以生成真实文档',
        };
      }
    } else {
      // 没有飞书凭证，返回模拟链接
      const mockDocId = `mock_${Date.now()}`;
      result = {
        success: true,
        type: 'xiaohongshu',
        topic,
        style,
        content,
        docUrl: `https://tcnqyed0wjde.feishu.cn/docx/${mockDocId}`,
        message: '✅ 小红书内容已生成',
        note: '💡 配置飞书凭证后可生成真实文档',
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: '生成内容失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '小红书内容生成 API',
    usage: {
      method: 'POST',
      body: {
        topic: '主题（必填）',
        style: '风格（可选：种草/攻略/测评，默认种草）',
      },
    },
    examples: [
      { topic: '护肤品', style: '种草' },
      { topic: '旅行攻略', style: '攻略' },
      { topic: '蓝牙耳机', style: '测评' },
    ],
  });
}