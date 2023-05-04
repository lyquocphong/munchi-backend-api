import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configSerice: ConfigService) {
    super({
      datasources: {
        db: {
          url: configSerice.get('app.database.url'),
        },
      },
    });
  }
}
