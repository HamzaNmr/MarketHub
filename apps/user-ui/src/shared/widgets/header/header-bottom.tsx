"use client"

import { 
    NavigationMenu, 
    NavigationMenuContent, 
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@shadcn/components/navigation-menu"
import { cn } from "@shadcn/lib/utils"
import { ListCollapse } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { navItems } from "../../../configs/constants"
import ActionsHeaderButton from "./actions-header-buttons"
import { Separator } from "@market-hub/packages/ui/shadcn/src/components/ui/separator"

export default function HeaderBottom() {
    const [isSticky, setIsSticky] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 100) {
                setIsSticky(true)
            } else {
                setIsSticky(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

  return (
    <div 
        className={cn(
            "w-full transition-all duration-300 px-12 py-5",
            isSticky ? "fixed inset-0 z-50 bg-background border-b" : "relative"
        )}
    >
        <div
            className={cn(
                "w-full relative m-auto flex items-center justify-between",
                isSticky ? "pt-3" : "py-0"
            )}
        >
            <NavigationMenu viewport={false} className="max-w-full justify-between">
                <NavigationMenuList id="dropdowns">
                    <NavigationMenuItem>
                            <NavigationMenuTrigger className="flex items-center gap-2 cursor-pointer bg-accent">
                                <ListCollapse className="size-4" />
                                <span>All Departments</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[300px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">
                                                <div className="font-medium">Department one</div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">
                                                <div className="font-medium">Department two</div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">
                                                <div className="font-medium">Department three</div>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <NavigationMenuList id="links" className="flex items-center gap-3">
                    {navItems.map((navItem: NavItemType, i: number) => (
                        <NavigationMenuItem key={i}>
                            <NavigationMenuLink asChild>
                                <Link href={navItem.href}>
                                    <span className="font-medium">
                                        {navItem.title}
                                    </span>
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu> 
            {isSticky && (
                <div className="flex items-center h-7">
                    <Separator orientation="vertical" className="mx-5" />
                    <ActionsHeaderButton />
                </div>
            )}
        </div>
    </div>
  )
}
