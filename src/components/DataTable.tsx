'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

type Column = {
  key: string;
  label: string;
};

type DataTableProps = {
  data: unknown[];
  total: number;
  columns: Column[];
  page: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortOrder: string;
};

export default function DataTable({
  data,
  total,
  columns,
  page,
  pageSize,
  search,
  sortBy,
  sortOrder
}: DataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);

  const updateParams = (params: Record<string, unknown>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newParams.set(key, String(value));
      }
    });

    router.push(`?${newParams.toString()}`);
  };

  console.log(data,'data')
  return (
    <div>
      <input
        className="border p-2 mb-4 border-[#0E253C1A] rounded-[10px]"
        placeholder="Name or language"
        defaultValue={search}
        onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
      />

      <table className="w-full border">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => {
                  const newOrder = sortBy === col.key && sortOrder === 'asc' ? 'desc' : 'asc';
                  updateParams({ sortBy: col.key, sortOrder: newOrder });
                }}
                className="cursor-pointer border px-4 py-2 border-[#0E253C1A] "
              >
                 <p className='flex justify-center w-full'>
                                    {col.label}
                                    {sortBy === col.key ? (sortOrder === 'asc' ?
                                         <Image src={'/sort-1.png'} width={20} height={20} alt='sort' /> :
                                          <Image src={'/sort-2.png'} width={20} height={20} alt='sort' />) : ''}
                                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 border p-2 border-[#0E253C1A]">
              <Image src="/404.avif" width={400} height={200} alt="No data" />
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key} className=" border p-2 border-[#0E253C1A] bg-[#f2f8ff]">
                    <p className='truncate w-[300px]' title={row[col.key]}>
                                                {row[col.key]}
                                            </p>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <button
          disabled={page <= 1}
          onClick={() => updateParams({ page: page - 1 })}
          className="px-3 py-1 border disabled:opacity-50 border-[#0E253C1A] rounded-[10px]"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => updateParams({ page: page + 1 })}
          className="px-3 py-1 border disabled:opacity-50 px-3 py-1 rounded-[10px] border cursor-pointer border-[#0E253C1A]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
