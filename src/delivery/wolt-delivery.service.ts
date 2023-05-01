import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class WoltDeliveryService {
    createDeliveryPromise() {
        throw new NotImplementedException;
    }

    createDeliveryOrder() {
        throw new NotImplementedException;
    }
}
