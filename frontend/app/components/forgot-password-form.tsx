import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useContext } from "react"
import { AuthContext, type UserType } from "~/contexts/AuthContext"
import api from "~/lib/api"
import { toast } from "sonner"

export function ForgotPasswordForm({
  className,
  user,
  ...props
}: { user: UserType } & React.ComponentProps<"div">) {

  async function sendResetLink(data: FormData) {
    const email = data.get("email")?.toString()

    if (!email) {
      return
    }

    const userApi = user === "seller" ? api.seller : api.partner
    await userApi.forgotPassword({ email })

    toast("Reset link sent to your email")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" action={sendResetLink}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email address
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/rider.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
