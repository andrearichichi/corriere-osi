import { SiteNav } from "@/components/SiteNav";
import { Disclaimer } from "@/components/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main id="main">{children}</main>
      <footer className="no-print border-t border-rule">
        <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
          <Disclaimer className="max-w-3xl" />
        </div>
      </footer>
    </>
  );
}
