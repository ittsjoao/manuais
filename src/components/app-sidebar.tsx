import * as React from "react";
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { authClient } from "@/utils/auth-client";
import { prisma } from "@/prisma";
import { VersionSwitcher } from "./version-switcher";
// This is sample data.
const navMain = [
  {
    title: "Início",
    items: [
      { title: "Dashboard", url: "/dashboard" },
      { title: "Sobre", url: "/sobre" },
    ],
  },
];

  return departamentos.map((departamento) => ({
    id: departamento.id,
    nome: departamento.nome,
    programas: departamento.programas.map((programa) => ({
      id: programa.id,
      nome: programa.nome,
    })),
  }));
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();

  const { data: departamentosData } = trpc.manuais.getDepartamentos.useQuery();

  const { data: manuaisData } = trpc.manuais.getDepartamentoCompleto.useQuery(
    { departamentoSlug: departamento || "" },
    { enabled: !!departamento },
  );

  const user = session?.user
    ? {
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || "",
      }
    : {
        name: "Visitante",
        email: "Não informado",
        avatar: "",
      };

  const departamentosList = departamentosData?.map((dept) => dept.nome) || [];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={departamentosList} defaultVersion="" />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
