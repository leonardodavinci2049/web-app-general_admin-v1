# Task: Implementar Query (chamadas) das procedures

## Objetivos
com base no arquivo [organization-check-name-exist.query.ts](src/services/db/organization/query/organization-check-name-exist.query.ts) , que é uma chamada de procedure, implementes os arquivos abaixo (que estão na mesma pasta) com os seus respectivos campos 

persoanalziação conform as informações abaixo

## Arquivo - > organization-sel-all.query.ts
dto: organization-sel-all.dto.ts
procedure: sp_organization_sel_all_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID  varchar(191),                                        
    PE_ORGANIZATION_ID varchar(191),							
    PE_ORGANIZATION VARCHAR(191),
    PE_LIMIT INT 


## Arquivo - > organization-sel-id.query.ts
dto: organization-sel-id.dto.ts
procedure: sp_organization_sel_id_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID  varchar(191),                                       
    PE_ORGANIZATION_ID varchar(191)        					



## Arquivo - > organization-sel-active.query.ts
dto: organization-sel-active.dto.ts
procedure: sp_organization_sel_active_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID varchar(191)  


## Arquivo - > organization-upd-name.query.ts
dto: organization-upd-name.dto.ts
procedure: sp_organization_upd_name_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_ORGANIZATION_ID varchar(191),    
    PE_ORGANIZATION_NAME varchar(200)

## Arquivo - > organization-upd-slug.query.ts
dto: organization-upd-slug.dto.ts
procedure: sp_organization_upd_name_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_ORGANIZATION_ID varchar(191),    
    PE_ORGANIZATION_SLUG varchar(200)
## Arquivo - > organization-upd-system-id.query.ts
dto: organization-upd-system-id.dto.ts
procedure: sp_organization_upd_system_id_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_ORGANIZATION_ID varchar(191),    
    PE_SYSTEM_ID INT



## Arquivo - > organization-check-slug-exist.query.ts
dto: organization-check-slug-exist.dto.ts
procedure: sp_organization_check_slug_exist_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_TERM varchar(200) 

## Arquivo - > organization-check-systen-id-exist.query.ts
dto: organization-check-systen-id-exist.dto.ts
procedure: sp_organization_check_systen_id_exist_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_TERM INT

## Arquivo - > organization-create.query.ts
dto: organization-create.dto.ts
procedure: sp_organization_create_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_SYSTEM_ID INT,       
    PE_ORGANIZATION_ID varchar(191),    
    PE_ORGANIZATION_NAME varchar(200),    
    PE_ORGANIZATION_SLUG varchar(200) 

## Arquivo - > organization-delete.query.ts
dto: organization-delete.dto.ts
procedure: sp_organization_delete_v1

### campos
    PE_APP_ID INT, 
    PE_USER_ID  varchar(191),                                       
    PE_ORGANIZATION_ID varchar(191)  



   