import { data } from '@/constant/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search) ||
      item.language.toLowerCase().includes(search)
  );

  filtered.sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a];
    const bVal = b[sortBy as keyof typeof b];
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    data: paginated,
    total: filtered.length
  });
}
