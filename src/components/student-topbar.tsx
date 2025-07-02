"use client";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LogoSTU from "@/../public/logos/Logo_STU.png";
import { useAuth } from "@/contexts/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const studentNav = [
  { title: "Chứng chỉ", url: "/student-certificates" },
  { title: "Văn bằng", url: "/student-degrees" },
  { title: "Thông tin cá nhân", url: "/student-info" },
];

export default function StudentTopbar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  // Lấy user info từ localStorage hoặc context nếu có
  let userName = "Student";
  let avatarUrl = "https://github.com/shadcn.png";
  if (typeof window !== "undefined") {
    userName = localStorage.getItem("userName") || userName;
    avatarUrl = localStorage.getItem("avatar") || avatarUrl;
  }

  return (
    <nav className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md border-b px-4 sm:px-12 h-24 shadow-lg rounded-b-3xl sticky top-0 z-30 transition-all">
      {/* Logo bên trái */}
      <div className="flex items-center gap-4 min-w-[140px]">
        <Image
          src={LogoSTU}
          alt="STU Logo"
          width={96}
          height={96}
          className="object-contain drop-shadow-lg"
        />
      </div>
      {/* Navigation ở giữa */}
      <div className="flex gap-6">
        {studentNav.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            className={`font-semibold px-4 py-2 rounded-lg text-base transition-all duration-150 relative
              ${
                pathname === item.url
                  ? "text-primary after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-primary after:rounded"
                  : "text-gray-700 hover:text-primary/90 hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-primary/30 hover:after:rounded"
              }
            `}
            style={{ minWidth: 120, textAlign: "center" }}
          >
            {item.title}
          </Link>
        ))}
      </div>
      {/* Avatar và tên user bên phải */}
      <div className="flex items-center gap-3 min-w-[140px] justify-end">
        <span className="font-semibold text-gray-700 mr-2 hidden sm:block truncate max-w-[100px]">
          {userName}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border-2 border-primary/60 hover:border-primary transition-all duration-150 shadow-md">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem onClick={signOut} className="gap-2">
              <LogOut size={16} /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
