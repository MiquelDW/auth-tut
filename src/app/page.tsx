import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PiLockKeyFill } from "react-icons/pi";
import LoginButton from "@/components/auth/LoginButton";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            font.className,
            "flex items-center justify-center gap-2 text-center text-6xl font-semibold text-white drop-shadow-md",
          )}
        >
          <PiLockKeyFill />
          Auth
        </h1>

        <p className="text-lg text-white">A simple authentication service</p>

        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
