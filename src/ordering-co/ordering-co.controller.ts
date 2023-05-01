import { Controller, Get } from '@nestjs/common';
import { OrderingCoService } from './ordering-co.service';

@Controller('orderingco')
export class OrderingCoController {
    constructor(private orderingCoService: OrderingCoService) {}

    @Get('webhook/secret')
    public getSecret(): string {
        return this.orderingCoService.getWebhookSecret();
    }
}
