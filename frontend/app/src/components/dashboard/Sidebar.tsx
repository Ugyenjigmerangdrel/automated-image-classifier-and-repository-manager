import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,

} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SearchForm } from "../search-form"
import { Outlet } from "react-router-dom"
import ModeToggle from "./ModeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export default function SideBar() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          {/* Left side: Sidebar trigger and separator */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb className="flex-1">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block"></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <SearchForm className="lg:w-[40vw] md:w-[50vw]" />
          </div>

          {/* Right side: ModeToggle */}
          <div className="flex gap-2 items-center ml-auto">
            <ModeToggle />
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

