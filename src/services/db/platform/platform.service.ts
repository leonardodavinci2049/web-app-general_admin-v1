import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResultQueryWithoutId } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";
import { validatePlatformAppFindAllDto } from "./dto/platform-app-find-all.dto";
import { PlatformAppFindAllQuery } from "./query/platform-app-find-all.query";
import type {
  SpResultRecordPlatformAppFindAllType,
  TblPlatformAppFindAll,
} from "./types/platform.type";

export class PlatformService {
  async execPlatformAppFindAllQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      const validatedDto = validatePlatformAppFindAllDto(dataJsonDto);

      const queryString = PlatformAppFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordPlatformAppFindAllType;

      return processProcedureResultQueryWithoutId<TblPlatformAppFindAll>(
        resultData as unknown[],
        "Platform apps not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const platformService = new PlatformService();
export default platformService;
