import AuthShell from "@/components/AuthShell";
import CheckEmail from "./CheckEmail";

export const metadata = { title: "Check your email" };

export default function Page({ searchParams }) {
  return (
    <AuthShell>
      <CheckEmail email={typeof searchParams?.email === "string" ? searchParams.email : ""} />
    </AuthShell>
  );
}
