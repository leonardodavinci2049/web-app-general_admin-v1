````markdown
# 🛍️ Product Web Find - Consultar Produtos para Web com Filtros

> **Endpoint da API REST que recupera uma listagem paginada de produtos web (B2B/B2C) aplicando múltiplos critérios de busca, incluindo taxonomias, marcas, disponibilidade de estoque e ordenação customizada.**

## Informações do Endpoint

| Propriedade | Valor                                   |
| ----------- | --------------------------------------- |
| **Método**  | `POST`                                  |
| **Path**    | `/product/v2/product-web-find`          |
| **Autenticação** | `Authorization: Bearer {API_KEY}` ou `x-api-key: {API_KEY}` |
| **Consumo** | `application/json`                      |
| **Produção**| `application/json`                      |

## Autenticação e Tenant

Este endpoint exige autenticação via API Key. Inclua **uma** das headers abaixo em todas as chamadas do aplicativo cliente:

- `Authorization: Bearer {API_KEY}`
- `x-api-key: {API_KEY}`

A chamada deve respeitar o modelo multitenant do ERP. Informe sempre:

- **`pe_system_client_id`**: identifica o cliente (organização) ao qual os produtos pertencem.
- **`pe_store_id`**: define a loja específica cujo catálogo será consultado.

## Interface (Request Body Schema)

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `pe_app_id` | `number` | Não | Identificador da aplicação chamadora. Validado como inteiro. |
| `pe_system_client_id` | `number` | Não | ID do cliente do sistema (tenant). Deve ser inteiro válido. |
| `pe_store_id` | `number` | Não | ID da loja onde os produtos estão publicados. |
| `pe_organization_id` | `string` | Não | Código da organização (máx. 200 caracteres). Utilizado para auditoria multiorganização. |
| `pe_member_id` | `string` | Não | Código do membro associado (máx. 200 caracteres). Necessário para rastreabilidade do canal. |
| `pe_user_id` | `string` | Não | Identificador do usuário (máx. 200 caracteres) responsável pela consulta. |
| `pe_person_id` | `number` | Não | ID da pessoa vinculada ao usuário autenticado. |
| `pe_id_taxonomy` | `number` | Não | ID da taxonomia/categoria para filtrar produtos. Se informado, retorna apenas produtos associados à categoria especificada. |
| `pe_slug_taxonomy` | `string` | Não | Slug da taxonomia/categoria (máx. 300 caracteres). Alternativa ao `pe_id_taxonomy` para busca por URL amigável. |
| `pe_id_produto` | `number` | Não | ID interno do produto específico. Útil para consultas direcionadas a um único produto. |
| `pe_produto` | `string` | Não | Nome ou termo de busca do produto (máx. 300 caracteres). Realiza busca parcial nos campos `PRODUTO`, `DESCRICAO_TAB` e `REF`. |
| `pe_id_marca` | `number` | Não | ID da marca para filtrar produtos. Retorna apenas produtos da marca especificada. |
| `pe_flag_estoque` | `number` | Não | Flag de estoque (0 ou 1). Se `1`, retorna apenas produtos com estoque disponível na loja (`ESTOQUE_LOJA > 0`). |
| `pe_qt_registros` | `number` | Não | Quantidade de registros por página (limite). Padrão: 20. Máximo recomendado: 100. |
| `pe_pagina_id` | `number` | Não | Número da página para paginação (baseado em 0). Padrão: 1. |
| `pe_coluna_id` | `number` | Não | ID da coluna para ordenação (ex.: 1=PRODUTO, 2=PRECO, 3=DATA). Consulte documentação técnica para mapeamento completo. |
| `pe_ordem_id` | `number` | Não | Direção da ordenação (1=ASC, 2=DESC). Padrão: 1. |

### Interface TypeScript

```typescript
interface ProductWebFindRequest {
  // Contexto da aplicação / tenant
  pe_app_id?: number;
  pe_system_client_id?: number;
  pe_store_id?: number;
  pe_organization_id?: string;
  pe_member_id?: string;
  pe_user_id?: string;
  pe_person_id?: number;

  // Filtros de busca
  pe_id_taxonomy?: number;
  pe_slug_taxonomy?: string;
  pe_id_produto?: number;
  pe_produto?: string;
  pe_id_marca?: number;
  pe_flag_estoque?: number;

  // Paginação e ordenação
  pe_qt_registros?: number;
  pe_pagina_id?: number;
  pe_coluna_id?: number;
  pe_ordem_id?: number;
}
```

## Exemplo de Requisição

```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_organization_id": "ORG001",
  "pe_member_id": "MEM001",
  "pe_user_id": "USER001",
  "pe_person_id": 1,
  "pe_id_taxonomy": 0,
  "pe_slug_taxonomy": "categoria-exemplo",
  "pe_id_produto": 0,
  "pe_produto": "",
  "pe_id_marca": 0,
  "pe_flag_estoque": 0,
  "pe_qt_registros": 10,
  "pe_pagina_id": 0,
  "pe_coluna_id": 1,
  "pe_ordem_id": 1
}
```

## Resposta

A operação retorna HTTP 200 com payload no padrão corporativo. Os campos principais são:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | `number` | Código padrão da plataforma (100200 indica sucesso sem erros). |
| `message` | `string` | Mensagem humana sobre o resultado (ex.: *"Produtos carregado com sucesso"*). |
| `recordId` | `number` | ID do primeiro produto retornado na listagem. |
| `data` | `array` | Estrutura em três posições:<br>1. `tblProductWebFind[]`: array de produtos com dados de vitrine web.<br>2. `SpDefaultFeedback[]`: mensagens da stored procedure.<br>3. `SpOperationResult`: métricas internas da execução MySQL. |
| `quantity` | `number` | Quantidade de registros retornados na página atual. |
| `info1` | `string` | Campo auxiliar semânticamente livre (manter vazio quando não utilizado). |

### Exemplo de Resposta de Sucesso (HTTP 200)

```json
{
    "statusCode": 100200,
    "message": "Produtos carregado com sucesso",
    "recordId": 4918,
    "data": [
        [
            {
                "ID_PRODUTO": 4918,
                "SKU": 4918,
                "PRODUTO": "PERFUME CALVIN KLEIN ETERNITY MASCULINO EDT 100ML",
                "DESCRICAO_TAB": "PERFUME CALVIN KLEIN ETERNITY",
                "ETIQUETA": "CK ETERNITY MASCULINO ",
                "REF": "Floral amadeirado 100ML",
                "MODELO": "IMPORTADO MASCULINO",
                "TIPO": "PERFUMARIA",
                "MARCA": "NONE",
                "PATH_IMAGEM_MARCA": "",
                "PATH_IMAGEM": "https://mundialmegastore.com.br/wp-content/uploads/2019/12/perfume-calvin-klein-eternity-masculino-edt-100-ml-4918-2000-43116.jpg",
                "SLUG": "perfume-calvin-klein-eternity-masculino-edt-100ml",
                "ESTOQUE_LOJA": 3,
                "OURO": "223.000000",
                "PRATA": "249.000000",
                "BRONZE": "259.000000",
                "VL_ATACADO": "223.000000",
                "VL_CORPORATIVO": "249.000000",
                "VL_VAREJO": "259.000000",
                "DECONTO": "0.000000",
                "TEMPODEGARANTIA_DIA": 0,
                "DESCRICAO_VENDA": "AGUA PERFUMADA\r\nPAIS DE ORIGEM: FRANÇA\r\nMANTER FORA DO ALCANCE DE CRIANÇAS INFLAMÁVEL EVITE CONTATO COM OS OLHOS E MUCOSAS NÃO USAR EM PELE IRRITADA OU LESIONADA EM CASO DE IRRITAÇÃO, SUSPENDA O USO\r\nAPLIQUE SOBRE A PELE\r\nREG N° 25351792707/2018-16 \r\nIMPORTADO POR ENCOMENDA DE PUIG BRASIL\r\nCOMERCIALIZADORA DE PERFUMES LTDA \r\nAV DAS AMERICAS 3301 - B 03, S202/301 – RJ\r\nCNPJ 04177443/0001-03 - SAC 0800 704 3440\r\nAFE 203186-1\r\n0065116885",
                "IMPORTADO": 1,
                "PROMOCAO": 0,
                "LANCAMENTO": 0,
                "DATADOCADASTRO": "2014-02-07T17:53:46.000Z"
            },
            {
                "ID_PRODUTO": 4920,
                "SKU": 4920,
                "PRODUTO": "PERFUME CAROLINA HERRERA 212 MEN MASCULINO TRADICIONAL EDT 100ML",
                "DESCRICAO_TAB": "PERFUME CAROLINA HERRERA 212 MEN",
                "ETIQUETA": "CH 212 MEN TRADICIONAL",
                "REF": "MASCULINO EDT 100ML",
                "MODELO": "IMPORTADO MASCULINO",
                "TIPO": "PERFUMARIA",
                "MARCA": "NONE",
                "PATH_IMAGEM_MARCA": "",
                "PATH_IMAGEM": "https://mundialmegastore.com.br/wp-content/uploads/2019/12/perfume-carolina-herrera-212-men-masculino-tradicional-edt-100-ml-4920-2000-43158.jpg",
                "SLUG": "perfume-carolina-herrera-212-men-masculino-tradicional-edt-100ml",
                "ESTOQUE_LOJA": 5,
                "OURO": "410.000000",
                "PRATA": "450.000000",
                "BRONZE": "468.000000",
                "VL_ATACADO": "410.000000",
                "VL_CORPORATIVO": "450.000000",
                "VL_VAREJO": "468.000000",
                "DECONTO": "0.000000",
                "TEMPODEGARANTIA_DIA": 0,
                "DESCRICAO_VENDA": "AGUA PERFUMADA\r\nPAIS DE ORIGEM: ESPANHA\r\nMANTER FORA DO ALCANCE DE CRIANÇAS INFLAMÁVEL EVITE CONTATO COM OS OLHOS E MUCOSAS NÃO USAR EM PELE IRRITADA OU LESIONADA EM CASO DE IRRITAÇÃO, SUSPENDA O USO\r\nAPLIQUE SOBRE A PELE\r\nREG N° 25351.215026/2017-59\r\nIMPORTADO POR ENCOMENDA DE PUIG BRASIL\r\nCOMERCIALIZADORA DE PERFUMES LTDA \r\nAV DAS AMERICAS 3301 - B 03, S202/301 – RJ\r\nCNPJ 04177443/0001-03 - SAC 0800 704 3440\r\nAFE 203186-1\r\n0065116885",
                "IMPORTADO": 1,
                "PROMOCAO": 0,
                "LANCAMENTO": 1,
                "DATADOCADASTRO": "2014-04-01T12:09:02.000Z"
            },
 

        [
            {
                "sp_return_id": 10,
                "sp_message": "Produtos carregado com sucesso",
                "sp_error_id": 0
            }
        ],
        {
            "fieldCount": 0,
            "affectedRows": 0,
            "insertId": 0,
            "info": "",
            "serverStatus": 2,
            "warningStatus": 0,
            "changedRows": 0
        }
    ],
    "quantity": 10,
    "info1": ""
}
```

> **Notas**
> - Em cenários de erro lógico, `statusCode` pode variar (ex.: `100400` para validação). O HTTP status permanece 200, salvo falhas críticas.
> - O array `data[0]` retorna vazio se nenhum produto corresponder aos filtros aplicados, mantendo o restante da estrutura para diagnósticos.
> - A paginação é controlada pela combinação de `pe_qt_registros` e `pe_pagina_id`. Para recuperar todas as páginas, incremente `pe_pagina_id` até receber `quantity: 0`.

## Erros Possíveis

| Status Code | HTTP | Cenário | Mensagem Típica |
| --- | --- | --- | --- |
| **100401** | 401 | API Key ausente ou inválida | `"Unauthorized: Invalid or missing API Key"` |
| **100403** | 403 | API Key sem permissão para o tenant/loja informados | `"Forbidden: Access denied for this store"` |
| **100404** | 200 / conteúdo vazio | Nenhum produto encontrado com os filtros aplicados | `"Not Found: No products match the given criteria"` |
| **100400** | 400 | Campos com formato inválido (ex.: `pe_qt_registros` negativo, string acima do limite) | `"Bad Request: Invalid parameters"` |
| **100422** | 422 | Combinação inválida de filtros (ex.: `pe_id_taxonomy` e `pe_slug_taxonomy` conflitantes) | `"Unprocessable Entity: Conflicting filter parameters"` |
| **100500** | 500 | Falha interna ao consultar procedure ou banco | `"Internal Server Error: Failed to execute product search"` |

## Observações Operacionais

1. **Uso omnichannel**: ideal para vitrines web/mobile, páginas de categoria, listagens de busca e seções de produtos em destaque (lançamentos, promoções).
2. **Performance de busca textual**: o campo `pe_produto` realiza busca parcial (LIKE) nos campos `PRODUTO`, `DESCRICAO_TAB` e `REF`. Para grandes volumes, considere indexação full-text no banco de dados.
3. **Filtro de estoque**: configure `pe_flag_estoque: 1` para exibir apenas produtos disponíveis, evitando frustração do cliente com itens indisponíveis.
4. **Combinação de filtros**: todos os filtros são aplicados cumulativamente (operador AND). Para buscas mais abrangentes, execute múltiplas requisições ou ajuste a lógica na stored procedure.
5. **Controle de paginação**: recomenda-se limitar `pe_qt_registros` a no máximo 100 produtos por página para garantir tempo de resposta adequado (< 500ms).
6. **Ordenação customizada**: utilize `pe_coluna_id` e `pe_ordem_id` para implementar ordenação por popularidade, preço crescente/decrescente, lançamentos ou alfabética.
7. **Cache de catálogo**: responses podem ser cacheadas por 5-15 minutos, respeitando invalidação ao detectar mudanças de preço ou estoque via webhooks/eventos.
8. **Dados de mídia**: verifique `PATH_IMAGEM` e `PATH_IMAGEM_MARCA` antes de renderizar; mantenha CDN ou storage sincronizado com o ERP para evitar imagens quebradas.
9. **Taxonomias**: combine com o endpoint `/taxonomy/v2/taxonomy-find` para montar filtros hierárquicos e breadcrumbs dinâmicos.
10. **Preços segmentados**: os valores `OURO`, `PRATA`, `BRONZE` representam tabelas de preço B2B. `VL_ATACADO`, `VL_CORPORATIVO` e `VL_VAREJO` são os preços padrão do segmento. Implemente lógica no client para exibir o preço adequado ao perfil do usuário autenticado.

---

[← Voltar ao Índice](../api-reference.md)

````
