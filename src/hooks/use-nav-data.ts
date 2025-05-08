import { FileChartColumn, LayoutDashboardIcon } from "lucide-react";
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
      ],
    },
    {
      title: t("nav.contentManagement"),
      url: "/",
      icon: FileChartColumn,
      isActive: true,
      items: [],
    },
  ];

  return data;
}
