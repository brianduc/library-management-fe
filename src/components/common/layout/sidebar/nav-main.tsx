"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useAtomValue } from "jotai/react"
import { userInfoAtom } from "@/stores/auth"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
    role: string[]
  }[]
}) {
  const pathname = usePathname()
  const user = useAtomValue(userInfoAtom)
  const userRole = user?.role
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items
          ?.filter((item) => userRole && item.role.includes(userRole || ""))
          .map((item) => {
            // Determine if the main item is active
            const isActive = pathname && item.url && pathname.includes(item.url)
            if (item?.items && item?.items.length > 0) {
              // Filter sub-items by user role
              
              if (items.length === 0) return null
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isActive || false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive || false}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {items.map((subItem) => {
                          const isSubActive =
                            pathname &&
                            subItem.url &&
                            pathname.includes(subItem.url)
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive || false}
                              >
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive || false}
                >
                  <Link href={item.url} className="flex items-center w-full">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
      </SidebarMenu>
    </SidebarGroup>
  )
}