import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderingCoService {
    constructor(private configService: ConfigService) {}

    public validateWebhookSecret(checkSecret: string): boolean {
        let webhookSecret = this.configService.get<string>('orderingco.webhook.secret') as string;
        return webhookSecret === checkSecret;
    }

    public getWebhookSecret(): string {
        return this.configService.get<string>('orderingco.webhook.secret') as string;
    }
}
