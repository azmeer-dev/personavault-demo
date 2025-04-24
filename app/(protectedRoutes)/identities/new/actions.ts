"use server";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createIdentity(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const type = formData.get("type")?.toString().trim() || "";
  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || null;
  const visibility = formData.get("visibility") === "PUBLIC" ? "PUBLIC" : "PRIVATE";
  const accountIds = formData.getAll("accountIds").map(String).filter(Boolean);

  const previousNamesRaw = formData.get("previousNames")?.toString() || "";
  const religiousNamesRaw = formData.get("religiousNames")?.toString() || "";

  // Typed map for JSON fields
  const customFields: Record<string, Prisma.InputJsonValue> = {};
  if (previousNamesRaw) customFields.previousNames = previousNamesRaw.split(",").map(s => s.trim());
  if (religiousNamesRaw) customFields.religiousNames = religiousNamesRaw.split(",").map(s => s.trim());

  const data: Prisma.IdentityCreateInput = {
    user: { connect: { id: userId } },
    type,
    name,
    description,
    visibility,
    customFields,
    ...(accountIds.length > 0 && { accounts: { connect: accountIds.map(id => ({ id })) } }),
  };

  await prisma.identity.create({ data });
  revalidatePath("/identities");
  redirect("/identities");
}