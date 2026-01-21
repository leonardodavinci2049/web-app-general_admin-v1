import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResultMutation } from "../utils/process-procedure-result.mutation";
import { processProcedureResultQuery } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";
import { validateUserFindAllDto } from "./dto/user_find_all.dto";
import { validateUserFindIdDto } from "./dto/user_find_id.dto";
import { validateUserUpdNameDto } from "./dto/user_upd_name.dto";
import { validateUserUpdPersonIdDto } from "./dto/user_upd_person_id.dto";
import { UserFindAllQuery } from "./query/user_find_all.query";
import { UserFindIdQuery } from "./query/user_find_id.query";
import { UserUpdNameQuery } from "./query/user_upd_name.query";
import { UserUpdPersonIdQuery } from "./query/user_upd_person_id.query";
import type {
  SpResultRecordFindByIdType,
  SpResultRecordFindType,
  SpResultRecordUpdateType,
  TblUserFindAll,
  TblUserFindById,
} from "./types/user.type";

export class UserService {
  async execUserFindIdQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserFindIdDto(dataJsonDto);

      const queryString = await UserFindIdQuery(validatedDto);

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

  async execUserFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserFindAllDto(dataJsonDto);

      const queryString = await UserFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindType;

      return processProcedureResultQuery<TblUserFindAll>(
        resultData as unknown[],
        "Users not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execUserUpdNameQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserUpdNameDto(dataJsonDto);

      const queryString = await UserUpdNameQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "User name update failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execUserUpdPersonIdQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserUpdPersonIdDto(dataJsonDto);

      const queryString = await UserUpdPersonIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "User person ID update failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const userService = new UserService();
export default userService;
