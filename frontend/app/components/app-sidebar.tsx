import { Package } from "lucide-react"
import * as React from "react"
import { useContext } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/components/ui/sidebar"
import { AuthContext } from "~/contexts/AuthContext"

export function AppSidebar({ currentRoute, ...props }: { currentRoute: string } & React.ComponentProps<typeof Sidebar>) {
  
  const { user } = useContext(AuthContext)
  
  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      title: "Account",
      url: "/account",
    }
  ]

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">FastShip</span>
                  <span className="">DMS</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={currentRoute === item.title}>
                  <a href={item.url}>
                    {item.title}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {
              user === "seller" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={currentRoute === "Submit Shipment"}>
                    <a href="/submit-shipment">
                      Submit Shipment
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }
            {
              user === "partner" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={currentRoute === "Update Shipment"}>
                    <a href="/update-shipment">
                      Update Shipment
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
