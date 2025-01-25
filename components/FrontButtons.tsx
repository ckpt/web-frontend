import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const Button = ({ color, href, children }: { color: string, href: string, children: string }) => {
    const colorClasses: { [key: string]: string } = {
        pink: 'border-pink-300 text-pink-300 hover:bg-pink-300',
        green: 'border-green-300 text-green-300 hover:bg-green-300',
        cyan: 'border-cyan-300 text-cyan-300 hover:bg-cyan-300',
        orange: 'border-orange-300 text-orange-300 hover:bg-orange-300',
    }
    return (
        <div className={`w-auto lg:flex lg:w-1/3 m-8 p-2 border-2 ${colorClasses[color]} rounded hover:text-gray-900 text-center md:justify-center`}>
            <Link href={href}>
                {children}
                <FontAwesomeIcon icon={faCircleArrowRight} fixedWidth={true} className='pl-1' />
            </Link>
        </div>
    );
};

const FrontButtons = () => {
    return (
        <div className='lg:flex'>
            <Button color='pink' href='/results'>Resultater</Button>
            <Button color='green' href='/calendar'>Kalender</Button>
            <Button color='cyan' href='/'>Nyheter</Button>
            <Button color='orange' href='/players'>Spillerne</Button>
        </div>
    );
}

export default FrontButtons;
