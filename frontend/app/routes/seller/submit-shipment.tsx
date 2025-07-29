import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { Navigate } from "react-router"
import { AppSidebar } from "~/components/app-sidebar"
import { SubmitShipmentForm } from "~/components/submit-shipment-form"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import Loading from "~/components/ui/loading"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { AuthContext } from "~/contexts/AuthContext"
import api from "~/lib/api"

export default function SubmitShipmentPage() {

  const { token, user, logout } = useContext(AuthContext)
  if (!token) {
    return <Navigate to="/" />
  }
  if (user !== "seller") {
    return <Navigate to="/dashboard" />
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar currentRoute="Submit Shipment" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h2>Submit Shipment</h2>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-[600px]">
          <SubmitShipmentForm />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
