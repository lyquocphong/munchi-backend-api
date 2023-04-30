import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { Environment } from 'src/common/constants';

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNumber()
    APP_PORT: number;

    @IsString()
    APP_NAME: string;

    @IsString()
    DATABASE_URL: string;

    @IsString()
    SHADOW_DATABASE_URL: string;    

    @IsString()
    ORDERING_CO_WEBHOOK_SECRET: string;

    @IsString()
    ORDERING_APP_ENDPOINT: string;

    @IsString()
    ORDERING_APP_API_KEY: string;

    @IsString()
    ORDERING_DELIVERY_COMPANY_API_KEY: string;

    @IsString()
    ORDERING_DELIVERY_COMPANY_NAME: string;
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