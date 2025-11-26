-- CreateTable
CREATE TABLE "departamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "departamento_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programa_manual" (
    "id" SERIAL NOT NULL,
    "programa_id" INTEGER NOT NULL,
    "manual_id" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "programa_manual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departamento_slug_key" ON "departamento"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "programa_manual_programa_id_manual_id_key" ON "programa_manual"("programa_id", "manual_id");

-- AddForeignKey
ALTER TABLE "programa" ADD CONSTRAINT "programa_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programa_manual" ADD CONSTRAINT "programa_manual_programa_id_fkey" FOREIGN KEY ("programa_id") REFERENCES "programa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programa_manual" ADD CONSTRAINT "programa_manual_manual_id_fkey" FOREIGN KEY ("manual_id") REFERENCES "manual"("id") ON DELETE CASCADE ON UPDATE CASCADE;
