import { TopNav } from "@/components/TopNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      <main className="flex-1 pt-14">{children}</main>
    </>
  );
}
