// app/identities/[id]/edit/page.tsx

import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Form from "next/form";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit Identity",
  description: "Modify your identity record",
};

// ─── Server Action: update the identity ───────────────────────
async function updateIdentity(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Pull values (including the hidden id field)
  const id          = formData.get("id")?.toString();
  const type        = (formData.get("type")        || "").toString().trim();
  const name        = (formData.get("name")        || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim() || null;
  const customValue = (formData.get("customValue") || "").toString().trim() || null;
  const visibility  = formData.get("visibility") === "PUBLIC" ? "PUBLIC" : "PRIVATE";

  if (!id || !type || !name) {
    throw new Error("Missing required fields");
  }

  // 1) read the list of emails from the form
  const accountEmails = formData
    .getAll("accountEmails")
    .map((v) => v.toString().trim())
    .filter((e) => e.length > 0);

  // 2) look up those accounts by email
  let accountsUpdate:
    | { set: { id: string }[] }
    | undefined;

  if (accountEmails.length > 0) {
    const matched = await prisma.account.findMany({
      where: { email: { in: accountEmails } },
      select: { id: true },
    });
    accountsUpdate = { set: matched.map((a) => ({ id: a.id })) };
  }

  // Build the update payload
  const data: Prisma.IdentityUpdateInput = {
    type,
    name,
    description,
    customValue,
    visibility,
    // reset M→N links to exactly this set (or omit if none)
    ...(accountsUpdate && { accounts: accountsUpdate }),
  };

  // Ensure it belongs to this user and apply update
  await prisma.identity.update({
    where: { id, userId },
    data,
  });

  revalidatePath("/identities");
  redirect("/identities");
}

// ─── Page Component ────────────────────────────────────────────
export default async function EditIdentityPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;
  const { id } = await params;

  // Fetch the identity and your accounts in parallel (including email)
  const [ident, accounts] = await Promise.all([
    prisma.identity.findFirst({
      where: { id, userId },
      include: { accounts: true },
    }),
    prisma.account.findMany({
      where: { userId },
      select: { id: true, provider: true, providerAccountId: true, email: true },
      orderBy: { provider: "asc" },
    }),
  ]);

  if (!ident) redirect("/identities");

  // Pre-select the linked account EMAILS
  const linkedEmails = ident.accounts
    .map((a) => a.email)
    .filter((e): e is string => !!e);

  return (
    <main className="p-6 bg-[var(--color-background)] text-[var(--color-on-background)]">
      <h1 className="text-3xl font-semibold mb-6">Edit Identity</h1>

      <Form action={updateIdentity} className="space-y-6 max-w-xl">
        {/* Hidden ID */}
        <input type="hidden" name="id" value={ident.id} />

        {/* Type */}
        <div>
          <label className="block font-medium mb-1">Type *</label>
          <input
            name="type"
            defaultValue={ident.type}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input
            name="name"
            defaultValue={ident.name}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={ident.description ?? ""}
            className="w-full p-2 border rounded-lg"
            rows={3}
          />
        </div>

        {/* Linked Accounts by Email */}
        <div>
          <label className="block font-medium mb-1">
            Link Accounts (by email)
          </label>
          <select
            name="accountEmails"
            multiple
            defaultValue={linkedEmails}
            className="w-full p-2 border rounded-lg"
            size={Math.min(6, accounts.length || 1)}
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.email ?? ""}>
                {acc.provider} – {acc.email}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold ⌘/Ctrl to select multiple.
          </p>
        </div>

        {/* Custom Value */}
        <div>
          <label className="block font-medium mb-1">
            Custom Value
          </label>
          <input
            name="customValue"
            defaultValue={ident.customValue ?? ""}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Visibility */}
        <div>
          <span className="block font-medium mb-1">Visibility</span>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="visibility"
              value="PUBLIC"
              defaultChecked={ident.visibility === "PUBLIC"}
              className="mr-2"
            />
            Public
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="visibility"
              value="PRIVATE"
              defaultChecked={ident.visibility === "PRIVATE"}
              className="mr-2"
            />
            Private
          </label>
        </div>

        {/* Submit */}
        <button type="submit" className="button">
          Save Changes
        </button>
      </Form>
    </main>
  );
}
