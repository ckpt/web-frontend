import React from "react";
import { Column, useTable } from "react-table";

type TableProps = {
    title: string,
    color: "pink" | "green" | "cyan" | "orange" | "zinc",
    columns: Column[],
    data: any,
};

const Table = ({ title, color, columns, data }: TableProps) => {
    const tableInstance = useTable({ columns, data });
    const colorClasses: { [key: string]: [string, string] } = {
        pink: ['border-pink-100', "bg-pink-100"],
        green: ['border-green-100', "bg-green-100"],
        cyan: ['border-cyan-100', "bg-cyan-100"],
        orange: ['border-orange-300', "bg-orange-300"],
        zinc: ['border-zinc-300', "bg-zinc-300"],
    };

    return (
        <div className={`border-2 opacity-80 ${colorClasses[color][0]} rounded text-left pb-2 mt-4 lg:basis-96 lg:flex-initial lg:mx-2`}>
            <div className={`${colorClasses[color][1]} text-zinc-500 px-2 py-1 mb-2`}>
                {title}
            </div>
            <table {...tableInstance.getTableProps({ className: "border-collapse table-auto" })}>
                <thead>
                    {tableInstance.headerGroups.map((headerGroup) => (
                        /* eslint-disable react/jsx-key */
                        /* the jsx key is provided in the .get*Props() spreads, but eslint doesn't believe you. I believe you. */
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, i) => {
                                let headerClasses = "px-2 pb-1 mb-1";
                                if (i === headerGroup.headers.length - 1) {
                                    headerClasses += " text-right";
                                }
                                return (
                                    /* eslint-disable react/jsx-key */
                                    /* the jsx key is provided in the .get*Props() spreads, but eslint doesn't believe you. I believe you. */
                                    <th {...column.getHeaderProps({ className: headerClasses })}>
                                        {column.render('Header')}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...tableInstance.getTableBodyProps()}>
                    {tableInstance.rows.map((row, i) => {
                        let rowClasses: string | undefined = undefined;
                        if (i == 0) {
                            rowClasses = "text-green-300";
                        } else if (i == tableInstance.rows.length - 1) {
                            rowClasses = "text-pink-300";
                        }
                        tableInstance.prepareRow(row);
                        return (
                            /* eslint-disable react/jsx-key */
                            /* the jsx key is provided in the .get*Props() spreads, but eslint doesn't believe you. I believe you. */
                            <tr {...row.getRowProps({ className: rowClasses })}>
                                {row.cells.map((cell, i) => {
                                    let cellClasses: string = "px-2";
                                    if (i === 1) {
                                        cellClasses += " w-full whitespace-nowrap";
                                    }
                                    else {
                                        cellClasses += " whitespace-nowrap";
                                    }
                                    return (
                                        /* eslint-disable react/jsx-key */
                                        /* the jsx key is provided in the .get*Props() spreads, but eslint doesn't believe you. I believe you. */
                                        <td {...cell.getCellProps({ className: cellClasses })}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;