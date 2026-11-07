import Brand from "@/components/Brand";

export default function AuthShell({ children }) {
  return (
    <main className="auth">
      <Brand />
      {children}
    </main>
  );
}
