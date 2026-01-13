`````markdown
````markdown
# 🧩 Product Web Sections - Consultar Seções Web de Produto

> **Endpoint da API REST que retorna coleções de produtos organizadas por seções web (B2B/B2C), incluindo metadados, preços e feedback operacional para vitrines autenticadas.**

## Informações do Endpoint

| Propriedade | Valor |
| ----------- | ----- |
| **Método** | `POST` |
| **Path** | `/product/v2/product-web-sections` |
| **Autenticação** | `Authorization: Bearer {API_KEY}` ou `x-api-key: {API_KEY}` |
| **Consumo** | `application/json` |
| **Produção** | `application/json` |

## Autenticação e Tenant

Este endpoint requer autenticação via API Key. Inclua obrigatoriamente os headers abaixo em todas as chamadas do aplicativo cliente:

- `Authorization: Bearer {API_KEY}`
- `x-api-key: {API_KEY}`

Respeite o modelo multitenant da plataforma. Informe sempre:

- **`pe_system_client_id`**: identifica o cliente (tenant) cujo catálogo será processado.
- **`pe_store_id`**: determina a loja responsável pelo sortimento da seção web.

## Interface (Request Body Schema)

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `pe_app_id` | `number` | Não | Identificador da aplicação chamadora. Aceita inteiros positivos; usado para auditoria da origem do tráfego. |
| `pe_system_client_id` | `number` | Não | ID do cliente (tenant) responsável pelo catálogo. Quando ausente, a procedure aplica o contexto padrão configurado para a chave. |
| `pe_store_id` | `number` | Não | ID da loja cuja seção de produtos será exibida. Mantém coerência com o estoque multi-loja. |
| `pe_organization_id` | `string` | Não | Código da organização (máx. 200 caracteres). Permite rastrear ambientes multiempresa. |
| `pe_member_id` | `string` | Não | Identificador do membro/parceiro (máx. 200 caracteres) vinculado à requisição. |
| `pe_user_id` | `string` | Não | Identificador do usuário autenticado (máx. 200 caracteres). Ajuda na trilha de auditoria. |
| `pe_person_id` | `number` | Não | Pessoa associada ao usuário. Utilizado para personalização baseada em cadastro. |
| `pe_id_taxonomy` | `number` | Não | ID da taxonomia base da vitrine. Filtra os produtos pertencentes à categoria desejada. |
| `pe_id_marca` | `number` | Não | ID da marca a ser destacada na seção. Útil para vitrines exclusivas de fornecedor. |
| `pe_id_tipo` | `number` | Não | ID de tipo de produto (segmento). Complementa o recorte da vitrine. |
| `pe_flag_promotions` | `number` | Não | Flag para priorizar produtos em promoção (0/1). |
| `pe_flag_highlight` | `number` | Não | Flag para destacar produtos em vitrines especiais (0/1). |
| `pe_flag_lancamento` | `number` | Não | Indica inclusão apenas de lançamentos (0/1). |
| `pe_qt_registros` | `number` | Não | Limite de registros retornados. Use para paginar ou montar grades controladas. |
| `pe_pagina_id` | `number` | Não | Identificador lógico da página que exibirá a seção. Apoia relatórios de navegação. |
| `pe_coluna_id` | `number` | Não | Identificador da coluna ou slot de layout. Permite ordenar blocos no front-end. |
| `pe_ordem_id` | `number` | Não | Ordenador adicional da seção dentro da página. |

### Interface TypeScript

```typescript
interface ProductWebSectionsRequest {
 pe_app_id?: number;
 pe_system_client_id?: number;
 pe_store_id?: number;
 pe_organization_id?: string;
 pe_member_id?: string;
 pe_user_id?: string;
 pe_person_id?: number;
 pe_id_taxonomy?: number;
 pe_id_marca?: number;
 pe_id_tipo?: number;
 pe_flag_promotions?: number;
 pe_flag_highlight?: number;
 pe_flag_lancamento?: number;
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
 "pe_id_taxonomy": 1,
 "pe_id_marca": 1,
 "pe_id_tipo": 1,
 "pe_flag_promotions": 1,
 "pe_flag_highlight": 1,
 "pe_flag_lancamento": 1,
 "pe_qt_registros": 10,
 "pe_pagina_id": 0,
 "pe_coluna_id": 1,
 "pe_ordem_id": 1
}
```

## Resposta

O serviço retorna HTTP 200 com a estrutura operacional padrão da plataforma. Os campos principais são:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | `number` | Código corporativo (100200 indica execução concluída sem erros). |
| `message` | `string` | Mensagem amigável descrevendo o resultado da procedure. |
| `recordId` | `number` | Identificador principal relacionado ao primeiro produto retornado. |
| `data` | `SpProductWebSectionsDataType` | Array com três posições: <br>**[0]** `tblProductWebSections[]`: lista de produtos preparados para exibição em seções web (SKU, nomes comerciais, metadados de preço, estoque, imagem e flags comerciais).<br>**[1]** `SpDefaultFeedback[]`: mensagens formais da stored procedure (`sp_return_id`, `sp_message`, `sp_error_id`).<br>**[2]** `SpOperationResult`: métricas técnicas do MySQL (affectedRows, serverStatus, warningStatus, etc.). |
| `quantity` | `number` | Quantidade total de registros retornados. Útil para paginação ou métricas de vitrine. |
| `info1` | `string` | Campo suplementar reservado para informações adicionais da operação. Geralmente vazio. |

### Estrutura TypeScript do Retorno

```typescript
type SpProductWebSectionsDataType = [
 tblProductWebSections[], // [0] Produtos formatados para seções web
 SpDefaultFeedback[],     // [1] Feedback da stored procedure
 SpOperationResult,       // [2] Métricas da operação MySQL
];

interface tblProductWebSections {
 ID_PRODUTO: number;
 SKU?: number;
 PRODUTO?: string;
 DESCRICAO_TAB?: string;
 ETIQUETA?: string;
 REF?: string;
 MODELO?: string;
 TIPO?: string;
 MARCA?: string;
 PATH_IMAGEM_MARCA?: string;
 PATH_IMAGEM?: string | null;
 SLUG?: string | null;
 ESTOQUE_LOJA?: number;
 OURO?: number;
 PRATA?: number;
 BRONZE?: number;
 VL_ATACADO?: number;
 VL_CORPORATIVO?: number;
 VL_VAREJO?: number;
 DECONTO?: number;
 TEMPODEGARANTIA_DIA?: number;
 DESCRICAO_VENDA?: string | null;
 IMPORTADO?: number;
 PROMOCAO?: number;
 LANCAMENTO?: number;
 DATADOCADASTRO?: Date;
}

interface SpDefaultFeedback {
 sp_return_id: number;
 sp_message: string;
 sp_error_id: number;
}

interface SpOperationResult {
 fieldCount: number;
 affectedRows: number;
 insertId: number;
 info: string;
 serverStatus: number;
 warningStatus: number;
 changedRows: number;
}
```

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
        "ID_PRODUTO": 5173,
        "SKU": 5173,
        "PRODUTO": "PERFUME FERRARI SCUDERIA RED MASCULINO EDT 125ML",
        "DESCRICAO_TAB": "PERFUME FERRARI SCUDERIA RED",
        "ETIQUETA": "FERRARI RED SCUDERIA",
        "REF": "MASCULINO EDT 125ML",
        "MODELO": "IMPORTADO MASCULINO",
        "TIPO": "PERFUMARIA",
        "MARCA": "NONE",
        "PATH_IMAGEM_MARCA": "",
        "PATH_IMAGEM": "https://mundialmegastore.com.br/wp-content/uploads/2019/12/perfume-ferrari-scuderia-red-masculino-edt-125ml-5173-2000-204336-2.jpg",
        "SLUG": "perfume-ferrari-scuderia-red-masculino-edt-125ml",
        "ESTOQUE_LOJA": 2,
        "OURO": "135.000000",
        "PRATA": "150.000000",
        "BRONZE": "165.000000",
        "VL_ATACADO": "135.000000",
        "VL_CORPORATIVO": "150.000000",
        "VL_VAREJO": "165.000000",
        "DECONTO": "0.000000",
        "TEMPODEGARANTIA_DIA": 0,
        "DESCRICAO_VENDA": "AGUA PERFUMADA\r\nPAIS DE ORIGEM: ITÁLIA\r\nMANTER FORA DO ALCANCE DE CRIANÇAS INFLAMÁVEL EVITE CONTATO COM OS OLHOS E MUCOSAS NÃO USAR EM PELE IRRITADA OU LESIONADA EM CASO DE IRRITAÇÃO, SUSPENDA O USO\r\nAPLIQUE SOBRE A PELE\r\nREG N° 25351.215026/2017-59\r\nIMPORTADO POR ENCOMENDA DE PUIG BRASIL\r\nCOMERCIALIZADORA DE PERFUMES LTDA \r\nAV DAS AMERICAS 3301 - B 03, S202/301 – RJ\r\nCNPJ 04177443/0001-03 - SAC 0800 704 3440\r\nAFE 203186-1\r\n0065116885",
        "IMPORTADO": 1,
        "PROMOCAO": 0,
        "LANCAMENTO": 0,
        "DATADOCADASTRO": "2014-02-22T12:51:45.000Z"
      }
    ],
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
> - O `statusCode` pode variar em cenários de validação (ex.: `100400`) mantendo HTTP 200 quando a procedure executa com sucesso técnico.
> - A posição `data[0]` pode retornar vazia quando não existem produtos para os filtros informados, preservando feedback e métricas para diagnóstico.
> - Utilize `data[1]` para exibir mensagens operacionais ao usuário final somente quando `sp_error_id` for diferente de zero.
> - A definição completa dos tipos está em `src/product/types/product.type.ts`, garantindo alinhamento com o contrato Prisma/MySQL.

## Erros Possíveis

| Status Code | HTTP | Cenário | Mensagem Típica |
| --- | --- | --- | --- |
| **100401** | 401 | Headers de autenticação ausentes ou incorretos | "Unauthorized: Invalid or missing API Key" |
| **100403** | 403 | Chave sem permissão para o tenant/loja solicitados | "Forbidden: Access denied for this store" |
| **100400** | 400 | Parâmetros inválidos ou fora do limite (ex.: strings > 200 caracteres) | "Bad Request: Invalid parameters" |
| **100404** | 200 / payload vazio | Nenhum produto encontrado para a seção solicitada | "Not Found: Product web section not available" |
| **100500** | 500 | Falha interna ao executar a stored procedure ou conectar ao banco | "Internal Server Error: Failed to execute product web sections" |

## Observações Operacionais

1. Utilize este endpoint para montar vitrines de homepage, landing pages sazonais ou coleções temáticas em canais web e mobile.
2. Combine `pe_id_taxonomy`, `pe_id_marca` e flags comerciais para curadoria precisa, evitando sobrecarga de processamento no front-end.
3. Respeite o limite de registros (`pe_qt_registros`) e implemente cache curto (até 5 minutos) por tenant e loja para otimizar latência.
4. Valide URLs de imagem (`PATH_IMAGEM`, `PATH_IMAGEM_MARCA`) com o storage/CDN antes de publicar em produção.
5. A versão `v2` incorpora ajustes de performance e ordenação; mantenha consistência com integrações existentes antes de migrar.
6. Em cenários de pré-venda, combine o resultado com dados de estoque em tempo real para evitar exposição de produtos indisponíveis.

---

[← Voltar ao Índice](../api-reference.md)

````

`````
