"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import {
  Home,
  HardDrive,
  Monitor,
  Users,
  Clock,
  Star,
  AlertCircle,
  Trash,
  Cloud,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { NewButton } from "@/components/dashboard/sidebar/new-button"

const menuGroups = [
  [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "MyDrive", url: "/dashboard/drive", icon: HardDrive },
    {
      title: "Computers",
      url: "/dashboard/computers",
      icon: Monitor,
      hasArrow: true
    },
  ],
  [
    { title: "Shared with me", url: "/dashboard/shared", icon: Users },
    { title: "Recent", url: "/dashboard/recent", icon: Clock },
    { title: "Starred", url: "/starred", icon: Star },
  ],
  [
    { title: "Spam", url: "/dashboard/spam", icon: AlertCircle },
    { title: "Trash", url: "/trash", icon: Trash },
    { title: "Storage", url: "/dashboard/storage", icon: Cloud },
  ]
]

export function MainSidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const quota = user?.quota || 15 * 1024 * 1024 * 1024; // fallback 15GB
  const usedStorage = user?.used_storage || 0;

  const rawPercent = quota > 0 ? (usedStorage / quota) * 100 : 0;
  // If user has files but it's < 1%, show at least 1% for visual feedback
  const storagePercent = usedStorage > 0 && rawPercent < 1 ? 1 : Math.min(Math.round(rawPercent), 100);

  const usedFormatted = formatBytes(usedStorage);
  const totalGB = (quota / (1024 * 1024 * 1024)).toFixed(0);

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(url)
  }

  return (
    <Sidebar className="bg-[#F9FAFD] dark:bg-sidebar border-none w-[256px]">
      <SidebarHeader className="h-16 flex items-start px-6 pt-3">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="Drive Logo" width={36} height={36} className="object-contain" />
          <span className="text-[22px] font-normal tracking-wide text-foreground/90 pl-1">Drive</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <NewButton />

        {/* Menu Items */}
        <div className="flex flex-col gap-4">
          {menuGroups.map((group, groupIdx) => (
            <SidebarGroup key={groupIdx} className="p-0 m-0 border-none">
              <SidebarMenu className="gap-[2px]">
                {group.map((item) => {
                  const active = isActive(item.url)
                  const isStorageItem = item.title.startsWith("Storage");
                  const isDisabled = ["MyDrive", "Computers", "Shared with me", "Recent", "Spam", "Storage"].includes(item.title);

                  const InnerContent = (
                    <div className={`flex items-center gap-[18px] ${item.hasArrow ? "pl-1 relative -left-1" : ""}`}>
                      <div className="flex items-center gap-1">
                        {/* Tiny arrow for Computers strictly matching UI */}
                        {item.hasArrow && (
                          <svg className="w-[8px] h-[8px] fill-current opacity-80" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                        <item.icon className="h-[20px] w-[20px] stroke-[1.5] mr-1" />
                      </div>
                      <span className="text-[14px]">{item.title}</span>
                    </div>
                  );

                  return (
                    <div key={item.title} className="flex flex-col">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild={!isDisabled}
                          isActive={active}
                          className={`h-[40px] px-4 my-px transition-colors rounded-full w-[220px] ${active
                            ? "bg-[#C2E7FF] dark:bg-[#004a77] text-[#004a77] dark:text-[#c2e7ff] font-medium"
                            : "text-[#1f1f1f] dark:text-[#c4c7c5] hover:bg-[#E1E5EA] dark:hover:bg-white/5 text-[14px] font-medium"
                            } ${isDisabled ? "pointer-events-none opacity-50" : ""}`}
                        >
                          {isDisabled ? (
                            InnerContent
                          ) : (
                            <Link href={item.url}>
                              {InnerContent}
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Append storage progress elements immediately under the Storage menu item */}
                      {isStorageItem && (
                        <div className="flex flex-col gap-[10px] pl-[16px] pr-4 mt-2 mb-2">
                          <Progress value={storagePercent} className={`h-1 bg-[#e0e0e0] dark:bg-[#444746] ${storagePercent > 90 ? '[&>div]:bg-[#0b5c15] dark:[&>div]:bg-[#f2b8b5]' : '[&>div]:bg-[#1b73e8] dark:[&>div]:bg-[#8ab4f8]'}`} />
                          <p className="text-[14px] text-[#444746] dark:text-[#c4c7c5]">
                            {usedFormatted} of {totalGB} GB used
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}