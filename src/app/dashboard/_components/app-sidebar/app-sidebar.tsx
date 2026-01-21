"use client";

import {
  Activity,
  AudioWaveform,
  Badge,
  Frame,
  GalleryVerticalEnd,
  Layers,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
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
      icon: Users,
    },
    {
      name: "convites",
      url: "/dashboard/invites",
      icon: Mail,
    },
    {
      name: "Funções",
      url: "/dashboard/roles",
      icon: Badge,
    },
    {
      name: "Logs de Acesso",
      url: "/dashboard/access-logs",
      icon: Shield,
    },
    {
      name: "Logs de Operações",
      url: "/dashboard/operation-logs",
      icon: Activity,
    },
    {
      name: "Plataformas",
      url: "/dashboard/platforms",
      icon: Layers,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
