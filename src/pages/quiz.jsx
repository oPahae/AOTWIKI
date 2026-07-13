import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
    FaFilm,
    FaCheck,
    FaTimesCircle,
    FaRedo,
    FaArrowLeft,
    FaClock,
} from "react-icons/fa";
import { GiLaurelsTrophy } from "react-icons/gi";

import { SEASON_QUESTIONS, QUESTION_COUNT, ANSWER_TIME_MS, REVEAL_TIME_MS, SEASON_CHOICES } from "../constants/quiz";

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickQuestions() {
    return shuffle(SEASON_QUESTIONS).slice(0, QUESTION_COUNT);
}

function scoreVerdict(pct) {
    if (pct >= 90) return { label: "Frame-Perfect Veteran", color: "text-red-500" };
    if (pct >= 70) return { label: "Binge-Watcher", color: "text-orange-400" };
    if (pct >= 50) return { label: "Casual Viewer", color: "text-yellow-400" };
    return { label: "Needs a Rewatch", color: "text-stone-400" };
}

export default function SeasonsQuiz() {
    const router = useRouter();

    const [runId, setRunId] = useState(0);
    const [questions, setQuestions] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [locked, setLocked] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [barKey, setBarKey] = useState(0);

    const timeoutRef = useRef(null);
    const advanceRef = useRef(null);

    const current = questions ? questions[currentIndex] : null;
    const isLast = questions ? currentIndex === questions.length - 1 : false;

    useEffect(() => {
        setQuestions(pickQuestions());
        setCurrentIndex(0);
        setScore(0);
        setFinished(false);
        setSelected(null);
        setLocked(false);
    }, [runId]);

    useEffect(() => {
        if (!questions || finished) return;
        setSelected(null);
        setLocked(false);
        setBarKey((k) => k + 1);

        timeoutRef.current = setTimeout(() => {
            setLocked(true);
            setSelected(null);
        }, ANSWER_TIME_MS);

        return () => clearTimeout(timeoutRef.current);
    }, [questions, currentIndex, finished]);

    useEffect(() => {
        if (!locked) return;
        advanceRef.current = setTimeout(() => {
            if (isLast) setFinished(true);
            else setCurrentIndex((i) => i + 1);
        }, REVEAL_TIME_MS);
        return () => clearTimeout(advanceRef.current);
    }, [locked]);

    const handleSelect = useCallback(
        (season) => {
            if (locked || !current) return;
            clearTimeout(timeoutRef.current);
            setSelected(season);
            setLocked(true);
            if (season === current.season) setScore((s) => s + 1);
        },
        [locked, current]
    );

    const restart = () => {
        clearTimeout(timeoutRef.current);
        clearTimeout(advanceRef.current);
        setQuestions(null);
        setRunId((r) => r + 1);
    };

    const pct = questions ? Math.round((score / questions.length) * 100) : 0;
    const verdict = useMemo(() => scoreVerdict(pct), [pct]);

    const getButtonState = (season) => {
        if (!locked) return "idle";
        if (season === current.season) return "correct";
        if (season === selected) return "wrong";
        return "muted";
    };

    return (
        <>
            <Head>
                <title>Guess the Season — AOT Wiki Quiz</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Nosifer&family=Cinzel+Decorative:wght@400;700;900&family=UnifrakturMaguntia&family=Metal+Mania&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style jsx global>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.94) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes correctPulse {
          0% { box-shadow: 0 0 0 rgba(34,197,94,0); }
          40% { box-shadow: 0 0 30px rgba(34,197,94,0.65); }
          100% { box-shadow: 0 0 12px rgba(34,197,94,0.35); }
        }
        @keyframes wrongPulse {
          0% { box-shadow: 0 0 0 rgba(220,38,38,0); }
          40% { box-shadow: 0 0 30px rgba(220,38,38,0.65); }
          100% { box-shadow: 0 0 12px rgba(220,38,38,0.35); }
        }
        .font-scream { font-family: 'Nosifer', 'Cinzel Decorative', serif; }
        .font-gothic { font-family: 'Cinzel Decorative', serif; }
        .font-blackletter { font-family: 'UnifrakturMaguntia', serif; }
        .font-metal { font-family: 'Metal Mania', serif; }
        .torn-border {
          border: 2px solid rgba(153, 27, 27, 0.55);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.6), 0 0 25px rgba(140,10,10,0.25), inset 0 0 30px rgba(0,0,0,0.6);
        }
        .crack-overlay {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><path d=%22M10 10 L80 60 L60 120 L140 100 L120 200 L200 180 L180 280%22 stroke=%22rgba(255,255,255,0.06)%22 stroke-width=%221%22 fill=%22none%22/><path d=%22M280 20 L220 90 L260 140 L190 170 L230 250%22 stroke=%22rgba(255,255,255,0.05)%22 stroke-width=%221%22 fill=%22none%22/></svg>');
        }
        .question-card { animation: popIn 0.35s ease-out; }
        .choice-wrong { animation: shakeX 0.4s ease-in-out, wrongPulse 0.6s ease-out forwards; }
        .choice-correct { animation: correctPulse 0.6s ease-out forwards; }
      `}</style>

            <main className="min-h-screen bg-[#0a0908] text-stone-200 font-sans antialiased selection:bg-red-900/60 crack-overlay overflow-x-hidden">
                <section className="relative py-16 px-4 sm:px-6 lg:px-10 min-h-screen flex items-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,10,10,0.22),transparent_55%)] pointer-events-none" />

                    <div className="relative max-w-4xl mx-auto w-full">
                        {!questions ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-24">
                                <FaFilm className="text-4xl text-red-700 animate-pulse" />
                                <p className="font-metal uppercase text-xs tracking-[0.3em] text-stone-500">
                                    Loading trial...
                                </p>
                            </div>
                        ) : !finished ? (
                            <>
                                <div className="flex items-center justify-between gap-3 mb-6">
                                    <button
                                        onClick={() => router.push("/quiz")}
                                        className="flex items-center gap-2 text-stone-500 hover:text-red-500 text-xs sm:text-sm font-semibold uppercase tracking-wide transition-colors"
                                    >
                                        <FaArrowLeft /> Quit
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <FaFilm className="text-red-600" />
                                        <span className="font-metal uppercase text-xs sm:text-sm tracking-[0.3em] text-red-600 font-bold">
                                            Guess the Season
                                        </span>
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-stone-400 tabular-nums">
                                        {score} pts
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 mb-6">
                                    {questions.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < currentIndex
                                                ? "bg-red-700"
                                                : i === currentIndex
                                                    ? "bg-red-500"
                                                    : "bg-white/10"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div key={currentIndex} className="question-card">
                                    <p className="text-center text-stone-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
                                        Question {currentIndex + 1} / {questions.length}
                                    </p>

                                    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 sm:gap-6 items-stretch">
                                        {/* Screenshot */}
                                        <div className="relative rounded-2xl overflow-hidden torn-border aspect-[4/3] lg:aspect-auto lg:min-h-[360px]">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{ backgroundImage: `url(${current.image})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-900/40">
                                                <FaFilm className="text-red-500 text-xs" />
                                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-200">
                                                    Which season?
                                                </span>
                                            </div>

                                            {/* Timer bar */}
                                            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/50">
                                                <div
                                                    key={barKey}
                                                    className="h-full bg-gradient-to-r from-red-700 to-red-500"
                                                    style={{
                                                        animation: `shrinkBar ${ANSWER_TIME_MS}ms linear forwards`,
                                                        animationPlayState: locked ? "paused" : "running",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Answer choices — 2x2 grid of fixed seasons */}
                                        <div className="flex flex-col justify-center gap-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                {SEASON_CHOICES.map((season) => {
                                                    const state = getButtonState(season);
                                                    return (
                                                        <button
                                                            key={season}
                                                            onClick={() => handleSelect(season)}
                                                            disabled={locked}
                                                            className={`relative flex flex-col items-center justify-center gap-1 rounded-xl border px-4 py-6 sm:py-8 font-gothic font-black text-base sm:text-lg transition-all duration-200
                                    ${state === "idle"
                                                                    ? "border-white/10 bg-white/[0.04] hover:bg-red-950/30 hover:border-red-700/50 text-stone-200"
                                                                    : ""
                                                                }
                                    ${state === "correct" ? "choice-correct border-green-600 bg-green-900/30 text-green-400" : ""}
                                    ${state === "wrong" ? "choice-wrong border-red-600 bg-red-900/30 text-red-400" : ""}
                                    ${state === "muted" ? "border-white/5 bg-white/[0.02] text-stone-600" : ""}
                                  `}
                                                        >
                                                            <span>Season {season}</span>
                                                            {state === "correct" && <FaCheck className="text-green-400" />}
                                                            {state === "wrong" && <FaTimesCircle className="text-red-400" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Reveal message */}
                                            <div className="h-8 mt-1 flex items-center justify-center lg:justify-start">
                                                {locked && (
                                                    <p
                                                        className={`text-sm sm:text-base font-bold flex items-center gap-2 ${selected === current.season ? "text-green-400" : "text-red-500"
                                                            }`}
                                                    >
                                                        {selected === current.season ? (
                                                            <>
                                                                <FaCheck /> Correct — Season {current.season}!
                                                            </>
                                                        ) : selected === null ? (
                                                            <>
                                                                <FaClock /> Time's up — it was Season {current.season}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaTimesCircle /> Wrong — it was Season {current.season}
                                                            </>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="question-card text-center rounded-2xl torn-border bg-white/[0.03] backdrop-blur-md p-8 sm:p-12 max-w-lg mx-auto">
                                <GiLaurelsTrophy className="text-5xl sm:text-6xl text-red-600 mx-auto mb-4 drop-shadow-[0_0_18px_rgba(200,20,20,0.6)]" />
                                <p className="font-metal uppercase text-xs sm:text-sm tracking-[0.3em] text-red-600 font-bold mb-2">
                                    Trial Complete
                                </p>
                                <h1 className="font-scream text-3xl sm:text-4xl text-stone-100 [text-shadow:0_0_18px_rgba(120,0,0,0.85)] mb-4">
                                    {score} / {questions.length}
                                </h1>
                                <p className={`font-gothic text-lg sm:text-xl font-black mb-8 ${verdict.color}`}>
                                    {verdict.label}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                                    <button
                                        onClick={restart}
                                        className="w-full sm:w-auto font-gothic flex items-center justify-center gap-2 bg-gradient-to-b from-red-700 to-red-950 hover:from-red-600 hover:to-red-900 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-red-900/60 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(120,0,0,0.6)]"
                                    >
                                        <FaRedo /> Play Again
                                    </button>
                                    <Link href="./" className="w-full sm:w-auto font-gothic flex items-center justify-center gap-2 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-colors px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold uppercase text-xs sm:text-sm tracking-wider text-stone-300">
                                        <FaArrowLeft /> Back to Home
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
