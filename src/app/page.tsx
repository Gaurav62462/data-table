import DataTable from "@/components/DataTable";

export default function Home() {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'bio', label: 'Bio' },
    { key: 'language', label: 'Language' },
  ];
  return (
    <div className=" items-center justify-items-center min-h-screen p-8 pb-20 ">
      <DataTable columns={columns} />
    </div>
  );
}
