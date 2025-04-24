import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';

import { formatDateTimeForInput } from '../../../utils';

const GET_CHANGELOG = gql`
  query ChangelogByEvent($eventId: String!) {
    changelogByEvent(eventId: $eventId) {
      id
      competitorId
      origin
      type
      previousValue
      newValue
      createdAt
      competitor {
        firstname
        lastname
        status
        lateStart
        note
      }
    }
  }
`;

export const ProtocolTable = ({ eventId }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnOrder, setColumnOrder] = useState([]);

  const { loading, error, data } = useQuery(GET_CHANGELOG, {
    variables: { eventId },
  });

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ getValue }) =>
        formatDateTimeForInput(new Date(parseInt(getValue(), 10))), // hezčí formát datumu
      filterFn: 'betweenDates',
      meta: {
        filterVariant: 'datetime',
      },
    },
    {
      accessorKey: 'competitor.lastname',
      header: 'Lastname',
      cell: ({ row }) => row.original.competitor?.lastname ?? '',
      filterFn: 'includesString',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'competitor.firstname',
      header: 'Firstname',
      cell: ({ row }) => row.original.competitor?.firstname ?? '',
      filterFn: 'includesString',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'origin',
      header: 'Origin',
      meta: {
        filterVariant: 'select',
        options: ['START', 'FINISH', 'IT', 'OFFICE'],
      },
    },
    {
      accessorKey: 'previousValue',
      header: 'Previous Value',
      filterFn: 'includesString',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'newValue',
      header: 'New Value',
      filterFn: 'includesString',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'competitor.status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.competitor?.status;
        if (!status) return null;
        return (
          <span
            className={clsx('px-2 py-1 rounded text-white text-xs', {
              'bg-green-500': status === 'Active' || status === 'OK',
              'bg-orange-400': status === 'Late start',
              'bg-red-600':
                status === 'DidNotStart' ||
                status === 'Disqualified' ||
                status === 'DidNotFinish',
              'bg-zinc-800 ': status === 'Inactive',
            })}
          >
            {status}
          </span>
        );
      },
      meta: {
        filterVariant: 'select',
        options: [
          'OK',
          'DidNotStart',
          'Disqualified',
          'DidNotFinish',
          'Inactive',
        ],
      },
    },
    {
      accessorKey: 'competitor.lateStart',
      header: 'Late Start',
      cell: ({ row }) => row.original.competitor?.lateStart ?? '',
      meta: {
        filterVariant: 'boolean',
      },
    },
    {
      accessorKey: 'competitor.note',
      header: 'Note',
      cell: ({ row }) => row.original.competitor?.note ?? '',
      filterFn: 'includesString',
      meta: {
        filterVariant: 'text',
      },
    },
  ];

  const table = useReactTable({
    data: data?.changelogByEvent ?? [],
    columns,
    state: {
      globalFilter,
      columnOrder,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 overflow-x-auto">
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
        className="ml-2 p-1 border"
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      <input
        value={globalFilter ?? ''}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
        className="p-2 border mb-4 w-full"
      />
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-2 text-left font-bold cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {/* přidáme filtr */}
                  {header.column.getCanFilter() && (
                    <div className="mt-2">
                      {header.column.columnDef.meta?.filterVariant ===
                        'text' && (
                        <input
                          type="text"
                          value={header.column.getFilterValue() ?? ''}
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          placeholder="Filter..."
                          className="p-1 border w-full text-sm"
                        />
                      )}

                      {header.column.columnDef.meta?.filterVariant ===
                        'number' && (
                        <input
                          type="number"
                          value={header.column.getFilterValue() ?? ''}
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          placeholder="Filter number..."
                          className="p-1 border w-full text-sm"
                        />
                      )}

                      {header.column.columnDef.meta?.filterVariant ===
                        'datetime' && (
                        <div className="flex gap-1">
                          <input
                            type="datetime-local"
                            value={header.column.getFilterValue()?.from ?? ''}
                            onChange={(e) =>
                              header.column.setFilterValue((old = {}) => ({
                                ...old,
                                from: e.target.value,
                              }))
                            }
                            className="p-1 border w-full text-sm"
                          />
                          <input
                            type="datetime-local"
                            value={header.column.getFilterValue()?.to ?? ''}
                            onChange={(e) =>
                              header.column.setFilterValue((old = {}) => ({
                                ...old,
                                to: e.target.value,
                              }))
                            }
                            className="p-1 border w-full text-sm"
                          />
                        </div>
                      )}

                      {header.column.columnDef.meta?.filterVariant ===
                        'select' && (
                        <select
                          value={header.column.getFilterValue() ?? ''}
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          className="p-1 border w-full text-sm"
                        >
                          <option value="">Vše</option>
                          {header.column.columnDef.meta?.options?.map(
                            (option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ),
                          )}
                        </select>
                      )}

                      {header.column.columnDef.meta?.filterVariant ===
                        'boolean' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={header.column.getFilterValue() ?? false}
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.checked)
                            }
                            className="form-checkbox"
                          />
                          <span className="text-xs">Yes</span>
                        </div>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end gap-2 mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-2 border rounded"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 border rounded"
        >
          Next
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
};
