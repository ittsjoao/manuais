import * as React from "react";
import {
  useParams,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, FileText, Plus, Minus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { VersionSwitcher } from "./version-switcher";
import { SearchForm } from "./search-form";
import { NavUser } from "./nav-user";
import { authClient } from "@/utils/auth-client";

const navMain = [
  {
    title: "Início",
    items: [
      { title: "Dashboard", url: "/dashboard" },
      { title: "Sobre", url: "/sobre" },
    ],
  },
];

export function AppSidebar() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const { trpc } = useRouteContext({ strict: false }) as any;
  const departamento = (params as any).departamento;
  const { data: session } = authClient.useSession();

  // Buscar todos os departamentos para o VersionSwitcher
  const { data: departamentosData } = useQuery(
    trpc.departamentos.list.queryOptions(),
  );

  // Buscar dados do departamento específico (se houver)
  const { data: departamentoCompleto } = useQuery({
    ...trpc.departamentos.getBySlug.queryOptions({
      slug: departamento || "",
    }),
    enabled: !!departamento,
  });

  const user = session?.user
    ? {
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || "",
      }
    : {
        name: "Visitante",
        email: "Não logado",
        avatar: "",
      };

  // Converter departamentos para o formato do VersionSwitcher
  const departamentosList = React.useMemo(() => {
    return (departamentosData || []).map((dept: any) => ({
      id: dept.id,
      nome: dept.nome,
      slug: dept.slug,
    }));
  }, [departamentosData]);
  // Obter o nome do departamento atual para o VersionSwitcher
  const currentDepartamentoName = React.useMemo(() => {
    return departamentoCompleto?.nome || "";
  }, [departamentoCompleto]);

  const nomeParaSlug = React.useMemo(() => {
    const map = new Map<string, string>();
    departamentosList.forEach((d) => {
      map.set(d.nome, d.slug);
    });
    return map;
  }, [departamentosList]);

  return (
    <Sidebar>
      <SidebarHeader>
        <VersionSwitcher
          versions={departamentosList.map((d) => d.nome)}
          currentDepartamento={currentDepartamentoName}
          onDepartamentoSelect={(nome: string) => {
            const slug = nomeParaSlug.get(nome);
            if (slug) {
              navigate({
                to: "/manuais/$departamento",
                params: { departamento: slug },
              });
            }
          }}
        />
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

        {/* Mostrar programas do departamento selecionado */}
        {departamento && departamentoCompleto && (
          <SidebarGroup>
            <SidebarGroupLabel>Programas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {departamentoCompleto.programas?.map((programa: any) => (
                  <Collapsible key={programa.id} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <span className="text-sm font-mono">
                            {programa.nome}
                          </span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {programa.manuais?.map((pm: any) => (
                            <SidebarMenuSubItem key={pm.id}>
                              <SidebarMenuSubButton
                                onClick={() =>
                                  navigate({
                                    to: "/manuais/$departamento",
                                    params: { departamento },
                                    search: {
                                      manualId: pm.manual.id.toString(),
                                    },
                                  })
                                }
                                className="flex items-center gap-2 whitespace-nowrap overflow-hidden"
                              >
                                <FileText className="w-4 h-4" />
                                <span className="overflow-auto text-ellipsis">
                                  {pm.manual.titulo}
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
