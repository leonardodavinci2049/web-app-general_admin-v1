import "server-only";

import {
  createPool,
  type Pool,
  type PoolConnection,
  type PoolOptions,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";
import { envs } from "@/core/config/envs";
import { createLogger } from "@/core/logger";

const logger = createLogger("database-service");

type SqlParam =
  | string
  | number
  | bigint
  | boolean
  | Date
  | null
  | Buffer
  | Uint8Array;
type QueryParams = SqlParam[];

type OperationType = "connection" | "select" | "modify" | "transaction";

export class ErroConexaoBancoDados extends Error {
  public readonly operationType: OperationType = "connection";

  constructor(
    mensagem: string,
    public readonly erroOriginal: Error,
  ) {
    super(mensagem);
    this.name = "ErroConexaoBancoDados";
  }
}

export class ErroExecucaoConsulta extends Error {
  public readonly operationType: OperationType;
  public readonly paramCount: number;
  public readonly durationMs: number | undefined;
  public readonly consulta: string;

  constructor(
    mensagem: string,
    consulta: string,
    erroOriginal: Error,
    metadata?: {
      operationType?: OperationType;
      paramCount?: number;
      durationMs?: number;
    },
  ) {
    super(mensagem);
    this.name = "ErroExecucaoConsulta";
    this.operationType = metadata?.operationType ?? "select";
    this.paramCount = metadata?.paramCount ?? 0;
    this.durationMs = metadata?.durationMs;
    this.cause = erroOriginal;
    this.consulta =
      process.env.NODE_ENV === "development" ? consulta : "[REDACTED]";
  }
}

class DatabaseService {
  private poolConnection: Pool | null = null;
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private createPool(): Pool {
    const config: PoolOptions = {
      host: envs.DATABASE_HOST,
      port: envs.DATABASE_PORT,
      database: envs.DATABASE_NAME,
      user: envs.DATABASE_USER,
      password: envs.DATABASE_PASSWORD,
      waitForConnections: true,
      connectionLimit: envs.DB_POOL_CONNECTION_LIMIT,
      maxIdle: envs.DB_POOL_MAX_IDLE,
      idleTimeout: envs.DB_POOL_IDLE_TIMEOUT,
      enableKeepAlive: true,
      keepAliveInitialDelay: 5000,
      queueLimit: envs.DB_POOL_QUEUE_LIMIT,
    };

    logger.debug("Criando pool de conexões MySQL");
    return createPool(config);
  }

  private ensureConnection(): Pool {
    if (!this.poolConnection) {
      try {
        this.poolConnection = this.createPool();
      } catch (error) {
        logger.error("Falha ao criar pool de conexões MySQL", error);
        throw new ErroConexaoBancoDados(
          "Falha ao estabelecer conexão com o banco de dados",
          error as Error,
        );
      }
    }
    return this.poolConnection;
  }

  async selectQuery<T extends RowDataPacket>(
    queryString: string,
    params?: QueryParams,
  ): Promise<T[]> {
    const start = performance.now();
    try {
      const pool = this.ensureConnection();
      const [results] = await pool.query<T[]>(queryString, params);
      logger.debug("selectQuery", {
        durationMs: Math.round(performance.now() - start),
        rows: results.length,
      });
      return results;
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      logger.error("Falha em selectQuery", {
        durationMs,
        paramCount: params?.length ?? 0,
      });
      throw new ErroExecucaoConsulta(
        "Falha ao executar consulta SELECT",
        queryString,
        error as Error,
        {
          operationType: "select",
          paramCount: params?.length ?? 0,
          durationMs,
        },
      );
    }
  }

  async selectExecute<T extends RowDataPacket>(
    queryString: string,
    params?: QueryParams,
  ): Promise<T[]> {
    const start = performance.now();
    try {
      const pool = this.ensureConnection();
      const [results] = await pool.execute<T[]>(queryString, params);
      logger.debug("selectExecute", {
        durationMs: Math.round(performance.now() - start),
        rows: results.length,
      });
      return results;
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      logger.error("Falha em selectExecute", {
        durationMs,
        paramCount: params?.length ?? 0,
      });
      throw new ErroExecucaoConsulta(
        "Falha ao executar consulta SELECT com execute",
        queryString,
        error as Error,
        {
          operationType: "select",
          paramCount: params?.length ?? 0,
          durationMs,
        },
      );
    }
  }

  async ModifyExecute(
    queryString: string,
    params?: QueryParams,
  ): Promise<ResultSetHeader> {
    const start = performance.now();
    try {
      const pool = this.ensureConnection();
      const [results] = await pool.execute(queryString, params);
      logger.debug("ModifyExecute", {
        durationMs: Math.round(performance.now() - start),
        affectedRows: (results as ResultSetHeader).affectedRows,
      });
      return results as ResultSetHeader;
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      logger.error("Falha em ModifyExecute", {
        durationMs,
        paramCount: params?.length ?? 0,
      });
      throw new ErroExecucaoConsulta(
        "Falha ao executar operação de modificação com execute",
        queryString,
        error as Error,
        {
          operationType: "modify",
          paramCount: params?.length ?? 0,
          durationMs,
        },
      );
    }
  }

  async ModifyQuery(
    queryString: string,
    params?: QueryParams,
  ): Promise<ResultSetHeader> {
    const start = performance.now();
    try {
      const pool = this.ensureConnection();
      const [results] = await pool.query(queryString, params);
      logger.debug("ModifyQuery", {
        durationMs: Math.round(performance.now() - start),
        affectedRows: (results as ResultSetHeader).affectedRows,
      });
      return results as ResultSetHeader;
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      logger.error("Falha em ModifyQuery", {
        durationMs,
        paramCount: params?.length ?? 0,
      });
      throw new ErroExecucaoConsulta(
        "Falha ao executar operação de modificação com query",
        queryString,
        error as Error,
        {
          operationType: "modify",
          paramCount: params?.length ?? 0,
          durationMs,
        },
      );
    }
  }

  async runInTransaction<T>(
    callback: (connection: PoolConnection) => Promise<T>,
  ): Promise<T> {
    const start = performance.now();
    const connection = await this.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      logger.debug("Transação concluída", {
        durationMs: Math.round(performance.now() - start),
      });
      return result;
    } catch (error) {
      await connection.rollback();
      logger.error("Transação falhou e foi revertida", {
        durationMs: Math.round(performance.now() - start),
      });
      throw error;
    } finally {
      connection.release();
    }
  }

  async getConnection(): Promise<PoolConnection> {
    try {
      const pool = this.ensureConnection();
      return await pool.getConnection();
    } catch (error) {
      logger.error("Falha ao obter conexão do pool", error);
      throw new ErroConexaoBancoDados(
        "Falha ao obter conexão do pool",
        error as Error,
      );
    }
  }

  async ping(): Promise<boolean> {
    try {
      const pool = this.ensureConnection();
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      logger.info("Health check: conexão OK");
      return true;
    } catch (error) {
      logger.error("Health check: falha na conexão", error);
      return false;
    }
  }

  async closeConnection(): Promise<void> {
    if (this.poolConnection) {
      await this.poolConnection.end();
      this.poolConnection = null;
      logger.info("Pool de conexões MySQL fechado");
    }
  }
}

const dbService = DatabaseService.getInstance();

export default dbService;
export { DatabaseService };
