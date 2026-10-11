import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#176B57]/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Arba Minch Experiences</p>
        <Link
          className="w-fit rounded underline-offset-4 hover:text-[#176B57] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
          href="/privacy"
        >
          Privacy notice
        </Link>
        <Link
          className="w-fit rounded underline-offset-4 hover:text-[#176B57] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
          href="/login"
        >
          Staff sign in
        </Link>
      </div>
    </footer>
  );
}
