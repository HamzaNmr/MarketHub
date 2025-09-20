import Logo from "../../base/logo"
import Link from "next/link"
import HeaderBottom from "./header-bottom"
import ActionsHeaderButton from "./actions-header-buttons"
import SearchInput from "../inputs/search-input"


export default function Header() {
  return (
    <header className="w-full">
      <nav className="w-full flex items-center justify-between px-12 py-5 border-b">
        <div>
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <SearchInput />
          <ActionsHeaderButton />
        </div>
      </nav>
      <HeaderBottom />
    </header>
  )
}
