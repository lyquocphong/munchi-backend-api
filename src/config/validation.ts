import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = "development",
  Production = "production",
  Test = "test",
  Provision = "provision",
}

class EnvironmentVariables {
  //@IsEnum(Environment)
  //NODE_ENV: Environment;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  APP_NAME: string;

  @IsString()
  APP_JWT_SECRET: string;

  @IsString()
  APP_JWT_REFRESH_SECRET: string;

  @IsString()
  ORDERING_CO_WEBHOOK_SECRET: string;

  @IsString()
  ORDERING_CO_URL: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  SHADOW_DATABASE_URL: string;

}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}