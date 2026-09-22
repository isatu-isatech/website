import { Loader2 } from "lucide-react";

export default function MembershipApplyLoading() {
  return (
    <main className="from-background via-background to-muted/30 relative flex min-h-0 flex-1 flex-col overflow-hidden bg-linear-to-b">
      <section
        id="apply"
        className="mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:px-12 xl:px-16"
        aria-busy="true"
      >
        <div className="flex w-full flex-col items-start gap-2 text-left">
          <h1 className="text-secondary-dark dark:text-secondary text-2xl font-bold md:text-3xl">
            Membership Application
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm">
            Checking whether applications are open…
          </p>
        </div>
        <Loader2 className="text-primary size-6 animate-spin" aria-hidden />
        <span className="sr-only">Loading application form…</span>
      </section>
    </main>
  );
}
