import { Controller, Get } from '@nestjs/common';
import { OrderingCoService } from './ordering-co.service';

@Controller('ordering-co')
export class OrderingCoController {
    constructor(private orderingCoService: OrderingCoService) {}

    @Get('')
    public getSecret(): string {
        return 'Welcome to ordering co controller';
    }
}
