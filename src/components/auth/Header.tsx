import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { PiLockKeyFill } from "react-icons/pi";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

// predefine object structure for the given 'props' object
interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1
        className={cn(
          "flex items-center justify-center gap-2 text-3xl font-semibold",
          font.className,
        )}
      >
        <PiLockKeyFill />
        Auth
      </h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default Header;
