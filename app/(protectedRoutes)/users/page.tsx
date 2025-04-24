// app/users/page.tsx
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"

export const metadata = {
  title: "All Users",
  description: "Browse all registered users",
}

export const dynamic = "force-dynamic"  // always fresh

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  })

  return (
    <main className="p-6 bg-[var(--color-background)] text-[var(--color-on-background)]">
      <h1 className="text-3xl font-semibold mb-6">All Users</h1>
      <ul className="space-y-4">
        {users.map((u) => (
          <li key={u.id} className="p-4 border rounded-lg">
            <Link href={`/users/${u.id}`} className="font-medium hover:underline">
              {u.name || u.email}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
