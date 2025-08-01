import {
  LayoutDashboardIcon,
  Settings,
  Building2,
  GraduationCap,
  Award,
  Users,
  Wallet as LucideWallet,
  WalletCards,
  LucideHistory,
  UniversityIcon,
  Bell,
  PartyPopper,
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
  roles?: ("ADMIN" | "PDT" | "KHOA" | "STUDENT" | "")[];
};

const navigationConfig: NavItemConfig[] = [
  {
    titleKey: "nav.overview",
    url: "/overview",
    icon: LayoutDashboardIcon,
    roles: ["KHOA", "PDT", "ADMIN"],
  },
  {
    titleKey: "nav.degreeManagement",
    url: "/degree",
    icon: GraduationCap,
    roles: ["KHOA", "PDT", "ADMIN"],
    items: [
      {
        titleKey: "nav.degreeList",
        url: "/degree/list",
        roles: ["KHOA", "PDT", "ADMIN"],
      },
      {
        titleKey: "nav.degreeRating",
        url: "/degree/rating",
        roles: ["KHOA", "PDT"],
      },
      {
        titleKey: "nav.degreeTitle",
        url: "/degree/title",
        roles: ["KHOA", "PDT"],
      },
      {
        titleKey: "nav.educationMode",
        url: "/degree/education-mode",
        roles: ["KHOA", "PDT"],
      },
    ],
  },
  {
    titleKey: "nav.certificateManagement",
    url: "/certificates",
    roles: ["KHOA", "PDT", "ADMIN"],
    icon: Award,
    items: [
      {
        titleKey: "nav.certificateList",
        url: "/certificates",
        roles: ["KHOA", "PDT", "ADMIN"],
      },
      {
        titleKey: "nav.certificatesType",
        url: "/certificates-type",
        roles: ["KHOA", "PDT"],
      },
    ],
  },
  {
    titleKey: "nav.university",
    url: "/university-list",
    icon: UniversityIcon,
    roles: ["ADMIN"],
  },
  // {
  //   titleKey: "nav.certificatesTypeManagement",
  //   url: "/certificates",
  //   roles: ["KHOA", "PDT"],
  //   icon: Award,
  //   items: [
  //     {
  //       titleKey: "nav.certificatesType",
  //       url: "/certificates-type",
  //       roles: ["KHOA", "PDT"],
  //     },
  //   ],
  // },
  {
    titleKey: "nav.departmentManagement",
    url: "/department",
    icon: Building2,
    roles: ["ADMIN", "PDT"],
    items: [
      {
        titleKey: "nav.departmentList",
        url: "/department-list",
        roles: ["PDT"],
      },
    ],
  },
  {
    titleKey: "nav.classManagement",
    url: "/class",
    icon: GraduationCap,
    roles: ["KHOA", "PDT"],
    items: [
      {
        titleKey: "nav.classList",
        url: "/class-list",
        roles: ["KHOA", "PDT"],
      },
    ],
  },
  {
    titleKey: "nav.studentsManagement",
    url: "/students",
    icon: Users,
    roles: ["KHOA", "PDT"],
    items: [
      {
        titleKey: "nav.studentList",
        url: "/student-list",
        roles: ["KHOA", "PDT"],
      },
    ],
  },
  {
    titleKey: "nav.walletManagement",
    url: "/wallet",
    icon: LucideWallet,
    roles: ["ADMIN", "PDT"],
    items: [
      {
        titleKey: "nav.walletInfo",
        url: "/wallet-info",
        icon: WalletCards,
        roles: ["PDT"],
      },
    ],
  },
  {
    titleKey: "nav.history",
    url: "/history",
    icon: LucideHistory,
    roles: ["KHOA", "PDT"],
  },
  {
    titleKey: "nav.prizes",
    url: "/prizes",
    icon: PartyPopper,
    roles: ["KHOA"],
  },
  {
    titleKey: "nav.settings",
    url: "/",
    icon: Settings,
    roles: ["KHOA", "PDT"],
    items: [
      {
        titleKey: "nav.profile",
        url: "/profile",
      },
    ],
  },
  {
    titleKey: "nav.notifications",
    url: "/notifications",
    icon: Bell, // use lucide Notificate icon
    roles: ["PDT", "KHOA"],
  },
  {
    titleKey: "nav.studentInfo",
    url: "/student-info",
    icon: LucideWallet,
    roles: ["STUDENT"],
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

export function getRolesForPath(path: string): string[] | undefined {
  function findRoles(
    config: NavItemConfig[],
    target: string
  ): string[] | undefined {
    for (const item of config) {
      if (item.url === target) {
        return item.roles;
      }
      if (item.items) {
        const found = findRoles(item.items, target);
        if (found) return found;
      }
    }
    return undefined;
  }
  return findRoles(navigationConfig, path);
}
