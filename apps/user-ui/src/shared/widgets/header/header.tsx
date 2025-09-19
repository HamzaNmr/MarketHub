import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@shadcn/components/navigation-menu"
import Logo from "../../base/logo"
import Link from "next/link"
import { Input } from "@shadcn/components/input"

export default function Header() {
  return (
    <header className="w-full">
      <nav className="w-full flex items-center justify-between px-7 py-5 border-b">
        <div>
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>
        <div>
          <Input placeholder="Search for products..." />
        </div>
      </nav>
    </header>
  )
}
