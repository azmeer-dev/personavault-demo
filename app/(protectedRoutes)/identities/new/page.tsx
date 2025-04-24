
// app/identities/new/page.tsx

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NewIdentityForm from "./NewIdentityForm";

export const metadata = {
  title: "Create New Identity",
  description: "Add a new identity record and link it to your accounts",
};

export const dynamic = "force-dynamic";

export default async function NewIdentityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const rawAccounts = await prisma.account.findMany({
    where: { userId },
    select: { id: true, provider: true, providerAccountId: true, email:true},
    orderBy: { provider: "asc" },
  });

  const accounts = rawAccounts.map((a) => ({
    id: a.id,
    provider: a.provider,
    providerAccountId: a.providerAccountId,
    email: a.email ?? "",
  }));

  return (
    <main className="p-6 bg-[var(--color-background)] text-[var(--color-on-background)]">
      <h1 className="text-3xl font-semibold mb-6">Create New Identity</h1>
      <NewIdentityForm accounts={accounts} />
    </main>
  );
}