import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { MipymeHeader } from "@/components/mipyme/MipymeHeader";
import { prisma } from "@/lib/prisma";

export default async function MipymeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/mipyme/login");
  }

  if (session.user.role !== "MIPYME") {
    redirect("/");
  }

  const mipyme = await prisma.mipyme.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen">
      <MipymeHeader mipymeName="" />
      <main className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
