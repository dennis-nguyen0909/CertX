import {
  LayoutDashboardIcon,
  Settings,
  Building2,
  GraduationCap,
  Award,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/auth";

export function useNavData() {
  const { t } = useTranslation();
  const { role } = useAuth();

  // Base navigation items
  const baseItems = [
    {
      title: t("nav.overview"),
      url: "/overview",
      icon: LayoutDashboardIcon,
      isActive: true,
      items: [],
    },
    {
      title: t("nav.certificateManagement"),
      url: "/certificates",
      icon: Award,
      isActive: true,
      items: [],
    },
  ];

  // Admin-only items
  const adminItems = [
    {
      title: t("nav.departmentManagement"),
      url: "/department",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: t("nav.departmentList"),
          url: "/department-list",
          isActive: true,
          items: [],
        },
      ],
    },
    {
      title: t("nav.settings"),
      url: "/",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: t("nav.users"),
          url: "/users",
          isActive: true,
          items: [],
        },
        {
          title: t("nav.roles"),
          url: "/roles",
          isActive: true,
          items: [],
        },
        {
          title: t("nav.permissions"),
          url: "/permissions",
          isActive: true,
          items: [],
        },
      ],
    },
  ];

  // Common items for all authenticated users
  const commonItems = [
    {
      title: t("nav.classManagement"),
      url: "/class",
      icon: GraduationCap,
      isActive: true,
      items: [
        {
          title: t("nav.classList"),
          url: "/class-list",
          isActive: true,
          items: [],
        },
      ],
    },
    {
      title: t("nav.certificatesTypeManagement"),
      url: "/certificates",
      icon: Award,
      isActive: true,
      items: [
        {
          title: t("nav.certificatesType"),
          url: "/certificates-type",
          isActive: true,
          items: [],
        },
      ],
    },
    {
      title: t("nav.studentsManagement"),
      url: "/students",
      icon: Users,
      isActive: true,
      items: [
        {
          title: t("nav.studentList"),
          url: "/student-list",
          isActive: true,
          items: [],
        },
      ],
    },
  ];

  // Build navigation based on role
  let data = [...baseItems, ...commonItems];

  // Only add admin items if user is admin
  if (role === "ADMIN" || role === "admin" || role === "PDT") {
    data = [...data, ...adminItems];
  }

  return data;
}
