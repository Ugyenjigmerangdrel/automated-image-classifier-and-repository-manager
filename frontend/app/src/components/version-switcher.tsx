import { GalleryVerticalEnd } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function VersionSwitcher() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
     
            <SidebarMenuButton
              size="lg"
              className=""
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Vultus</span>
              </div>
              
            </SidebarMenuButton>
      
        
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
