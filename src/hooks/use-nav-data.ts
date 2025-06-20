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

export type NavItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
  isActive: boolean;
  items: NavItem[];
};

type NavItemConfig = {
  titleKey: string;
  url: string;
  icon?: React.ElementType;
  items?: NavItemConfig[];
  roles?: ("ADMIN" | "PDT" | "KHOA")[];
};

const navigationConfig: NavItemConfig[] = [
  {
    titleKey: "nav.overview",
    url: "/overview",
    icon: LayoutDashboardIcon,
  },
  {
    titleKey: "nav.certificateManagement",
    url: "/certificates",
    icon: Award,
  },
  {
    titleKey: "nav.degreeManagement",
    url: "/degree",
    icon: GraduationCap,
    items: [
      {
        titleKey: "nav.degreeRating",
        url: "/degree/rating",
        roles: ["KHOA"],
      },
      {
        titleKey: "nav.degreeTitle",
        url: "/degree/title",
        roles: ["KHOA"],
      },
      {
        titleKey: "nav.degreeList",
        url: "/degree/list",
      },
    ],
  },
  {
    titleKey: "nav.classManagement",
    url: "/class",
    icon: GraduationCap,
    items: [
      {
        titleKey: "nav.classList",
        url: "/class-list",
      },
    ],
  },
  {
    titleKey: "nav.certificatesTypeManagement",
    url: "/certificates",
    icon: Award,
    items: [
      {
        titleKey: "nav.certificatesType",
        url: "/certificates-type",
      },
    ],
  },
  {
    titleKey: "nav.studentsManagement",
    url: "/students",
    icon: Users,
    items: [
      {
        titleKey: "nav.studentList",
        url: "/student-list",
      },
    ],
  },
  {
    titleKey: "nav.departmentManagement",
    url: "/department",
    icon: Building2,
    roles: ["ADMIN", "PDT"],
    items: [
      {
        titleKey: "nav.departmentList",
        url: "/department-list",
      },
    ],
  },
  {
    titleKey: "nav.settings",
    url: "/",
    icon: Settings,
    items: [
      {
        titleKey: "nav.profile",
        url: "/profile",
      },
      {
        titleKey: "nav.changePassword",
        url: "/change-password",
      },
      {
        titleKey: "nav.roles",
        url: "/roles",
        roles: ["ADMIN", "PDT"],
      },
      {
        titleKey: "nav.permissions",
        url: "/permissions",
        roles: ["ADMIN", "PDT"],
      },
    ],
  },
];

export function useNavData() {
  const { t } = useTranslation();
  const { role } = useAuth();

  const buildNavFromConfig = (config: NavItemConfig[]): NavItem[] => {
    return config.reduce((acc: NavItem[], item) => {
      const userRole = role?.toUpperCase();
      const hasAccess =
        !item.roles ||
        (userRole && item.roles.includes(userRole as "ADMIN" | "PDT" | "KHOA"));

      if (hasAccess) {
        const navItem: NavItem = {
          title: t(item.titleKey),
          url: item.url,
          icon: item.icon,
          isActive: true, // default as per original logic
          items: item.items ? buildNavFromConfig(item.items) : [],
        };

        // Do not add parent if it has no visible children
        if (item.items && navItem.items.length === 0) {
          return acc;
        }

        acc.push(navItem);
      }
      return acc;
    }, []);
  };

  return buildNavFromConfig(navigationConfig);
}
