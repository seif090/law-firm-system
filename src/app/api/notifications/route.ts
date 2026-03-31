import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8', {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('فشل جلب بيانات الإشعارات من المصدر الخارجي');
    }

    type ExternalPost = {
      id: number;
      title: string;
      body: string;
    };

    const posts = (await res.json()) as ExternalPost[];

    const notifications = posts.map((post) => ({
      id: post.id,
      title: `مهمة جديدة: ${post.title}`,
      body: `${post.body.slice(0, 80)}...`,
      read: false,
      url: '/cases',
    }));

    return NextResponse.json({ data: notifications });
  } catch (error) {
    console.error('notifications API error', error);
    return NextResponse.json({ data: [], error: 'تعذر جلب الإشعارات' }, { status: 500 });
  }
}
