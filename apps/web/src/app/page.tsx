export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-3xl border border-[#176B57]/15 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#176B57]">
          AMX
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#17352e] sm:text-4xl">
          Arba Minch Experiences
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          The application foundation is ready. Public experience content will
          be added in a later implementation slice.
        </p>
        <a
          className="mt-8 inline-flex rounded-lg bg-[#176B57] px-5 py-3 font-semibold text-white transition hover:bg-[#125744]"
          href="/login"
        >
          Staff sign in
        </a>
        <div
          aria-hidden="true"
          className="mt-8 h-1 w-16 rounded-full bg-[#D9A441]"
        />
      </section>
    </main>
  );
}
