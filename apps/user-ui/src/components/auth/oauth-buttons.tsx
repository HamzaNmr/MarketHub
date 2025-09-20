import { Separator } from '@shadcn/components/separator'
import { Button } from '@shadcn/components/button'
import GoogleIcon from 'src/assets/svgs/google-icon'

export default function OAuthButtons() {
  return (
    <div>
      <div className="flex justify-between items-center overflow-hidden my-5">
        <Separator className="flex-1"/>
        <div className="flex justify-center text-xs">
          <span className="bg-transparent text-muted-foreground text-xs md:px-2">
            Or Continue with
          </span>
        </div>
        <Separator className="flex-1"/>
      </div>
        <Button variant="outline" className="w-full flex items-center gap-3">
            <GoogleIcon />
            <span>Login with Google</span>
        </Button>
    </div>
  )
}
