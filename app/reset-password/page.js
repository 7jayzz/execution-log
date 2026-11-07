import AuthShell from "@/components/AuthShell";
import ResetForm from "./ResetForm";

export const metadata = { title: "New password" };

export default function Page() {
  return (
    <AuthShell>
      <ResetForm />
    </AuthShell>
  );
}
