import { prisma } from "../src/prisma";

async function main() {
  console.log("Iniciando seed...");

  // Inserir departamentos
  const pessoalDepartamento = await prisma.departamento.upsert({
    where: { slug: "pessoal" },
    update: {},
    create: {
      nome: "Pessoal",
      slug: "pessoal",
      descricao: "Departamento Pessoal - Folha, eSocial, etc",
      ordem: 1,
    },
  });

  const fiscalDepartamento = await prisma.departamento.upsert({
    where: { slug: "fiscal" },
    update: {},
    create: {
      nome: "Fiscal",
      slug: "fiscal",
      descricao: "Departamento Fiscal - Notas, SPED, etc",
      ordem: 2,
    },
  });

  const tiDepartamento = await prisma.departamento.upsert({
    where: { slug: "ti" },
    update: {},
    create: {
      nome: "T&I",
      slug: "ti",
      descricao: "Tecnologia e Inovação",
      ordem: 3,
    },
  });

  console.log("Departamentos inseridos:", {
    pessoalDepartamento,
    fiscalDepartamento,
    tiDepartamento,
  });

  // Inserir programas
  const eSocialPrograma = await prisma.programa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "eSocial",
      url: "/esocial",
      ordem: 1,
      departamentoId: pessoalDepartamento.id,
    },
  });

  const sefipPrograma = await prisma.programa.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: "SEFIP",
      ordem: 2,
      departamentoId: pessoalDepartamento.id,
    },
  });

  const spedFiscalPrograma = await prisma.programa.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nome: "SPED Fiscal",
      ordem: 1,
      departamentoId: fiscalDepartamento.id,
    },
  });

  const nfePrograma = await prisma.programa.upsert({
    where: { id: 4 },
    update: {},
    create: {
      nome: "NFe",
      ordem: 2,
      departamentoId: fiscalDepartamento.id,
    },
  });

  const digisacPrograma = await prisma.programa.upsert({
    where: { id: 5 },
    update: {},
    create: {
      nome: "Digisac",
      ordem: 1,
      departamentoId: tiDepartamento.id,
    },
  });

  console.log("Programas inseridos:", {
    eSocialPrograma,
    sefipPrograma,
    spedFiscalPrograma,
    nfePrograma,
    digisacPrograma,
  });

  // Inserir manuais
  const eventosS1000Manual = await prisma.manual.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titulo: "Como enviar eventos S-1000",
      conteudo: `# Enviando eventos S-1000

## Passo a passo

1. Acesse o menu eSocial
2. Clique em "Eventos"
3. Selecione S-1000
4. Preencha os dados
5. Clique em "Enviar"

## Observações importantes

- Sempre validar antes de enviar
- Guardar o recibo`,
      tags: ["esocial", "eventos", "s-1000"],
    },
  });

  const configuracaoInicialManual = await prisma.manual.upsert({
    where: { id: 2 },
    update: {},
    create: {
      titulo: "Configuração inicial do eSocial",
      conteudo: `# Configuração inicial

Antes de começar a usar o eSocial, você precisa:

- Configurar os dados da empresa
- Cadastrar os responsáveis
- Validar as informações`,
      tags: ["esocial", "configuracao"],
    },
  });

  const geracaoSefipManual = await prisma.manual.upsert({
    where: { id: 3 },
    update: {},
    create: {
      titulo: "Geração de SEFIP",
      conteudo: `# Gerando SEFIP

## Passo a passo

1. Acesse o menu SEFIP
2. Selecione o período
3. Clique em "Gerar arquivo"
4. Salve o arquivo .sfi`,
      tags: ["sefip", "fgts"],
    },
  });

  console.log("Manuais inseridos:", {
    eventosS1000Manual,
    configuracaoInicialManual,
    geracaoSefipManual,
  });

  // Relacionar manuais com programas
  await prisma.programaManual.upsert({
    where: {
      programaId_manualId: {
        programaId: eSocialPrograma.id,
        manualId: eventosS1000Manual.id,
      },
    },
    update: {},
    create: {
      programaId: eSocialPrograma.id,
      manualId: eventosS1000Manual.id,
      ordem: 1,
    },
  });

  await prisma.programaManual.upsert({
    where: {
      programaId_manualId: {
        programaId: eSocialPrograma.id,
        manualId: configuracaoInicialManual.id,
      },
    },
    update: {},
    create: {
      programaId: eSocialPrograma.id,
      manualId: configuracaoInicialManual.id,
      ordem: 2,
    },
  });

  await prisma.programaManual.upsert({
    where: {
      programaId_manualId: {
        programaId: sefipPrograma.id,
        manualId: geracaoSefipManual.id,
      },
    },
    update: {},
    create: {
      programaId: sefipPrograma.id,
      manualId: geracaoSefipManual.id,
      ordem: 1,
    },
  });

  console.log("Relacionamentos programa-manual inseridos");

  console.log("Seed completo!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
