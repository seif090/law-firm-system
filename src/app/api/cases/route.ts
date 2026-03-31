import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10', {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('فشل جلب بيانات القضايا من المصدر الخارجي');
    }

    type ExternalPost = {
      id: number;
      userId: number;
      title: string;
      body: string;
    };

    const posts = (await res.json()) as ExternalPost[];

    const cases = posts.map((post) => ({
      id: post.id,
      title: post.title,
      status: post.id % 3 === 0 ? 'مغلقة' : 'جارية',
      summary: post.body.slice(0, 90) + '...',
      client: `عميل ${post.userId}`,
    }));

    return NextResponse.json({ data: cases });
  } catch (error) {
    console.error('cases API error', error);
    return NextResponse.json({ data: [], error: 'تعذر جلب القضايا' }, { status: 500 });
  }
}
