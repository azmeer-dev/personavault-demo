// app/identities/page.tsx

import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Form from "next/form";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Your Identities",
  description: "Manage all your identity records",
};

export const dynamic = "force-dynamic";

// ─── Server Action: delete an identity ───────────────────────
async function deleteIdentity(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return redirect("/login");
  const userId = session.user.id;

  const id = formData.get("id")?.toString();
  if (id) {
    await prisma.identity.deleteMany({ where: { id, userId } });
    revalidatePath("/identities");
  }
}

export default async function IdentitiesPage() {
  // Guard
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  //fetch identities with linked accounts
  const identities = await prisma.identity.findMany({
    where: { userId },
    include: {
      // Pull in each linked Account row directly:
      accounts: {
        select: {
          id: true,
          provider: true,
          providerAccountId: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="p-6 bg-[var(--color-background)] text-[var(--color-on-background)]">
      {/* Header with “New Identity” button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Your Identities</h1>
        <Link
          href="/identities/new"
          className=" button "
        >
          + New Identity
        </Link>
      </div>

      {/* List */}
      {identities.length === 0 ? (
        <p className="text-gray-500">No identities yet. Create one above.</p>
      ) : (
        <ul className="space-y-4">
          {identities.map((ident) => (
            <li
              key={ident.id}
              className="p-4 bg-[var(--color-surface)] rounded-2xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-medium">
                  {ident.name} <span className="text-sm text-gray-500">({ident.type})</span>
                </p>
                {ident.description && (
                  <p className="text-sm text-gray-600 mt-1">{ident.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Visibility:{" "}
                  <span className={ident.visibility === "PUBLIC" ? "font-semibold" : "italic"}>
                    {ident.visibility.toLowerCase()}
                  </span>
                </p>
                {ident.accounts.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Accounts:{" "}
                    {ident.accounts.map((a) => a.provider).join(", ")}
                  </p>
                )}
              </div>

              <div className="mt-4 sm:mt-0 flex space-x-2">
                <Link
                  href={`/identities/${ident.id}/edit`}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                >
                  Edit
                </Link>

                <Form action={deleteIdentity}>
                  <input type="hidden" name="id" value={ident.id} />
                  <button
                    type="submit"
                    className="px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </Form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
