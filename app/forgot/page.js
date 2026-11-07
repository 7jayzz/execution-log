import AuthShell from "@/components/AuthShell";
import ForgotForm from "./ForgotForm";

export const metadata = { title: "Reset password" };

export default function Page() {
  return (
    <AuthShell>
      <ForgotForm />
    </AuthShell>
  );
}
