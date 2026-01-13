````markdown
# 🗂️ Taxonomy Web Menu - Construir Menu Hierárquico de Categorias

> **Endpoint da API REST que gera a árvore de categorias visível na vitrine web (B2B/B2C), aplicando filtros de tenant/loja e organização para retornar um menu estruturado com contagem de produtos.**

## Informações do Endpoint

| Propriedade | Valor |
| ----------- | ----- |
| **Método** | `POST` |
| **Path** | `/taxonomy/v2/taxonomy-find-menu` |
| **Autenticação** | `Authorization: Bearer {API_KEY}` ou `x-api-key: {API_KEY}` |
| **Consumo** | `application/json` |
| **Produção** | `application/json` |

## Autenticação e Tenant

Este endpoint exige autenticação via API Key. Inclua **ambos** os headers abaixo em todas as requisições do aplicativo cliente:

- `Authorization: Bearer {API_KEY}`
- `x-api-key: {API_KEY}`

Considere sempre o modelo multitenant da plataforma ERP:

- **`pe_system_client_id`** identifica o cliente (tenant) responsável pelos cadastros de taxonomia.
- **`pe_store_id`** aponta para a loja cujo menu web será montado.
- Utilize `pe_organization_id`, `pe_member_id`, `pe_user_id` e `pe_person_id` para rastreabilidade e enforcement de auditoria no domínio B2B/B2C.

## Interface (Request Body Schema)

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `pe_app_id` | `number` | Sim | Identificador da aplicação consumidora. Deve ser inteiro válido e não pode ser zero. |
| `pe_system_client_id` | `number` | Sim | Código do cliente (tenant) responsável pelas taxonomias. Controla o escopo multiempresa. |
| `pe_store_id` | `number` | Sim | Loja analisada no contexto omnichannel. Define qual catálogo será disponibilizado no menu web. |
| `pe_organization_id` | `string` | Sim | Organização do ERP (máx. 200 caracteres). Garante segregação por unidade de negócio. |
| `pe_member_id` | `string` | Sim | Membro/canal associado (máx. 200 caracteres). Utilizado para logs e rate limiting por canal. |
| `pe_user_id` | `string` | Sim | Usuário autenticado responsável pela chamada (máx. 200 caracteres). Obrigatório para auditoria. |
| `pe_person_id` | `number` | Sim | Pessoa associada ao usuário autenticado. Necessário para regras de personalização. |
| `pe_id_tipo` | `number` | Sim | Tipo de taxonomia desejado (ex.: menu web). Determina qual estrutura será retornada pela procedure. |
| `pe_parent_id` | `number` | Não | Limita a busca a partir de um nó pai específico. Quando omitido, retorna a árvore completa a partir das raízes. |

### Interface TypeScript

```typescript
interface TaxonomyWebMenuRequest {
  pe_app_id: number;
  pe_system_client_id: number;
  pe_store_id: number;
  pe_organization_id: string;
  pe_member_id: string;
  pe_user_id: string;
  pe_person_id: number;
  pe_id_tipo: number;
  pe_parent_id?: number;
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
    "pe_id_tipo": 2,
    "pe_parent_id": 10
}
```

## Resposta

A operação retorna HTTP 200 com payload padrão corporativo. A estrutura modela a árvore hierárquica de taxonomias, seguida dos metadados da stored procedure.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | `number` | Código corporativo. `100200` representa sucesso sem erros de negócio. |
| `message` | `string` | Mensagem descritiva retornada pela procedure (ex.: *"Cadastro Carregados com sucesso"*). |
| `recordId` | `number` | Identificador da primeira taxonomia encontrada. Retorna `0` quando não há registros. |
| `data` | `SpResultTaxonomyWebMenuData` | Estrutura em três posições:<br>**[0]** `TblTaxonomyWebMenu[]` já hierarquizado com propriedade `children` para cada nó.<br>**[1]** `SpDefaultFeedback[]` com mensagens técnicas (sp_return_id, sp_message, sp_error_id).<br>**[2]** `SpOperationResult` com métricas da execução MySQL. |
| `quantity` | `number` | Quantidade de blocos retornados (normalmente `3`). |
| `info1` | `string` | Informações auxiliares para diagnósticos. Mantém vazio quando não utilizado. |

### Estrutura TypeScript do Retorno

```typescript
import { SpResultTaxonomyWebMenuData } from 'src/taxonomy/types/taxonomy.type';

type TaxonomyWebMenuResponse = {
  statusCode: number;
  message: string;
  recordId: number;
  data: SpResultTaxonomyWebMenuData;
  quantity: number;
  info1: string;
};

// Principal nó do array data[0]
interface TblTaxonomyWebMenu {
  ID_TAXONOMY?: number;
  PARENT_ID?: number;
  TAXONOMIA?: string;
  PATH_IMAGEM?: string | null;
  SLUG?: string | null;
  LEVEL?: number;
  ORDEM?: number;
  ID_IMAGEM?: number | null;
  QT_RECORDS?: number | null;
  children?: TblTaxonomyWebMenu[];
}
```

### Exemplo de Resposta de Sucesso (HTTP 200)

```json
{
    "statusCode": 100200,
    "message": "Cadastro Carregados com sucesso",
    "recordId": 3403,
    "data": [
        [
            {
                "ID_TAXONOMY": 3403,
                "PARENT_ID": 0,
                "TAXONOMIA": "COMPONENTES",
                "PATH_IMAGEM": null,
                "SLUG": null,
                "LEVEL": 1,
                "ORDEM": 0,
                "ID_IMAGEM": null,
                "QT_RECORDS": 460,
                "children": [
                    {
                        "ID_TAXONOMY": 3404,
                        "PARENT_ID": 3403,
                        "TAXONOMIA": "FRONTAL",
                        "PATH_IMAGEM": null,
                        "SLUG": null,
                        "LEVEL": 2,
                        "ORDEM": 0,
                        "ID_IMAGEM": null,
                        "QT_RECORDS": 460,
                        "children": [
                            {
                                "ID_TAXONOMY": 3405,
                                "PARENT_ID": 3404,
                                "TAXONOMIA": "FRONTAL",
                                "PATH_IMAGEM": null,
                                "SLUG": null,
                                "LEVEL": 3,
                                "ORDEM": 0,
                                "ID_IMAGEM": null,
                                "QT_RECORDS": 460,
                                "children": []
                            }
                        ]
                    }
                ]
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
    "quantity": 3,
    "info1": ""
}
```

> **Notas**
> - Em condições normais, `statusCode` permanece em `100200`; erros de negócio retornam códigos da família `1004xx`, mantendo HTTP 200 para validações.
> - O array `data[0]` já vem com a propriedade `children`, preparada pela função `buildHierarchy`, facilitando o consumo direto pelo front-end.
> - `data[1]` replica o feedback da stored procedure, útil para logs e auditoria.
> - `data[2]` apresenta métricas MySQL (`SpOperationResult`) que auxiliam debugging e monitoramento.

## Erros Possíveis

| Status Code | HTTP | Cenário | Mensagem Típica |
| --- | --- | --- | --- |
| **100401** | 401 | API Key ausente ou inválida | `"Unauthorized: Invalid or missing API Key"` |
| **100403** | 403 | API Key sem permissão para o tenant/loja informados | `"Forbidden: Access denied for this store"` |
| **100400** | 400 | Parâmetros obrigatórios ausentes ou inválidos (ex.: `pe_id_tipo` não informado) | `"Bad Request: Invalid parameters"` |
| **100404** | 200 / conteúdo vazio | Nenhuma taxonomia localizada para o filtro solicitado | `"Not Found: Taxonomy hierarchy not available"` |
| **100500** | 500 | Falha interna ao executar a stored procedure ou acessar o banco | `"Internal Server Error: Failed to execute taxonomy web menu"` |

## Observações Operacionais

1. **Disponibilidade REST**: mantenha o consumo via HTTPS autenticado, respeitando o prefixo `/api` aplicado pela plataforma NestJS.
2. **Menu dinâmico**: use `pe_parent_id` quando precisar montar submenus sob demanda, evitando transferir árvores completas para telas específicas.
3. **Sincronização de mídia**: verifique `PATH_IMAGEM` antes de exibir banners no front-end; mantenha o storage/CDN alinhado ao ERP.
4. **Contagem de produtos**: o campo `QT_RECORDS` em cada nó indica volume de produtos relacionados; utilize-o para badges e priorização de categorias.
5. **Cache controlado**: é seguro aplicar cache curto (até 5 minutos) por combinação de tenant/loja/tipo de menu, preservando atualizações frequentes.
6. **Versionamento v2**: monitore futuras evoluções; endpoints `v3` podem incluir metadados adicionais (SEO, tags, etc.).
7. **Monitoramento**: registre `sp_error_id` e `sp_message` em observabilidade para investigar inconsistências na procedura `findTaxonomyWebMenu`.

---

[← Voltar ao Índice](../api-reference.md)

````
