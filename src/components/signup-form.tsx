import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/utils/auth-client";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação básica
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "Erro ao criar conta");
      } else {
        navigate({ to: "/" });
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Crie sua conta</CardTitle>
        <CardDescription>
          Preencha as informações abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Nome Sobrenome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@austercontabil.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <FieldDescription>
                Deve ter pelo menos 8 caracteres.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmar Senha
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <FieldDescription>
                Por favor, confirme sua senha.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar Conta"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  <a href="/login">Já tem uma conta?</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
