# tas Implementar DTOs

## Objetivos
com base no arquivo [organization-check-name-exist.dto.ts](src/services/db/organization/dto/organization-check-name-exist.dto.ts) de dto implementes os arquivos abaixo (que estão na mesma pasta) com os sesus respectivos campos 



## organization-sel-all.dto.ts

    PE_APP_ID INT, 
    PE_USER_ID  varchar(191),                                        
    PE_ORGANIZATION_ID varchar(191),							
    PE_ORGANIZATION VARCHAR(191),
    PE_LIMIT INT   

## organization-sel-id.dto.ts

    PE_APP_ID INT, 
    PE_USER_ID  varchar(191),                                       
    PE_ORGANIZATION_ID varchar(191) 

## organization-sel-active.dto.ts

    PE_APP_ID INT, 
    PE_USER_ID varchar(191)  

## organization-upd-name.dto.ts

    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_ORGANIZATION_ID varchar(191),    
    PE_ORGANIZATION_NAME varchar(200)

## organization-upd-slug.dto.ts

    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_ORGANIZATION_ID varchar(191),    
    PE_ORGANIZATION_SLUG varchar(200)

## organization-upd-system-id.dto.ts

    PE_APP_ID INT, 
    PE_USER_ID varchar(200),
    PE_ORGANIZATION_ID varchar(191),    
    PE_SYSTEM_ID INT

## organization-delete.dto.ts
    PE_APP_ID INT, 
    PE_USER_ID  varchar(191),                                       
    PE_ORGANIZATION_ID varchar(191)     