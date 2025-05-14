'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type Column = {
    key: string;
    label: string;
};

type DataTableProps = {
    columns: Column[];
};

interface dataType {
    name:string
    id:string
    language:string
    bio:string
    version:number
}

export default function DataTable({ columns }: DataTableProps) {
    const [data, setData] = useState<dataType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const apiUrl ='api/user-list'

    const fetchData = async () => {
        setLoading(true);
        const url = `${apiUrl}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        const res = await fetch(url);
        const result = await res.json();
        // console.log(result, 'resultresultresult')
        setData(result.data);
        setTotal(result.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page, search, sortBy, sortOrder]);

    const toggleSort = (key: string) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) || item.language.toLowerCase().includes(search.toLowerCase())
      );

    //   console.log(filtered, '<== filtered')

    return (
        <div className="p-4 rounded">
            <input
                type="text"
                placeholder="Name or Language"
                value={search}
                className="mb-4 p-2 border border-[#0E253C1A] rounded-[10px]"
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />

            <table className="w-full">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="border p-2 cursor-pointer border-[#0E253C1A]"
                                onClick={() => toggleSort(col.key)}
                            >
                                <p className='flex justify-center w-full'>
                                    {col.label}
                                    {sortBy === col.key ? (sortOrder === 'asc' ? <Image src={'/sort-1.png'} width={20} height={20} alt='sort' /> : <Image src={'/sort-2.png'} width={20} height={20} alt='sort' />) : ''}
                                </p>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center p-4">
                                Loading...
                            </td>
                        </tr>
                    ) : (
                        filtered.length <= 0 ?
                            <tr>
                                <td colSpan={4} className="text-center">
                                    <Image src="/404.avif" width={400} height={200} alt="No data" />
                                </td>
                            </tr> :
                            (filtered || []).map((row) => (
                                <tr key={row.id}>
                                    {columns.map((col) => (
                                        <td key={col.key} className="border p-2 border-[#0E253C1A] bg-[#f2f8ff]">
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

            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-3 py-1 rounded-[10px] border cursor-pointer border-[#0E253C1A]"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    className="px-3 py-1 border rounded-[10px] cursor-pointer border-[#0E253C1A]"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
