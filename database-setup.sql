-- Tabela de Departamentos
CREATE TABLE IF NOT EXISTS departamento (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE, -- para usar na URL
  descricao TEXT,
  icone VARCHAR(50),
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de Programas
CREATE TABLE IF NOT EXISTS programa (
  id SERIAL PRIMARY KEY,
  departamento_id INTEGER NOT NULL REFERENCES departamento(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  url TEXT,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de Manuais
CREATE TABLE IF NOT EXISTS manual (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  conteudo TEXT NOT NULL,
  tags TEXT[],
  autor_id VARCHAR(255),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de relacionamento Programa <-> Manual
CREATE TABLE IF NOT EXISTS programa_manual (
  programa_id INTEGER NOT NULL REFERENCES programa(id) ON DELETE CASCADE,
  manual_id INTEGER NOT NULL REFERENCES manual(id) ON DELETE CASCADE,
  ordem INTEGER DEFAULT 0,
  PRIMARY KEY (programa_id, manual_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_programa_departamento ON programa(departamento_id);
CREATE INDEX IF NOT EXISTS idx_programa_manual_programa ON programa_manual(programa_id);
CREATE INDEX IF NOT EXISTS idx_programa_manual_manual ON programa_manual(manual_id);

-- Dados de exemplo
INSERT INTO departamento (nome, slug, descricao, ordem) VALUES
  ('Pessoal', 'pessoal', 'Departamento Pessoal - Folha, eSocial, etc', 1),
  ('Fiscal', 'fiscal', 'Departamento Fiscal - Notas, SPED, etc', 2),
  ('T&I', 'ti', 'Tecnologia e Inovação', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO programa (departamento_id, nome, descricao, ordem) VALUES
  (1, 'eSocial', 'Sistema de Escrituração Digital das Obrigações Fiscais', 1),
  (1, 'SEFIP', 'Sistema Empresa de Recolhimento do FGTS', 2),
  (2, 'SPED Fiscal', 'Sistema Público de Escrituração Digital', 1),
  (2, 'NFe', 'Nota Fiscal Eletrônica', 2),
  (3, 'Digisac', 'Sistema de atendimento e gestão', 1)
ON CONFLICT DO NOTHING;

INSERT INTO manual (titulo, conteudo, tags) VALUES
  ('Como enviar eventos S-1000', '# Enviando eventos S-1000

## Passo a passo

1. Acesse o menu eSocial
2. Clique em "Eventos"
3. Selecione S-1000
4. Preencha os dados
5. Clique em "Enviar"

## Observações importantes

- Sempre validar antes de enviar
- Guardar o recibo', ARRAY['esocial', 'eventos', 's-1000']),

  ('Configuração inicial do eSocial', '# Configuração inicial

Antes de começar a usar o eSocial, você precisa:

- Configurar os dados da empresa
- Cadastrar os responsáveis
- Validar as informações', ARRAY['esocial', 'configuracao']),

  ('Geração de SEFIP', '# Gerando SEFIP

## Passo a passo

1. Acesse o menu SEFIP
2. Selecione o período
3. Clique em "Gerar arquivo"
4. Salve o arquivo .sfi', ARRAY['sefip', 'fgts'])
ON CONFLICT DO NOTHING;

INSERT INTO programa_manual (programa_id, manual_id, ordem) VALUES
  (1, 1, 1),  -- Manual 1 no eSocial
  (1, 2, 2),  -- Manual 2 no eSocial
  (2, 3, 1)   -- Manual 3 no SEFIP
ON CONFLICT DO NOTHING;
