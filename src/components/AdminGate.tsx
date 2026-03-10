import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const ADMIN_PASSWORD = "BlueConic2024!";

interface AdminGateProps {
  children: React.ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 flex items-center justify-center">
      <Card className="w-full max-w-sm p-8 shadow-xl border-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-heading font-bold text-navy">Admin Access</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the password to continue
            </p>
          </div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`h-12 text-lg border-2 rounded-xl ${
              error ? "border-red-500" : "border-border/50 focus:border-primary"
            }`}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500 text-center">Incorrect password</p>
          )}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
          >
            Access
          </Button>
        </form>
      </Card>
    </div>
  );
}
