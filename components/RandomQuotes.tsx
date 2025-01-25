import { usePlayers } from "@/lib/hooks/players";
import { Player } from "@/lib/models/player";
import React, { useEffect, useRef, useState } from "react";

const pickQuote = (players: Player[] | undefined): { quote: string, by: string } => {
    const quotes = players?.flatMap((value) => {
        return value.quotes?.map((q) => {
            return { 'quote': q, 'by': value.nick };
        });
    });
    if (quotes && quotes.length > 0) {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
    return { quote: '', by: '' };
};

const RandomQuotes = () => {
    const { players } = usePlayers();
    const [q, setQ] = useState({ 'quote': '', 'by': '' });
    const timer = useRef<NodeJS.Timer>();

    useEffect(() => {
        const randomQuote = pickQuote(players);
        if (randomQuote && randomQuote.quote) {
            setQ(randomQuote);
        }
        timer.current = setInterval(() => {
            const randomQuote = pickQuote(players);
            if (randomQuote && randomQuote.quote) {
                setQ(randomQuote);
            }
        }, 10 * 1000);

        return () => {
            clearInterval(timer.current as NodeJS.Timeout);
        };
    }, [players]);


    if (!q || !q.quote) return <></>;
    return (
        <div className='text-zinc-400 mt-6 md:absolute lg:bottom-0 md:right-0 lg:mb-4 lg:mt-0 py-2 px-8 tracking-normal lg:text-lg lg:w-1/3 md:w-1/2'>
            <blockquote className='italic border-l-4 pl-2 border-cyan-300'>{q.quote}</blockquote>
            <p className='float-right'>&#8212; {q.by}</p>
        </div>
    );
};


export default RandomQuotes;
