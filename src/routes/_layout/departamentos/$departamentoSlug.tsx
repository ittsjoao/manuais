import { createFileRoute } from "@tanstack/react-router";
import { FileText, Loader2, Building } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute(
  "/_layout/departamentos/$departamentoSlug",
)({
  component: DepartamentoPage,
});

function DepartamentoPage() {
  const { departamentoSlug } = Route.useParams();
  const { trpc } = Route.useRouteContext();

  const queryOptions = trpc.departamentos.getBySlug.queryOptions({
    slug: departamentoSlug,
  });

  const { data, isLoading, error } = useSuspenseQuery(queryOptions);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">
          Departamento não encontrado
        </h1>
        <p className="text-gray-600 mt-2">
          O departamento "{departamentoSlug}" não existe.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building className="h-8 w-8" />
          {data.nome}
        </h1>
        {data.descricao && (
          <p className="text-gray-600 mt-2">{data.descricao}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.programas.map((programa) => (
          <Card key={programa.id} className="h-full">
            <CardHeader>
              <CardTitle>{programa.nome}</CardTitle>
              <CardDescription>
                {programa.manuais.length} manual(is) disponível(is)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {programa.manuais.map((pm) => (
                  <div
                    key={pm.id}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <div className="font-medium">{pm.manual.titulo}</div>
                      <div className="text-xs text-gray-500">
                        Atualizado em{" "}
                        {new Date(pm.manual.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
