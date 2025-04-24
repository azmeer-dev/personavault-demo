// app/users/[userId]/identities/[identityId]/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export const metadata = {
  title: "Identity Details",
  description: "View a specific public identity",
};

export const dynamic = "force-dynamic";

export default async function IdentityDetailPage({
  params,
}: {
  params: Promise<{ userId: string; identityId: string }>;
}) {
  // 1) Guard
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const {userId, identityId} = await params;

  // fetch the identity
  const identity = await prisma.identity.findFirst({
    where: {
      id: identityId,
      userId,
      visibility: "PUBLIC",
    },
    include: {
      user: { select: { name: true, email: true } },
      accounts: {
        select: { id: true, provider: true, providerAccountId: true, email: true },
      },
    },
  })
  if (!identity) {
    redirect("/not-found");
  }

  const ownerName = identity.user.name || identity.user.email;

  return (
    <main className="p-6 bg-[var(--color-background)] text-[var(--color-on-background)]">
      <Link
        href={`/users/${userId}`}
        className="text-sm text-blue-500 hover:underline mb-4 block"
      >
        ← Back to {ownerName}’s Identities
      </Link>

      <h1 className="text-3xl font-semibold mb-2">{identity.name}</h1>
      <p className="text-gray-500 mb-4">
        {identity.type} • Created on {identity.createdAt.toLocaleDateString()}
      </p>

      {identity.description && (
        <section className="mb-4">
          <h2 className="font-medium">Description</h2>
          <p className="mt-1">{identity.description}</p>
        </section>
      )}

      {identity.customValue && (
        <section className="mb-4">
          <h2 className="font-medium">Value</h2>
          <p className="mt-1">{identity.customValue}</p>
        </section>
      )}

      {identity.accounts.length > 0 && (
        <section className="mb-4">
          <h2 className="font-medium">Linked Accounts</h2>
          <ul className="mt-1 space-y-1">
            {identity.accounts.map((acc) => (
              <li key={acc.id}>
                <strong>{acc.provider}:</strong> {acc.email}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href={`/users/${userId}/request-identity`}
        className="button w-xs"
      >
        Request Another Identity
      </Link>
    </main>
  );
}
