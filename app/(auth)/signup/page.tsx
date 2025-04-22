"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const { error } = await res.json();
      alert(error || "Sign-up failed.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-100 dark:bg-neutral-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-neutral-800 p-6  shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 font-logo">Create an Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-neutral-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-neutral-700 dark:text-white"
          required
        />
        <button type="submit" className="button w-full py-2">
          Sign Up
        </button>
      </form>
    </main>
  );
}
