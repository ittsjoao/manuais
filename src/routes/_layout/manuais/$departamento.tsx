"use client";
import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Editor } from "@tiptap/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/integrations/trpc/react";

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
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    ...trpc.manuais.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.manuais.getAll.queryKey(),
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !editor) {
      alert("Por favor, preencha todos os campos");
      return;
    }
    try {
      createMutation.mutate({
        titulo: title,
        conteudo: editor.getHTML(),
      });

      console.log("Manual criado:", createMutation.data);
      alert("Manual criado com sucesso!");

      if (!createMutation.isSuccess) throw new Error("Erro ao criar manual");
    } catch (error) {
      console.error("Erro ao criar manual:", error);
      alert("Erro ao criar manual");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Selecione um manual na sidebar para visualizar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Digite o título do manual"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
            />
            <div className="border rounded-lg">
              <SimpleEditor onEditorReady={setEditor} />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setTitle("");
                  editor?.commands.clearContent();
                }}
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
