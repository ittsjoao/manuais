import { createFileRoute } from "@tanstack/react-router";
import { FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_layout/manuais/$departamento")({
  component: ManualPage,
});

type Manual = {
  id: number;
  titulo: string;
  conteudo: string;
  tags?: string[];
  criado_em: string;
  atualizado_em: string;
};

function ManualPage() {
  const { departamento } = Route.useParams();
  const { trpc } = Route.useRouteContext();

  // Obter os parâmetros de busca de forma segura
  const searchParams = Route.useSearch() as { manualId?: string };
  const manualId = searchParams.manualId
    ? parseInt(searchParams.manualId)
    : null;

  const queryOptions = trpc.manuais.getDepartamentoCompleto.queryOptions({
    departamentoSlug: departamento,
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
          O departamento "{departamento}" não existe.
        </p>
      </div>
    );
  }

  const { programas } = data;
  const manualAtivo = manualId
    ? programas.flatMap((p) => p.manuais).find((m) => m.manual.id === manualId)
    : null;

  return (
    <div className="flex-1">
      {manualAtivo ? (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            {manualAtivo.manual.titulo}
          </h1>
          <div className="flex gap-2 mb-6">
            {manualAtivo.manual.tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{manualAtivo.manual.conteudo}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Selecione um manual na sidebar para visualizar</p>
          </div>
        </div>
      )}
    </div>
  );
}
