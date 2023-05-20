import React from "react";

const baseClasses = "py-1 mb-2 rounded w-72 md:w-96 mx-auto ";

const ResultEntryWidget = ({place, nick, bountyNick}: {place: number, nick?: string, bountyNick?: string}) => {
    let dynamicClasses = "border border-cyan-600 text-cyan-300";
    if (!nick) {
        nick = "plass";
        dynamicClasses = "border-2 border-cyan-300 text-zinc-400";
    }
    return (
        <div className={baseClasses + dynamicClasses}>
            {place}. {nick} {bountyNick && `(${bountyNick})`}
        </div>
    );
};

export default ResultEntryWidget;