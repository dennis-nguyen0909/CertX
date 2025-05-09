import {
  FileChartColumn,
  LayoutDashboardIcon,
  School,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function useNavData() {
  const { t } = useTranslation();

  const data = [
    {
      title: t("nav.overview"),
      url: "/",
      icon: LayoutDashboardIcon,
      isActive: true,
      items: [],
    },
    {
      title: t("nav.schools"),
      url: "/schools",
      icon: School,
      isActive: true,
      items: [],
    },
    {
      title: t("nav.certificates"),
      url: "/certificates",
      icon: School,
      isActive: true,
      items: [],
    },
    {
      title: t("nav.settings"),
      url: "/settings",
      icon: Settings,
      isActive: true,
      items: [],
    },
    // {
    //   title: t("nav.dashboard"),
    //   url: "/",
    //   icon: LayoutDashboardIcon,
    //   isActive: true,
    //   items: [
    //     // {
    //     //   title: t("nav.students"),
    //     //   url: "/students",
    //     // },
    //     {
    //       title: t("nav.schools"),
    //       url: "/schools",
    //     },
    //     {
    //       title: t("nav.certificates"),
    //       url: "/certificates",
    //     },
    //     {
    //       title: t("nav.departments"),
    //       url: "/departments",
    //     },
    //   ],
    // },
    {
      title: t("nav.settings"),
      url: "/",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: t("nav.users"),
          url: "/users",
        },
        {
          title: t("nav.roles"),
          url: "/roles",
        },
        {
          title: t("nav.permissions"),
          url: "/permissions",
        },
      ],
    },
  ];

  return data;
}
