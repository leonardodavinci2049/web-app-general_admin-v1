````markdown
# 🛍️ Product Web Find ID - Consultar Produto para Web por ID

> **Endpoint da API REST que recupera informações completas de um produto web (B2B/B2C) através do identificador interno ou slug, incluindo metadados de imagem, preços e taxonomias relacionadas.**

## Informações do Endpoint

| Propriedade | Valor                                   |
| ----------- | --------------------------------------- |
| **Método**  | `POST`                                  |
| **Path**    | `/product/v2/product-web-find-id`       |
| **Autenticação** | `Authorization: Bearer {API_KEY}` ou `x-api-key: {API_KEY}` |
| **Consumo** | `application/json`                      |
| **Produção**| `application/json`                      |

## Autenticação e Tenant

Este endpoint exige autenticação via API Key. Inclua **key** dos headers abaixo em todas as chamadas do aplicativo cliente:

- `Authorization: Bearer {API_KEY}`
- `x-api-key: {API_KEY}`

A chamada deve respeitar o modelo multitenant do ERP. Informe sempre:

- **`pe_system_client_id`**: identifica o cliente (organização) ao qual o produto pertence.
- **`pe_store_id`**: define a loja específica cujo catálogo será consultado.

## Interface (Request Body Schema)

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `pe_app_id` | `number` | Sim | Identificador da aplicação chamadora. Validado como inteiro e não pode ser vazio. |
| `pe_system_client_id` | `number` | Sim | ID do cliente do sistema (tenant). Deve ser inteiro válido. |
| `pe_store_id` | `number` | Sim | ID da loja onde o produto está publicado. |
| `pe_organization_id` | `string` | Sim | Código da organização (máx. 200 caracteres). Utilizado para auditoria multiorganização. |
| `pe_member_id` | `string` | Sim | Código do membro associado (máx. 200 caracteres). Necessário para rastreabilidade do canal. |
| `pe_user_id` | `string` | Sim | Identificador do usuário (máx. 200 caracteres) responsável pela consulta. |
| `pe_person_id` | `number` | Sim | ID da pessoa vinculada ao usuário autenticado. |
| `pe_type_business` | `number` | Sim | Segmento comercial desejado (ex.: 1=B2C, 2=B2B) para definir tabela de preços. |
| `pe_id_produto` | `number` | Sim | ID interno do produto a ser localizado. |
| `pe_slug_produto` | `string` | Sim | Slug amigável do produto (máx. 300 caracteres). Usado como fallback quando o ID não estiver disponível no canal. |

### Interface TypeScript

```typescript
interface ProductWebFindIdRequest {
  // Contexto da aplicação / tenant
  pe_app_id: number;
  pe_system_client_id: number;
  pe_store_id: number;
  pe_organization_id: string;
  pe_member_id: string;
  pe_user_id: string;
  pe_person_id: number;

  // Parâmetros de contexto comercial
  pe_type_business: number;

  // Identificadores do produto
  pe_id_produto: number;
  pe_slug_produto: string;
}
```

## Exemplo de Requisição

```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 100,
  "pe_store_id": 5,
  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",
  "pe_person_id": 999,
  "pe_type_business": 2,
  "pe_id_produto": 55768,
  "pe_slug_produto": "perfume-al-haramain-laventure-amber-oud-dubai-aqua"
}
```

## Resposta

A operação retorna HTTP 200 com payload no padrão corporativo. Os campos principais são:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | `number` | Código padrão da plataforma (100200 indica sucesso sem erros). |
| `message` | `string` | Mensagem humana sobre o resultado (ex.: *"Cadastro Carregados com sucesso"*). |
| `recordId` | `number` | ID do produto retornado pela stored procedure. |
| `data` | `SpProductWebFindIdDataType` | Estrutura em cinco posições:<br>**[0]** `tblProductWebId[]`: dados completos do produto para vitrine web (ID, SKU, nome, descrição, imagens, preços, estoque, medidas, flags, metadados SEO, etc.).<br>**[1]** `tbltaxonomy[]`: hierarquia de taxonomias associadas (categorias/família/grupo/subgrupo).<br>**[2]** `tblProductWebRelated[]`: produtos relacionados/similares para exibição na página web.<br>**[3]** `SpDefaultFeedback[]`: mensagens da stored procedure (sp_return_id, sp_message, sp_error_id).<br>**[4]** `SpOperationResult`: métricas internas da execução MySQL (affectedRows, insertId, etc.). |
| `quantity` | `number` | Quantidade de registros retornados (normalmente `1`). |
| `info1` | `string` | Campo auxiliar semânticamente livre (manter vazio quando não utilizado). |

### Estrutura TypeScript do Retorno

```typescript
// Tipo principal do retorno (data field)
type SpProductWebFindIdDataType = [
  tblProductWebId[],      // [0] Dados completos do produto web
  tbltaxonomy[],          // [1] Hierarquia de taxonomias
  tblProductWebRelated[], // [2] Produtos relacionados/similares
  SpDefaultFeedback[],    // [3] Feedback da stored procedure
  SpOperationResult,      // [4] Métricas da operação MySQL
];

// [0] Interface do produto web
interface tblProductWebId {
  ID_PRODUTO: number;
  SKU?: number;
  PRODUTO?: string;
  DESCRICAO_TAB?: string;
  ETIQUETA?: string;
  REF?: string;
  MODELO?: string;
  PATH_IMAGEM?: string | null;
  SLUG?: string | null;
  PATH_IMAGEM_MARCA?: string;
  ID_TIPO?: number;
  TIPO?: string;
  ID_MARCA?: number;
  MARCA?: string;
  VL_ATACADO?: number;
  VL_CORPORATIVO?: number;
  VL_VAREJO?: number;
  OURO?: number;
  PRATA?: number;
  BRONZE?: number;
  ESTOQUE_LOJA?: number;
  TEMPODEGARANTIA_DIA?: number;
  PESO_GR?: number;
  COMPRIMENTO_MM?: number;
  LARGURA_MM?: number;
  ALTURA_MM?: number;
  DIAMETRO_MM?: number;
  DESTAQUE?: number;
  PROMOCAO?: number;
  FLAG_SERVICO?: number;
  IMPORTADO?: number;
  DESCRICAO_VENDA?: string | null;
  ANOTACOES?: string | null;
  META_TITLE?: string | null;
  META_DESCRIPTION?: string | null;
  DT_UPDATE?: Date;
  DATADOCADASTRO?: Date;
}

// [1] Interface de taxonomia (categorias)
interface tbltaxonomy {
  ID_TAXONOMY?: number;
  PARENT_ID?: number;
  TAXONOMIA?: string | null;
  SLUG?: string | null;
  ORDEM?: number;
  LEVEL?: number;
}

// [2] Interface de produtos relacionados
interface tblProductWebRelated {
  ID_TAXONOMY?: number;
  SKU?: number;
  PRODUTO?: string;
  DESCRICAO_TAB?: string;
  ETIQUETA?: string;
  REF?: string;
  MODELO?: string;
  PATH_IMAGEM?: string | null;
  SLUG?: string | null;
  ESTOQUE_LOJA?: number;
  VL_ATACADO?: number;
  VL_CORPORATIVO?: number;
  VL_VAREJO?: number;
  IMPORTADO?: number;
  PROMOCAO?: number;
  LANCAMENTO?: number;
  DATADOCADASTRO?: Date;
}

// [3] Feedback padrão da stored procedure
interface SpDefaultFeedback {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

// [4] Resultado da operação no MySQL
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
    "message": "Informações processadas com sucesso",
    "recordId": 55768,
    "data": [
        [
            {
                "ID_PRODUTO": 55768,
                "SKU": 55768,
                "PRODUTO": "PERFUME AL HARAMAIN LAVENTURE AMBER OUD DUBAI AQUA UNISSEX EDP 100ML ARABE",
                "DESCRICAO_TAB": "",
                "ETIQUETA": "AL HARAMAIN LAVENTUR",
                "REF": "AMBER OUD DUBAI AQUA",
                "MODELO": "",
                "ID_IMAGEM": 0,
                "PATH_IMAGEM": "https://example.com/image.jpg",
                "SLUG": null,
                "ID_IMAGEM_MARCA": 0,
                "ID_TIPO": 9,
                "TIPO": "PERFUMARIA",
                "ID_MARCA": 1,
                "MARCA": "NONE",
                "ID_FORNECEDOR": 1,
                "FORNECEDOR": "Fornecedor Padrão de Referência",
                "ID_FAMILIA": 825,
                "ID_GRUPO": 826,
                "ID_SUBGRUPO": 827,
                "VL_ATACADO": "320.000000",
                "VL_CORPORATIVO": "374.000000",
                "VL_VAREJO": "400.000000",
                "OURO": "320.000000",
                "PRATA": "374.000000",
                "BRONZE": "400.000000",
                "ESTOQUE_LOJA": 0,
                "TEMPODEGARANTIA_DIA": 0,
                "PESO_GR": 0,
                "COMPRIMENTO_MM": 0,
                "LARGURA_MM": 0,
                "ALTURA_MM": 0,
                "DIAMETRO_MM": 0,
                "CFOP": "",
                "CST": "",
                "EAN": "",
                "NCM": 0,
                "NBM": "",
                "PPB": 0,
                "TEMP": "0.000000",
                "FLAG_CONTROLE_FISICO": 1,
                "CONTROLAR_ESTOQUE": 1,
                "CONSIGNADO": 0,
                "DESTAQUE": 0,
                "PROMOCAO": 0,
                "FLAG_SERVICO": 0,
                "FLAG_WEBSITE_OFF": 0,
                "INATIVO": 2,
                "IMPORTADO": 1,
                "DESCRICAO_VENDA": null,
                "ANOTACOES": null,
                "META_TITLE": "This is a meta title",
                "META_DESCRIPTION": "This is a meta description for the product",
                "DT_UPDATE": "2025-10-29T03:00:00.000Z",
                "DATADOCADASTRO": "2025-09-11T16:44:16.000Z"
            }
        ],
        [
            {
                "ID_TAXONOMY": 825,
                "PARENT_ID": 0,
                "TAXONOMIA": "A CLASSIFICAR",
                "SLUG": "",
                "ORDEM": 1,
                "LEVEL": 1
            },
            {
                "ID_TAXONOMY": 826,
                "PARENT_ID": 825,
                "TAXONOMIA": "Novidades",
                "SLUG": null,
                "ORDEM": 0,
                "LEVEL": 2
            },
            {
                "ID_TAXONOMY": 827,
                "PARENT_ID": 826,
                "TAXONOMIA": "Novidades",
                "SLUG": null,
                "ORDEM": 0,
                "LEVEL": 3
            }
        ],
        [
            {
                "ID_TAXONOMY": 826,
                "SKU": 55769,
                "PRODUTO": "PERFUME SIMILAR AL HARAMAIN LAVENTURE",
                "DESCRICAO_TAB": "Perfume importado de alta qualidade",
                "ETIQUETA": "AL HARAMAIN",
                "REF": "SIMILAR-001",
                "MODELO": "EDP 100ML",
                "PATH_IMAGEM": "https://example.com/related-1.jpg",
                "SLUG": "perfume-similar-al-haramain",
                "ESTOQUE_LOJA": 5,
                "VL_ATACADO": "300.000000",
                "VL_CORPORATIVO": "350.000000",
                "VL_VAREJO": "380.000000",
                "IMPORTADO": 1,
                "PROMOCAO": 0,
                "LANCAMENTO": 1,
                "DATADOCADASTRO": "2025-09-10T10:30:00.000Z"
            },
            {
                "ID_TAXONOMY": 826,
                "SKU": 55770,
                "PRODUTO": "PERFUME AMBER OUD COLLECTION",
                "DESCRICAO_TAB": "Linha premium de perfumes",
                "ETIQUETA": "AMBER OUD",
                "REF": "COLLECTION-002",
                "MODELO": "EDP 100ML",
                "PATH_IMAGEM": "https://example.com/related-2.jpg",
                "SLUG": "perfume-amber-oud-collection",
                "ESTOQUE_LOJA": 3,
                "VL_ATACADO": "350.000000",
                "VL_CORPORATIVO": "400.000000",
                "VL_VAREJO": "450.000000",
                "IMPORTADO": 1,
                "PROMOCAO": 1,
                "LANCAMENTO": 0,
                "DATADOCADASTRO": "2025-08-15T14:20:00.000Z"
            }
        ],
        [
            {
                "sp_return_id": 1,
                "sp_message": "Cadastro Carregados com sucesso",
                "sp_error_id": 0
            }
        ],
        {
            "fieldCount": 0,
            "affectedRows": 0,
            "insertId": 0,
            "info": "",
            "serverStatus": 34,
            "warningStatus": 0,
            "changedRows": 0
        }
    ],
    "quantity": 1,
    "info1": ""
}
```

> **Notas**
> - Em cenários de erro lógico, `statusCode` pode variar (ex.: `100400` para validação). O HTTP status permanece 200, salvo falhas críticas.
> - O array `data[0]` (produto principal) pode estar vazio se o produto não for encontrado, mantendo o restante da estrutura para diagnósticos.
> - O array `data[2]` (produtos relacionados) pode estar vazio caso não existam produtos similares cadastrados na mesma taxonomia.
> - A estrutura completa do retorno segue o tipo `SpProductWebFindIdDataType` definido em `src/product/types/product.type.ts`.

## Erros Possíveis

| Status Code | HTTP | Cenário | Mensagem Típica |
| --- | --- | --- | --- |
| **100401** | 401 | API Key ausente ou inválida | `"Unauthorized: Invalid or missing API Key"` |
| **100403** | 403 | API Key sem permissão para o tenant/loja informados | `"Forbidden: Access denied for this store"` |
| **100404** | 200 / conteúdo vazio | Produto não localizado para o par (`pe_id_produto`, `pe_slug_produto`) | `"Not Found: Product with ID 55768 does not exist"` |
| **100400** | 400 | Campos obrigatórios ausentes ou formato inválido (ex.: string acima do limite) | `"Bad Request: Invalid parameters"` |
| **100500** | 500 | Falha interna ao consultar procedure ou banco | `"Internal Server Error: Failed to execute product lookup"` |

## Observações Operacionais

1. **Uso omnichannel**: indicado para vitrines web/mobile que precisam do detalhe completo do produto com preços segmentados por perfil comercial (`pe_type_business`).
2. **Consistência de identificadores**: forneça simultaneamente `pe_id_produto` e `pe_slug_produto` para garantir fallback em integrações que trafegam apenas slug.
3. **Dados de mídia**: verifique `PATH_IMAGEM` e `PATH_IMAGEM_MARCA` antes de exibir; mantenha CDN ou storage sincronizado com o ERP.
4. **Taxonomias encadeadas**: utilize o bloco `data[1]` para montar breadcrumbs ou filtros hierárquicos no front-end.
5. **Produtos relacionados**: o bloco `data[2]` contém produtos similares/relacionados da mesma taxonomia, útil para seções "Você também pode gostar" ou "Produtos Similares" na página do produto.
6. **Política de cache**: responses podem ser cacheadas curto prazo (até 5 min) respeitando variações por tenant, loja e tipo de negócio.
7. **Estrutura de tipos**: o retorno segue fielmente o tipo `SpProductWebFindIdDataType` definido em `src/product/types/product.type.ts` para garantir type-safety no desenvolvimento.

---

[← Voltar ao Índice](../api-reference.md)

````
