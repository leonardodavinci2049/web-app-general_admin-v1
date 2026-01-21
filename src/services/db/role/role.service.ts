import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResultQueryWithoutId } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";
import { validateMemberRoleFindAllDto } from "./dto/member_role_find_all.dto";
import { MemberRoleFindAllQuery } from "./query/member_role_find_all.query";
import type {
  SpResultRecordRoleFindAllType,
  TblRoleFindAll,
} from "./types/role.type";

export class RoleService {
  async execMemberRoleFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateMemberRoleFindAllDto(dataJsonDto);

      const queryString = await MemberRoleFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordRoleFindAllType;

      return processProcedureResultQueryWithoutId<TblRoleFindAll>(
        resultData as unknown[],
        "Member roles not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const roleService = new RoleService();
export default roleService;
