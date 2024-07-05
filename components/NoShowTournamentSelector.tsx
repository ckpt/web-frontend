import { Tournament } from "@/lib/models/tournaments";
import { faArrowCircleLeft, faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React, { useEffect } from "react";

const NoShowTournamentSelector = ({ tournaments, selected, selectFunc }: { tournaments?: Tournament[], selected: string, selectFunc: React.Dispatch<React.SetStateAction<string>> }) => {

    useEffect(() => {
        if (!selected && tournaments) {
            selectFunc(tournaments[0].uuid);
        }
    }, [selected, tournaments, selectFunc]);

    if (!tournaments) return <p>Ingen turneringer tilgjengelige</p>;
    const tIdx = selected != "" ? tournaments?.findIndex((t) => t.uuid == selected) : 0;
    if (tIdx == -1) return <p>Ugyldig turnering valgt</p>;


    return (
        <div className="p-2 mb-2 border-orange-300 min-w-fit">
            <button className="pr-4 float-left" disabled={tIdx == 0} onClick={(e) => {
                e.preventDefault();
                selectFunc(tournaments[tIdx - 1].uuid);
            }}>
                <FontAwesomeIcon icon={faArrowCircleLeft} size="xl" fixedWidth={true} className='text-orange-300 hover:text-orange-400 pr-1' />
            </button>
            {DateTime.fromISO(tournaments[tIdx].info.scheduled).setLocale("no").toLocaleString(
                { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            )}
            <button className="pl-4 float-right" disabled={tIdx == tournaments.length - 1} onClick={(e) => {
                e.preventDefault();
                selectFunc(tournaments[tIdx + 1].uuid);
            }}>
                <FontAwesomeIcon icon={faArrowCircleRight} size="xl" fixedWidth={true} className='text-orange-300 hover:text-orange-400 pr-1' />
            </button>
        </div>
    )
}

export default NoShowTournamentSelector;
