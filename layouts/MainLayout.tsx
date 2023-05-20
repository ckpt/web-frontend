import Head from "next/head";
import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";

export default function MainLayout({ navbar = true, children }: { navbar?: boolean, children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Casino Kopperud Poker Tour</title>
        <meta name="description" content="Main website of CKPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {navbar && <Navbar />}
      <main className="overflow-x-hidden">
        {children}
      </main>
    </>
  );
}