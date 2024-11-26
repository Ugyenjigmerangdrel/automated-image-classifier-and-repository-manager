import * as React from "react"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Aperture, BookImage, ImageUp, UserPen } from "lucide-react"
import { NavLink } from "react-router-dom"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Explore Features",
      url: "#",
      items: [
        {
          title: "Gallery",
          url: "/photos",
          logo: <Aperture />
        },
        {
          title: "Albums",
          url: "/album",
          logo: <BookImage />
        },
        {
          title: "Upload",
          url: "/upload",
          logo: <ImageUp />
        },
        {
          title: "Profile",
          url: "/profile",
          logo: <UserPen />
        },
      ],
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
        />
       
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild >
                      <NavLink to={item.url}>{item.logo}{item.title}</NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
