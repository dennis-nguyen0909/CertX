"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/components/translations-provider";
import { NavItem } from "@/hooks/use-nav-data";
import { useEffect, useState } from "react";

export function NavMain({ items }: { items: NavItem[] }) {
  const { locale } = useLocale();
  let pathname = usePathname();
  if (new RegExp(`^/${locale}(\/|$)`).test(pathname)) {
    pathname = pathname.replace(`/${locale}`, "");
  }

  // Key lưu vào localStorage
  const STORAGE_KEY = "sidebarOpenGroups";

  // Khởi tạo state từ localStorage hoặc mặc định mở hết
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      }
      const initial: { [key: string]: boolean } = {};
      items.forEach((item) => {
        if (item.items && item.items.length > 0) {
          initial[item.title] = true;
        }
      });
      return initial;
    }
  );

  // Lưu lại mỗi khi openGroups thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openGroups));
  }, [openGroups]);

  const handleGroupToggle = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          if (hasSubItems) {
            return (
              <Collapsible
                key={item.title}
                asChild
                open={!!openGroups[item.title]}
                onOpenChange={() => handleGroupToggle(item.title)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span className="font-bold">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={subItem.url === pathname}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          } else {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.url === pathname}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span className="font-bold">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
