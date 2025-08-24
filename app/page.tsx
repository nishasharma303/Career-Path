"use client"
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <div>
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white/80 ">
        <nav className="max-w-[85rem] mx-auto flex items-center justify-between px-6 lg:px-10 h-20">
          {/* Logo */}
<div className="relative w-[180px] h-[80px] sm:w-[220px] sm:h-[70px] lg:w-[300px] lg:h-[150px]">
  <Image
    src="/logo.png"
    alt="logo"
    fill
    className="object-contain"
    priority
  />
</div>


          {/* Clerk Auth */}
          <div className="flex items-center">
            {!user ? (
              <SignInButton mode="modal" signUpForceRedirectUrl={"/dashboard"}>
                <div className="flex items-center gap-x-2 font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-blue-400">
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  Get Started
                </div>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-white/80 via-purple-200 to-gray-50 dark:from-neutral-900 dark:to-neutral-950">
        <div className="max-w-[85rem] mx-auto px-6 lg:px-10 text-center">
          {/* Membership CTA */}
          <a
            className="inline-flex items-center gap-x-2 bg-white/70 backdrop-blur-md border border-gray-200 text-sm text-gray-800 p-1 ps-3 rounded-full transition hover:shadow-md dark:bg-neutral-800/70 dark:border-neutral-700 dark:text-neutral-200"
            href="#"
          >
            CareerPath Pro – Unlock Premium Guidance 
            
          </a>

          {/* Hero Title */}
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
            Shape Your{" "}
            <span className="bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent">
              Career Path
            </span>{" "}
            with AI
          </h1>

          {/* Subtext */}
          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600 dark:text-neutral-400">
            Chat with AI about skills, get resume insights, and follow a
            personalized roadmap to achieve your career goals.
          </p>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-x-3 bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-700 hover:to-blue-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 transition px-6 py-3"
            >
              Get Started
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[85rem] mx-auto px-6 lg:px-10 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "AI Career Chat",
              desc: "Ask AI about career choices, skills, and job paths.",
              icon: (
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              ),
            },
            {
              title: "Resume Analyzer",
              desc: "Upload your resume for instant strengths & gaps analysis.",
              icon: (
                <>
                  <path d="M4 4h16v16H4z" />
                  <path d="M8 8h8v8H8z" />
                </>
              ),
            },
            {
              title: "Roadmap Generator",
              desc: "Get a step-by-step AI-powered roadmap for your career goals.",
              icon: (
                <>
                  <path d="M3 6h18" />
                  <path d="M9 6v12" />
                </>
              ),
            },
            {
              title: "24/7 Guidance",
              desc: "Get continuous AI-driven support and mentorship anytime.",
              icon: (
                <>
                  <path d="M12 20v-6m0 0V4m0 10H6m6 0h6" />
                </>
              ),
            },
          ].map((f, i) => (
            <div
              key={i}
              className="group bg-gray-50 dark:bg-neutral-900/70 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition"
            >
              <div className="flex justify-center items-center size-14 bg-gradient-to-tl from-blue-600 to-violet-600 rounded-xl shadow-md">
                <svg
                  className="size-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-neutral-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
