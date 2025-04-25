import * as React from "react"
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
  Book,
  BookOpen, 
  Library, 
  BookOpenCheck,
  ClipboardList,
  DollarSign,
} from "lucide-react"

import { NavMain } from "@/components/common/layout/sidebar/nav-main"
import { NavUser } from "@/components/common/layout/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useAtomValue } from "jotai/react"
import { userInfoAtom } from "@/stores/auth"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  navMain: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      title: "Dashboard",
      role: ["admin", "staff", "member"],
    },
    {
      name: "Users",
      url: "/users",
      icon: Bot,
      title: "Quản lý hội viên",
      role: ["admin"],
    },
    {
      name: "Borrow Request",
      url: "/borrow-request",
      icon: ClipboardList,
      title: "Lịch sử yêu cầu mượn",
      role: ["admin", "staff", "member"],
    },
    {
      name: "Borrow Record",
      url: "/borrow-record",
      icon: BookOpenCheck,
      title: "Lịch sử mượn",
      role: ["admin", "staff", "member"],
    },
    {
      name: "Books",
      url: "/books",
      icon: Book,
      title: "Quản lý sách",
      role: ["admin", "staff"],
    },
    {
      name: "Categories",
      url: "/categories",
      icon: BookOpen,
      title: "Quản lý danh mục",
      role: ["admin", "staff"],
    },
    {
      name: "Inventory",
      url: "/inventory",
      icon: Library,
      title: "Kho sách",
      role: ["admin", "staff", "member"],
    },
    {
      name: "Fines",
      url: "/fine",
      icon: DollarSign,
      title: "Quản lý phạt",
      role: ["admin", "staff", "member"],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useAtomValue(userInfoAtom)
  const user = {
    name: userData?.full_name || "Nguyễn Văn A",
    email: userData?.email || "default@example.com",
    avatar: "https://picsum.photos/200",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          src="/lms_logo.png"
          alt="Sidebar Logo"
          width={200}
          height={200}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
