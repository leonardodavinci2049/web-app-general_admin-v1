# API Reference - Brand Management

## Listar Marcas v2

**Endpoint:** `POST /api/brand/v2/find-all`  
**Método:** `brandFindAllV2`  
**Autenticação:** Requerida (API Key)  
**Rate Limit:** 500 requisições por minuto

### Descrição

Endpoint para listar marcas cadastradas no sistema com suporte a filtros avançados e paginação. Retorna informações detalhadas das marcas disponíveis para o sistema, cliente e loja especificados.

### Headers Obrigatórios

```http
Authorization: Bearer 9fc735176b51137b87d4303011dee5eb
Content-Type: application/json
```

### Parâmetros de Entrada (Body)

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| `pe_app_id` | number | Sim | ID da aplicação | `1` |
| `pe_system_client_id` | number | Sim | ID do cliente do sistema | `1` |
| `pe_store_id` | number | Sim | ID da loja | `1` |
| `pe_organization_id` | string | Não | ID da organização | `"ORG_12345"` |
| `pe_member_id` | string | Não | ID do membro | `"MBR_67890"` |
| `pe_user_id` | string | Não | ID do usuário | `"USR_54321"` |
| `pe_person_id` | number | Não | ID da pessoa | `999` |
| `pe_id_marca` | number | Não | ID específico da marca para filtro | `0` |
| `pe_marca` | string | Não | Nome da marca para filtro | `""` |
| `pe_limit` | number | Não | Limite de registros retornados | `100` |

### Exemplo de Requisição

```http
POST /api/brand/v2/find-all
Authorization: Bearer 9fc735176b51137b87d4303011dee5eb
Content-Type: application/json
```

```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",
  "pe_person_id": 999,
  "pe_id_marca": 0,
  "pe_marca": "",
  "pe_limit": 100
}
```

### Resposta de Sucesso

**Status Code:** `200 OK`

```json
{
  "statusCode": 100200,
  "message": "Cadastro Carregados com sucesso",
  "recordId": 11,
  "data": [
    [
      {
        "ID_MARCA": 11,
        "MARCA": null
      },
      {
        "ID_MARCA": 10,
        "MARCA": null
      },
      {
        "ID_MARCA": 9,
        "MARCA": "Antonio Banderas"
      },
      {
        "ID_MARCA": 4,
        "MARCA": "ASUS"
      },
      {
        "ID_MARCA": 5,
        "MARCA": "BLU"
      },
      {
        "ID_MARCA": 6,
        "MARCA": "FORTREK"
      },
      {
        "ID_MARCA": 7,
        "MARCA": "INTEL"
      },
      {
        "ID_MARCA": 2,
        "MARCA": "MULTILASER"
      },
      {
        "ID_MARCA": 1,
        "MARCA": "NONE"
      },
      {
        "ID_MARCA": 8,
        "MARCA": "PISC"
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
  "quantity": 10,
  "info1": ""
}
```

### Estrutura da Resposta

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `statusCode` | number | Código de status da operação |
| `message` | string | Mensagem descritiva do resultado |
| `recordId` | number | ID do último registro processado |
| `data` | array | Array contendo os dados da resposta |
| `data[0]` | array | Lista das marcas encontradas |
| `data[0][].ID_MARCA` | number | ID único da marca |
| `data[0][].MARCA` | string\|null | Nome da marca |
| `data[1]` | array | Informações do procedimento armazenado |
| `data[1][].sp_return_id` | number | ID de retorno do SP |
| `data[1][].sp_message` | string | Mensagem do SP |
| `data[1][].sp_error_id` | number | ID de erro do SP (0 = sucesso) |
| `data[2]` | object | Metadados da consulta MySQL |
| `quantity` | number | Quantidade de registros retornados |
| `info1` | string | Informações adicionais |

### Códigos de Status

| Código | Descrição |
|--------|-----------|
| `100200` | Dados carregados com sucesso |
| `100404` | Nenhuma marca encontrada |
| `100500` | Erro interno do servidor |

### Respostas de Erro

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["pe_app_id must be a number", "pe_system_client_id must be a number"],
  "error": "Bad Request"
}
```

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid API key",
  "error": "Unauthorized"
}
```

#### 404 Not Found
```json
{
  "statusCode": 100404,
  "message": "Nenhuma marca encontrada",
  "data": [],
  "quantity": 0
}
```

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

### Filtros Disponíveis

- **Por ID da Marca:** Use `pe_id_marca` para buscar uma marca específica
- **Por Nome:** Use `pe_marca` para filtrar por nome da marca (busca parcial)
- **Limite de Resultados:** Use `pe_limit` para controlar a quantidade de registros retornados

### Observações Importantes

- O endpoint retorna apenas marcas ativas (não removidas)
- Os filtros são opcionais e podem ser combinados
- O limite padrão é 100 registros se não especificado
- Marcas com nome `null` são exibidas no resultado
- A resposta segue o padrão de stored procedures do sistema

### Exemplos de Uso

#### Listar todas as marcas
```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1
}
```

#### Buscar marca específica por ID
```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_id_marca": 4
}
```

#### Filtrar por nome da marca
```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_marca": "ASUS"
}
```

#### Limitar quantidade de resultados
```json
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_limit": 50
}
```

---

**Versão da API:** v2  
**Última Atualização:** 2025-01-18  
**Mantenedor:** Equipe de Desenvolvimento srvapi01
