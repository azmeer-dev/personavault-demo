// app/users/[userId]/identities/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export const metadata = {
  title: "Public Identities",
  description: "View a user's public identities",
};

export const dynamic = "force-dynamic";

export default async function UserPublicIdentitiesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  // 1) Ensure logged in
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const {userId} = await(params);

  // 2) Load target user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
  if (!user) redirect("/not-found");

  // 3) Load their public identities
  const identities = await prisma.identity.findMany({
    where: {
      userId: user.id,
      visibility: "PUBLIC",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      name: true,
      description: true,
      customValue: true,
      createdAt: true,
    },
  });

  const displayName = user.name || user.email;

  return (
    <main className="p-6 bg-[var(--color-background)] text-[var(--color-on-background)]">
      <h1 className="text-3xl font-semibold mb-6">
        {displayName}’s Public Identities
      </h1>

      {identities.length === 0 ? (
        <div className="space-y-4">
          <p className="text-gray-500">
            {displayName} does not have any public identities.
          </p>
          <Link
            href={`/users/${user.id}/request-identity`}
            className="button w-sm"
          >
            Request Identity
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {identities.map((id) => (
              <li
                key={id.id}
                className="border rounded-lg p-4 hover:shadow-sm transition"
              >
                <Link
                  href={`/users/${user.id}/identities/${id.id}`}
                  className="block"
                >
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-xl font-medium">{id.name}</h2>
                    <span className="text-sm text-gray-400">{id.type}</span>
                  </div>
                  {id.description && (
                    <p className="mt-2 text-gray-700">{id.description}</p>
                  )}
                  {id.customValue && (
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Value:</strong> {id.customValue}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Created on {id.createdAt.toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={`/users/${user.id}/request-identity`}
            className="button w-sm"
          >
            Request Another Identity
          </Link>
        </>
      )}
    </main>
  );
}
