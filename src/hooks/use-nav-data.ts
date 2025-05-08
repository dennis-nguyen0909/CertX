import {
  FileChartColumn,
  LayoutDashboardIcon,
  Building2,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function useNavData() {
  const { t } = useTranslation();

  const data = [
    {
      title: t("nav.dashboard"),
      url: "/",
      icon: LayoutDashboardIcon,
      isActive: true,
      items: [
        {
          title: t("nav.students"),
          url: "/students",
        },
        {
          title: t("nav.certificates"),
          url: "/certificates",
        },
        {
          title: t("nav.departments"),
          url: "/departments",
        },
      ],
    },
    {
      title: t("nav.contentManagement"),
      url: "/",
      icon: FileChartColumn,
      isActive: true,
      items: [],
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
