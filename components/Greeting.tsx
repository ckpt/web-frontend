import { useAuth } from "@/lib/contexts/auth";
import { usePlayers } from "@/lib/hooks/players";
import { useSeasonStandings } from "@/lib/hooks/seasons";
import { useTournaments } from "@/lib/hooks/tournaments";
import {
    faTrophy,
    faMoneyBill1,
    faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React from "react";

const winningsString = (winnings: number): string => {
    return `${Math.abs(winnings)} i ${winnings < 0 ? "i minus" : "i pluss"}`;
};

const tournamentDateString = (dateString: string): string => {
    const dt = DateTime.fromISO(dateString);
    return dt.setLocale('no').toLocaleString({ month: 'long', day: 'numeric' });
};

const greetingByTime = () => {
    const currentHour = DateTime.now().hour;
    let timeOfDayString: string = 'dag';
    if (currentHour >= 0 && currentHour < 6) {
        timeOfDayString = "natt";
    } else if (currentHour < 9) {
        timeOfDayString = "morgen";
    } else if (currentHour < 16) {
        timeOfDayString = "dag";
    } else if (currentHour < 20) {
        timeOfDayString = "ettermiddag";
    } else if (currentHour >= 21 && currentHour < 24) {
        timeOfDayString = "kveld";
    }
    return timeOfDayString;
};

const Greeting = () => {
    const { user } = useAuth();
    const { players, isLoading: isPlayersLoading } = usePlayers();
    const { standings, isLoading: isStandingsLoading } = useSeasonStandings();
    const { tournaments, isLoading: isTournamentsLoading } = useTournaments();
    const loading = isPlayersLoading || isStandingsLoading || isTournamentsLoading;

    if (loading) return <></>; // TODO: Loading component/skeleton

    const currentPlayer = players?.find(
        (player) => player.user.username === user
    );

    const currentLeader = standings?.byWinnings ? players?.find(
        (player) => player.uuid === standings?.byWinnings[0].uuid
    ) : undefined;

    const myWinnings = standings?.byWinnings ? standings?.byWinnings.find(
        (standing) => standing.uuid === currentPlayer?.uuid
    ) : 0;

    const winningsColorClass = myWinnings && myWinnings?.winnings < 0 ? "text-pink-300" : "text-green-300";

    const nextTournament = tournaments?.filter(
        (t) => t.played === false && t.info.scheduled > DateTime.now().toISO()!).sort((a, b) => {
            if (a.info.scheduled < b.info.scheduled) return -1;
            if (a.info.scheduled === b.info.scheduled) return 0;
            return 1;
        })[0];

    return (
        <div className="text-zinc-200 mt-8 py-2 px-8 tracking-normal lg:text-lg md:w-1/2 md:text-center md:mx-auto">
            <p className="mb-4">
                God {greetingByTime()} <strong>{currentPlayer?.nick}</strong>!
            </p>
            <ul className="space-y-1">
                <li>
                    <FontAwesomeIcon icon={faTrophy} fixedWidth={true} className="pr-2" />
                    <span className="text-orange-300">{currentLeader?.nick ?? "Ingen"}</span> leder årets sesong
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faMoneyBill1}
                        fixedWidth={true}
                        className="pr-2"
                    />
                    Du er <span className={winningsColorClass}>{winningsString(myWinnings?.winnings || 0)}</span>
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faCalendarAlt}
                        fixedWidth={true}
                        className="pr-2"
                    />
                    Neste turnering er <span className="text-green-300">
                        {nextTournament && tournamentDateString(nextTournament?.info.scheduled)}
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default Greeting;
