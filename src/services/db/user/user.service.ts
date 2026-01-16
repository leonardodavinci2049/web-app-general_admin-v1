import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResultMutation } from "../utils/process-procedure-result.mutation";
import { processProcedureResultQuery } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";

import { validateUserCheckTermsExistDto } from "./dto/User-check-terms-exist.dto";
import { validateUserCreateDto } from "./dto/User-create.dto";
import { validateUserDeleteDto } from "./dto/User-delete.dto";

import { validateUserFindAllDto } from "./dto/User-find-all.dto";
import { validateUserFindByIdDto } from "./dto/User-find-by-id.dto";
import { validateUserUpdNameDto } from "./dto/User-upd-name.dto";

import { UserCheckTermsExistQuery } from "./query/User-check-terms-exist.query";
import { UserCreateQuery } from "./query/User-create.query";
import { UserDeleteQuery } from "./query/User-delete.query";

import { UserFindAllQuery } from "./query/User-find-all.query";
import { UserFindByIdQuery } from "./query/User-find-by-id.query";
import { UserUpdNameQuery } from "./query/User-upd-name.query";

import type {

  SpResultRecordCheckExistType,
  SpResultRecordCreateType,
  SpResultRecordDeleteType,
  SpResultRecordFindByIdType,
  SpResultRecordFindType,
  SpResultRecordUpdateType,

  TblUserFind,
  TblUserFindById,
} from "./types/User.type";

export class UserService {
  // Serviço para buscar organização por ID
  async execUserFindByIdQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateUserFindByIdDto(dataJsonDto);

      const queryString = await UserFindByIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindByIdType;

      return processProcedureResultQuery<TblUserFindById>(
        resultData as unknown[],
        "User not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execUserFindAllQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateUserFindAllDto(dataJsonDto);

      const queryString = await UserFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindType;

      return processProcedureResultQuery<TblUserFind>(
        resultData as unknown[],
        "User not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }


  async execUserCheckTermsExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateUserCheckTermsExistDto(dataJsonDto);

      const queryString = await UserCheckTermsExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "No active User found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }



  async execUserCreateQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateUserCreateDto(dataJsonDto);

      const queryString = await UserCreateQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "User create failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execUserUpdateNameQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateUserUpdNameDto(dataJsonDto);

      const queryString = await UserUpdNameQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "User update name failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }


  async execUserDeleteQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateUserDeleteDto(dataJsonDto);

      const queryString = await UserDeleteQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordDeleteType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "User delete failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

// Instância singleton do serviço de organização
const UserService = new UserService();
export default UserService;
