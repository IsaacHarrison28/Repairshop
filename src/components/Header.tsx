import { HomeIcon, UsersRound, File, LogOut } from "lucide-react";
import { NavButton } from "@/components/NavButton";
import Link from "next/link";
import { ModeToggle } from "@/components/modeToggle";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="animate-slide bg-background h-12 p-2 border-b sticky top-0 z-10">
      <div className="flex h-8 items-center justify-between w-full">
        <div className="flex items-center gap-2 font-bold">
          <NavButton icon={HomeIcon} label="Home" href="/home" />
          <Link href="/home" className="flex items-center gap-2" title="Home">
            <h1 className="hidden sm:block text-xl font-bold m-0">
              Computer Repair Shop
            </h1>
          </Link>
        </div>
        <div className="flex flex-center">
          <NavButton icon={UsersRound} label="Customers" href="/customers" />
          <NavButton icon={File} label="Tickets" href="/tickets" />
          <ModeToggle />
          <Button
            className="rounded-full"
            variant="ghost"
            size="icon"
            aria-label="LogOut"
            title="Log Out"
            asChild
          >
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
