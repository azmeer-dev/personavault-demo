// app/identities/new/page.tsx (server action file)

"use server";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createIdentity(formData: FormData) {
  // 1) auth guard
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // 2) read basic fields
  const type        = formData.get("type")?.toString().trim()   || "";
  const name        = formData.get("name")?.toString().trim()   || "";
  const description = formData.get("description")?.toString().trim() || null;
  const visibility  = formData.get("visibility") === "PUBLIC" ? "PUBLIC" : "PRIVATE";

  // 3) read previous/religious names
  const previousNamesRaw  = formData.get("previousNames")?.toString()  || "";
  const religiousNamesRaw = formData.get("religiousNames")?.toString() || "";

  // 4) build customFields JSON
  const customFields: Record<string, Prisma.InputJsonValue> = {};
  if (previousNamesRaw)  customFields.previousNames  = previousNamesRaw.split(",").map((s) => s.trim());
  if (religiousNamesRaw) customFields.religiousNames = religiousNamesRaw.split(",").map((s) => s.trim());

  // 5) pull the list of emails from your form
  const accountEmails = formData.getAll("accountEmails")
    .map((v) => v.toString().trim())
    .filter((e) => e.length > 0);

  // 6) look up those accounts by email
  let connectAccounts:
    | { connect: { id: string }[] }
    | undefined;

  if (accountEmails.length > 0) {
    const matched = await prisma.account.findMany({
      where: { email: { in: accountEmails } },
      select: { id: true },
    });

    if (matched.length > 0) {
      connectAccounts = {
        connect: matched.map((a) => ({ id: a.id })),
      };
    }
  }

  // 7) assemble your create payload
  const data: Prisma.IdentityCreateInput = {
    user:        { connect: { id: userId } },
    type,
    name,
    description,
    visibility,
    customFields,
    // only add `accounts` if we found some to connect
    ...(connectAccounts && { accounts: connectAccounts }),
  };

  // 8) run the create, revalidate, redirect
  await prisma.identity.create({ data });
  revalidatePath("/identities");
  redirect("/identities");
}
