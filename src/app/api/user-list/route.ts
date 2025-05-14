import { data } from '@/constant/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get('page') ?? '1';
  const pageSize = searchParams.get('pageSize') ?? '10';
  const sortBy = searchParams.get('sortBy') ?? 'id';
  const sortOrder = searchParams.get('sortOrder') ?? 'asc';

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a];
    const bVal = b[sortBy as keyof typeof b];
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const start = (parseInt(page) - 1) * parseInt(pageSize);
  const paginated = sorted.slice(start, start + parseInt(pageSize));

  return NextResponse.json({
    data: paginated,
    total: data.length,
  });
}
