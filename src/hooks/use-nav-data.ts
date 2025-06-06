import {
  LayoutDashboardIcon,
  Settings,
  Building2,
  GraduationCap,
  Award,
  Users,
  List,
  FileText,
  User,
  Shield,
  Key,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function useNavData() {
  const { t } = useTranslation();

  const data = [
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
    {
      title: t("nav.departmentManagement"),
      url: "/department",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: t("nav.departmentList"),
          url: "/department-list",
          icon: List,
          isActive: true,
          items: [],
        },
      ],
    },

    {
      title: t("nav.classManagement"),
      url: "/class",
      icon: GraduationCap,
      isActive: true,
      items: [
        {
          title: t("nav.classList"),
          url: "/class-list",
          icon: List,
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
          icon: FileText,
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
          icon: List,
          isActive: true,
          items: [],
        },
      ],
    },
    // {
    //   title: t("nav.settings"),
    //   url: "/settings",
    //   icon: Settings,
    //   isActive: true,
    //   items: [],
    // },
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
          icon: User,
        },
        {
          title: t("nav.roles"),
          url: "/roles",
          icon: Shield,
        },
        {
          title: t("nav.permissions"),
          url: "/permissions",
          icon: Key,
        },
      ],
    },
  ];

  return data;
}
