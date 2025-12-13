// DADOS DO BANCO DE DADOS
//OS NOMES DAS TABELAS E CAMPOS SÃO OS REAIS DO SUPABASE
// OS DADOS AQUI SÃO APENAS PARA ORGANIZAÇÃO E CONSULTA.
// EVITE USAR OS NOMES NO APLICAITVO

# Estrutura do Banco

## TipoExames
- **id**: bigint (IDENTITY)  
- **created_at**: timestamp tz (default now())  
- **nome**: text  
- **PRIMARY KEY**: id  

## colaboradores
- **identificador**: uuid (default gen_random_uuid())  
- **created_at**: timestamp tz (default now())  
- **funcao**: text  
- **externo**: boolean  
- **nome_completo**: text  
- **registro_empresa**: text  
- **telefone**: text  
- **registro_profissional**: text  
- **numero_registro**: text  
- **identificador_usuario**: uuid (FK → auth.users.id)  
- **id**: integer  
- **PRIMARY KEY**: identificador  

## estoque
- **id**: bigint (IDENTITY)  
- **created_at**: timestamp tz (default now())  
- **nome**: text  
- **tipo**: text  
- **PRIMARY KEY**: id  

## exame_rx
- **id**: bigint (IDENTITY)  
- **created_at**: timestamp tz (default now())  
- **imagem_exame**: text  
- **codexame**: numeric  
- **laudo**: text  
- **historico**: text  
- **pxmm**: numeric  
- **realizado**: boolean  
- **radiologista**: text  
- **idpaciente**: uuid (FK → paciente.codigo)  
- **anatomia**: array  
- **PRIMARY KEY**: id  

## insumos
- **id**: bigint (IDENTITY)  
- **created_at**: timestamp tz (default now())  
- **nome**: text  
- **categoria**: text  
- **quantidade**: numeric  
- **nivel_reposicao**: numeric  
- **lote**: text  
- **PRIMARY KEY**: id  

## internacoes
- **identificador**: uuid (default gen_random_uuid())  
- **created_at**: timestamp tz (default now())  
- **identificador_paciente**: uuid (FK → paciente.codigo)  
- **convenio**: text  
- **quarto**: numeric  
- **identificador_usuario**: uuid (FK → auth.users.id)  
- **leito**: text  
- **PRIMARY KEY**: identificador  

## item_prescricao
- **created_at**: timestamp tz (default now())  
- **identificado_prescricao**: uuid (FK → prescricoes.identificador)  
- **produto**: text  
- **frequencia**: numeric  
- **senecessario**: boolean  
- **apresentacao**: text  
- **horario**: array  
- **via_adm**: text  
- **quantidade**: numeric  
- **devolver**: numeric  
- **observacoes**: text  
- **ordem**: numeric  
- **obs_apos**: text  
- **id_item**: uuid (default gen_random_uuid())  
- **PRIMARY KEY**: id_item  

## paciente
- **id**: bigint (IDENTITY)  
- **created_at**: timestamp tz (default now())  
- **nome_completo**: text  
- **documento_registro**: text  
- **codigo**: uuid (default gen_random_uuid())  
- **identificador**: text  
- **data_de_nascimento**: date  
- **internado**: boolean  
- **alergias**: text  
- **comorbidades**: text  
- **PRIMARY KEY**: codigo  

## prescricoes
- **created_at**: timestamp tz (default now())  
- **identificador**: uuid (default gen_random_uuid())  
- **identificado_medico**: uuid (FK → auth.users.id)  
- **nome_medico**: text  
- **quarto**: text  
- **leito**: text  
- **registro_prontuario**: text  
- **convenio**: text  
- **id_paciente**: uuid (FK → paciente.codigo)  
- **hra_inicio**: timestamp tz  
- **hra_final**: timestamp tz  
- **status**: text  
- **tipo**: text  
- **prescricao_original**: uuid (FK → prescricoes.identificador)  
- **data_prescricao**: date  
- **PRIMARY KEY**: identificador  
