"use client";

import {
  AudioWaveform,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map as MapIcon,
  PieChart,
  Settings2,
} from "lucide-react";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";
// This is sample data.
const data = {
  user: {
    name: "Comsuporte",
    email: "mauro@comsuporte.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: APP_NAME,
      logo: GalleryVerticalEnd,
      plan: "Grupo Comsuporte",
    },
    {
      name: "Mauro Rammalli",
      logo: GalleryVerticalEnd,
      plan: "Developer",
    },
    {
      name: "Gilvan Costa",
      logo: AudioWaveform,
      plan: "Developer",
    },
  ],

  projects: [
    {
      name: "Organização",
      url: "/dashboard/organization",
      icon: Frame,
    },

    {
      name: "Usuários",
      url: "/dashboard/users",
      icon: PieChart,
    },

    {
      name: "Profile",
      url: "/dashboard/admin/profile",
      icon: PieChart,
    },
    {
      name: "Plataformas",
      url: "#",
      icon: MapIcon,
    },
  ],

  navMain: [
    {
      title: "Relatórios",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Painel",
          url: "/dashboard/report/panel",
        },
        {
          title: "Relatórios de Organizações",
          url: "/dashboard/report/organization",
        },
        {
          title: "Relatórios de Usuários",
          url: "/dashboard/report/users",
        },
        {
          title: "Relatório de Sistema",
          url: "/dashboard/report/system",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Configurações Gerais",
          url: "#",
        },

        {
          title: "Impressoras",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
