import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouteContext } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ManualContentProps = {
  manual: {
    id: number;
    titulo: string;
    conteudo: string;
    tags?: string[];
  };
};

export function ManualContent({ manual }: ManualContentProps) {
  return null;
}
