import React from "react";

type ResultsTableProps = {
    maxPlayers: number,
    data: any,
};

const ResultsTable = ({ maxPlayers, data }: ResultsTableProps) => {
    let columns = ['Dato'];
    for (let index = 0; index < maxPlayers; index++) {
        columns.push(`#${index + 1}`);
    }

    return (
        <div className={`border-2 border-zinc-300 opacity-80 rounded overflow-x-auto text-left pb-1 my-4 2xl:w-fit 2xl:mx-auto`}>
            <table className="appearance-none border-collapse table-auto">
                <thead>
                    <tr className="bg-zinc-300 text-zinc-500">
                        {columns.map((c, i) => <th key={i} className="px-2 pb-1">{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((d: any, i: number) => {
                        return (
                            <tr key={i}>
                                <td className="px-2 pt-1 whitespace-nowrap">
                                    {d.when}
                                </td>
                                {d.results.map((r: string) => {
                                    return (
                                        <td key={r} className="px-2 whitespace-nowrap">
                                            {r}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
};

export default ResultsTable;