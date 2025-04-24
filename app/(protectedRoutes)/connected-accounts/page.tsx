// app/connected-accounts/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. Provide metadata via the new App-Router API
export const metadata = {
  title: "Manage Connected Accounts",
  description: "View and unlink your OAuth providers",
};

// 2. Force dynamic rendering (so mutations take effect immediately)
export const dynamic = "force-dynamic";

// 3. Server Action to handle unlinking
async function unlinkAccount(formData: FormData) {
  "use server";
  const id = formData.get("accountId") as string | null;
  if (!id) return;

  // ensure user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // delete
  await prisma.account.deleteMany({
    where: { id, userId: session.user.id },
  });

  // re-render this page
  revalidatePath("/connected-accounts");
}

export default async function ConnectedAccountsPage() {
  // 4. Guard access on the server
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 5. Fetch their linked accounts
  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      provider: true,
      providerAccountId: true,
    },
  });

  return (
    <>
      <div className="heading">Manage Connected Accounts</div>
      <div className="px-2">
        {accounts.length === 0 && (
          <p className="text-gray-500">You have no connected accounts.</p>
        )}

        <ul className="space-y-4">
          {accounts.map((acc) => (
            <li
              key={acc.id}
              className="flex justify-between items-center p-4 bg-[var(--color-surface)] rounded-2xl shadow"
            >
              <div>
                <p className="font-medium capitalize">{acc.provider}</p>
                <p className="text-sm text-gray-500">{acc.providerAccountId}</p>
              </div>

              {/* 6. Server-action form */}
              <form action={unlinkAccount}>
                <input type="hidden" name="accountId" value={acc.id} />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition"
                >
                  Unlink
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
