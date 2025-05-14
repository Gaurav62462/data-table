import DataTable from '@/components/DataTable';

type Column = {
  key: string;
  label: string;
};

const columns: Column[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'language', label: 'Language' },
  { key: 'bio', label: 'Bio' }
];

export default async function UserTablePage({ searchParams }: { searchParams: Record<string, string> }) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const search = searchParams.search || '';
  const sortBy = searchParams.sortBy || 'id';
  const sortOrder = searchParams.sortOrder || 'asc';

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search,
    sortBy,
    sortOrder
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-list?${queryParams.toString()}`, {
    cache: 'no-store'
  });
  const json = await res.json();
  
  console.log(json,'jsonjson')

  return (
    <div className="p-10">
      <DataTable
        columns={columns}
        data={json.data}
        total={json.total}
        page={page}
        pageSize={pageSize}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
}
