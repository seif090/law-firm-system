import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('فشل جلب بيانات العملاء من المصدر الخارجي');
    }

    type ExternalUser = {
      id: number;
      name: string;
      email: string;
      phone: string;
      company?: { name: string };
      address?: { city: string };
    };

    const users = (await res.json()) as ExternalUser[];

    const clients = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company?.name ?? '',
      city: user.address?.city ?? '',
    }));

    return NextResponse.json({ data: clients });
  } catch (error) {
    console.error('clients API error', error);
    return NextResponse.json({ data: [], error: 'تعذر جلب العملاء' }, { status: 500 });
  }
}
