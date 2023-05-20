import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faCommentDots,
    faLightbulb,
    faMedal,
    faMoneyBills,
    faPersonWalkingLuggage,
    faUser,
    faUserGear,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const [isHidden, setHidden] = React.useState(true);
    const { isAdmin } = useAuth();

    const menuItems = [
        {
            name: "Praktisk",
            url: "/practical",
            icon: (
                <FontAwesomeIcon
                    icon={faLightbulb}
                    fixedWidth={true}
                    className="pr-1"
                />
            ),
            adminOnly: false,
        },
        {
            name: "Hall of Fame",
            url: "/awards",
            icon: (
                <FontAwesomeIcon icon={faMedal} fixedWidth={true} className="pr-1" />
            ),
            adminOnly: false,
        },
        {
            name: "Fravær",
            url: "/noshow",
            icon: (
                <FontAwesomeIcon
                    icon={faPersonWalkingLuggage}
                    fixedWidth={true}
                    className="pr-1"
                />
            ),
            adminOnly: false,
        },
        {
            name: "Sladder",
            url: "/rumours",
            icon: (
                <FontAwesomeIcon
                    icon={faCommentDots}
                    fixedWidth={true}
                    className="pr-1"
                />
            ),
            adminOnly: false,
        },
        {
            name: "Gjeld",
            url: "/debt",
            icon: (
                <FontAwesomeIcon
                    icon={faMoneyBills}
                    fixedWidth={true}
                    className="pr-1"
                />
            ),
            adminOnly: false,
        },
        {
            name: 'Admin',
            url: "/admin",
            icon: (
                <FontAwesomeIcon icon={faUserGear} fixedWidth={true} className="pr-1" />
            ),
            adminOnly: true,
        },
        {
            name: 'Min side',
            url: "/profile",
            icon: (
                <FontAwesomeIcon icon={faUser} fixedWidth={true} className="pr-1" />
            ),
            adminOnly: false,
        },
    ];

    return (
        <header>
            <nav
                className="
              flex flex-wrap
              items-center
              justify-between
              w-full
              py-4
              lg:py-0
              px-4
              text-lg text-gray-100
              bg-gray-900
              shadow-md
              shadow-slate-800
            "
            >
                <div>
                    <Link href="/">CKPT {new Date().getFullYear().toString()}</Link>
                </div>

                <button type="button" onClick={() => setHidden(!isHidden)}>
                    <FontAwesomeIcon
                        icon={faBars}
                        id="menu-button"
                        className="h-6 w-6 cursor-pointer lg:!hidden block hover:text-green-300"
                    />
                </button>

                <div
                    className={`${isHidden ? "hidden" : ""
                        } w-full lg:flex lg:items-center lg:w-auto`}
                    id="menu"
                >
                    <ul
                        className="
                  pt-4
                  text-sm text-zinc-400
                  lg:flex
                  lg:justify-between 
                  lg:pt-0
                  "
                    >
                        {menuItems.map((element, i) => {
                            if (element.adminOnly && !isAdmin) return;
                            return (
                                <li key={i}>
                                    <Link
                                        className="align-bottom lg:p-4 py-2 block hover:text-green-300"
                                        href={element.url}
                                    >
                                        {element.icon}
                                        {element.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
