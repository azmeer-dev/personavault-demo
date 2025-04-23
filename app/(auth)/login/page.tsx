"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 font-logo">Sign In</h2>

        {/* OAuth Sign-Ins */}
        <button onClick={() => signIn("google")} className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Sign in with Google</button>
        {/* <button onClick={() => signIn("github")} className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">Sign in with GitHub</button>
        <button onClick={() => signIn("linkedin")} className="w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Sign in with LinkedIn</button>
        <button onClick={() => signIn("twitch")} className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Sign in with Twitch</button> */}

        {/* Credentials Sign-In */}
        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const email = form.email.value;
          const password = form.password.value;
          signIn("credentials", { email, password, callbackUrl: "/" });
        }} className="space-y-4">
          <input name="email" type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700 dark:text-white" required />
          <input name="password" type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700 dark:text-white" required />
          <button type="submit" className=" button w-full py- rounded-l">Sign in with Email</button>
        </form>
      </div>
    </main>
  );
}
