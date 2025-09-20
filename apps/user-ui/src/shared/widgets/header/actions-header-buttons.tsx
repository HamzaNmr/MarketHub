import { HeartIcon, ShoppingCart } from "lucide-react";
import AuthButtonsWrapper from "src/components/auth/auth-buttons-wrapper";
import IconButtonWithBadge from "../../base/buttons/icon-button-with-badge";

export default function ActionsHeaderButton() {
  return (
    <div className="flex items-center gap-3">
      <AuthButtonsWrapper />
      <IconButtonWithBadge href="/wish-list" icon={HeartIcon} labelBadge="0" />
      <IconButtonWithBadge href="/shopping-cart" icon={ShoppingCart} labelBadge="0" />
    </div>
  )
}
