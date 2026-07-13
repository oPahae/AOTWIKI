import '../styles/globals.css';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
    FaSearch,
    FaHome,
} from "react-icons/fa";
import { GiWalkingBoot } from "react-icons/gi";

import { SOCIAL_LINKS } from '../constants/infos';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const isAHeaderAndFooterPrblmPageSoWeShouldNotDisplayTheFooterAndForTheHeaderWeMustOnlyDisplayHomeIconAndNotTheSearchBar = () => !['/osts', '/songs', '/quiz'].includes(router.pathname)

    return (
        <>
            <Head>
                <title>AOT Wiki — Dedicated to Freedom</title>
                <meta
                    name="description"
                    content="AOT Wiki, your ultimate source for everything about Attack on Titan: characters, Titans, story, timeline, locations, episodes, and more."
                />
                <meta
                    name="keywords"
                    content="Attack on Titan, AOT, Shingeki no Kyojin, wiki, characters, Titans, Eren Yeager, Mikasa, Levi, manga, anime"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://votre-domaine.com" />
                <link rel="icon" href="/general/logo.png" type="image/png" />
                <link rel="shortcut icon" href="/general/logo.png" type="image/png" />
                <link rel="apple-touch-icon" href="/general/logo.png" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="AOT Wiki — Dedicated to Freedom" />
                <meta
                    property="og:description"
                    content="AOT Wiki, your ultimate source for everything about Attack on Titan."
                />
                <meta property="og:image" content="https://votre-domaine.com/general/logo.png" />
                <meta property="og:url" content="https://votre-domaine.com" />
                <meta property="og:site_name" content="AOT Wiki" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AOT Wiki — Dedicated to Freedom" />
                <meta
                    name="twitter:description"
                    content="AOT Wiki, your ultimate source for everything about Attack on Titan."
                />
                <meta name="twitter:image" content="https://votre-domaine.com/general/logo.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Nosifer&family=Cinzel+Decorative:wght@400;700;900&family=UnifrakturMaguntia&family=Metal+Mania&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className='w-full h-screen'>
                <Header showSearchBar={isAHeaderAndFooterPrblmPageSoWeShouldNotDisplayTheFooterAndForTheHeaderWeMustOnlyDisplayHomeIconAndNotTheSearchBar()} />
                <Component {...pageProps} />
                {isAHeaderAndFooterPrblmPageSoWeShouldNotDisplayTheFooterAndForTheHeaderWeMustOnlyDisplayHomeIconAndNotTheSearchBar() && <Footer />}
            </div>
        </>
    )
}

const Header = ({ showSearchBar }) => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');

    return (
        <nav className="fixed top-0 inset-x-0 z-50 ">
            <div className="max-w-[1600px] mx-auto flex items-center justify-end px-4 sm:px-6 lg:px-10 h-16 sm:h-20">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    {showSearchBar &&
                        <>
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2 focus-within:border-red-700/60 transition-colors">
                                <FaSearch className="text-stone-500 text-sm" />
                                <input
                                    placeholder='Search...'
                                    className="bg-transparent outline-none text-sm text-white placeholder-stone-500 w-32 xl:w-44"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            router.push(`/search?key=${encodeURIComponent(searchValue)}`);
                                        }
                                    }}
                                />
                            </div>
                            <Link href='search' className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                <FaSearch className="text-stone-300" />
                            </Link>
                        </>
                    }
                    <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <FaHome className="text-stone-300" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}

const Footer = () => {
    return (
        <footer className="relative bg-black border-t border-white/10 backdrop-blur-md pt-14 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-10">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-8 sm:gap-12 pb-10 sm:pb-14 border-b border-white/10">
                <div className="sm:col-span-2 xl:col-span-2">
                    <span className="font-gothic text-xl sm:text-2xl font-black tracking-wider text-stone-100 [text-shadow:0_0_10px_rgba(120,0,0,0.6)]">
                        AOT <span className="text-red-700">WIKI</span>
                    </span>
                    <p className="text-sm text-stone-500 mt-4 max-w-sm leading-relaxed">
                        A fan-made encyclopedia dedicated to the world of Attack on
                        Titan — characters, Titans, history, and the fight for
                        freedom.
                    </p>
                    <div className="flex items-center gap-3 mt-6">
                        {SOCIAL_LINKS.map(social => (
                            <a
                                key={social.id}
                                href={social.link}
                                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-red-700/80 hover:border-red-700 transition-colors text-sm"
                            >
                                <social.icon className='text-red-600' />
                            </a>
                        )
                        )}
                    </div>
                </div>

                {[
                    {
                        h: "Explore",
                        links: ["Characters", "Map", "Eyecatch"],
                    },
                    {
                        h: "Media",
                        links: ["Episodes", "Osts", "Gallery"],
                    },
                ].map((col) => (
                    <div key={col.h}>
                        <p className="uppercase text-xs tracking-[0.25em] text-stone-500 font-bold mb-4 sm:mb-5">
                            {col.h}
                        </p>
                        <ul className="flex flex-col gap-3">
                            {col.links.map((l) => (
                                <li key={l}>
                                    <a
                                        href={l.toLowerCase()}
                                        className="text-sm text-stone-400 hover:text-red-500 transition-colors"
                                    >
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 text-center sm:text-left">
                <p className="text-xs text-stone-600">
                    © 2026 AOT Wiki. Fan-made project. Not affiliated with Kodansha
                    or WIT.
                </p>
                <div className="flex items-center gap-2 text-stone-600 text-xs">
                    <GiWalkingBoot />
                    <span>Dedicate your hearts to freedom.</span>
                </div>
            </div>
        </footer>
    );
}