import AuthShell from "@/components/AuthShell";
import LoginForm from "./LoginForm";
import { safeNext } from "@/lib/site";

export const metadata = { title: "Log in" };

export default function Login({ searchParams }) {
  return (
    <AuthShell>
      <LoginForm
        next={safeNext(searchParams?.next)}
        reason={searchParams?.reason || ""}
        initialEmail={typeof searchParams?.email === "string" ? searchParams.email : ""}
        linkError={searchParams?.error || ""}
      />
    </AuthShell>
  );
}
