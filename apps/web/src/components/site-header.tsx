import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[#176B57]/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          aria-label="AMX — Arba Minch Experiences, home"
          className="text-lg font-bold tracking-wide text-[#176B57]"
          href="/"
        >
          AMX
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-2 sm:gap-5">
          <Link
            className="rounded px-3 py-2 text-sm font-medium text-[#17352e] hover:text-[#176B57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
            href="/"
          >
            Home
          </Link>
          <Link
            className="rounded px-3 py-2 text-sm font-medium text-[#17352e] hover:text-[#176B57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
            href="/experiences"
          >
            Experiences
          </Link>
          <Link
            className="rounded px-3 py-2 text-sm font-medium text-[#17352e] hover:text-[#176B57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
            href="/inquiry"
          >
            Plan your trip
          </Link>
          <Link
            className="rounded-lg border border-[#176B57] px-3 py-2 text-sm font-semibold text-[#176B57] hover:bg-[#176B57]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
            href="/login"
          >
            Staff sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
