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
import { Fragment, useEffect, useRef, useState } from "react"
import { navItems } from "../../../configs/constants"
import ActionsHeaderButton from "./actions-header-buttons"
import { Separator } from "@shadcn/components/separator"

export default function HeaderBottom() {
  const [isSticky, setIsSticky] = useState(false)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.getBoundingClientRect().height)
      }
    }

    // measure on mount and on resize
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <Fragment>
      {/* Spacer to prevent layout jump when header becomes fixed */}
      {isSticky && <div style={{ height: headerHeight }} aria-hidden />}

      <div
        ref={headerRef}
        className={cn(
          "w-full transition-all duration-300 px-12 py-5",
          isSticky ? "fixed top-0 left-0 right-0 z-50 bg-background border-b" : "relative"
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
                      <span className="font-medium">{navItem.title}</span>
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
    </Fragment>
  )
}
