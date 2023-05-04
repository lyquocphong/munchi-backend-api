import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Cryptr from 'cryptr';
import { generateUuid } from 'src/common/utils/generateUuid';
import { OrderingSignInResponseDto } from 'src/ordering-co/dto/signin-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IncludeUserParameterOptionsInterface,
  SelectParameterOptionsInterface,
  UserFieldOptionsInterface,
} from './dto/user-field.dto';
import { UserDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService, private configService: ConfigService) {}

  /**
   * The function with create a user and save it into the database
   *
   * @param   {OrderingSignInResponseDto}  data      data passed in after having the response from ordering-co
   * @param   {string}                     password  The password of the user
   *
   * @return  {Promise<UserDto|undefined>}           Return the user response
   */

  async createUser(data: OrderingSignInResponseDto, password: string): Promise<UserDto | undefined> {
    const cryptr = new Cryptr(this.configService.get<string>('app.secret')!);
    const hashPassword = cryptr.encrypt(password);

    try {
      const newUser = await this.prismaService.user.create({
        data: {
          userId: data.id,
          firstName: data.name,
          lastName: data.lastName,
          email: data.email,
          hash: hashPassword,
          level: data.level,
          publicId: generateUuid(),
          session: {
            create: {
              accessToken: data.accessToken,
              expiresIn: data.expireIn,
              tokenType: data.tokenType,
            },
          },
        },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          publicId: true,
          level: true,
          refreshToken: true,
        },
      });
      return newUser;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  /**
   * [findUser description]
   *
   * @param {UserFieldInterface}                fields        Field to filter to find user
   *
   * @param {IncludeUserParameterInterface}     include       Field related to user schema want to return
   *
   * @param {SelectParameterInterface}          select        Field in user schema want to return
   *
   * @param {SelectParameterInterface}          options       Other options to (methods,order)
   * 
   * @return  {Promise<any>}  It will return a promise base on the option which will have a customer type of Prisma
   */

  async findUser(
    fields: UserFieldOptionsInterface,
    include?: IncludeUserParameterOptionsInterface,
    select?: SelectParameterOptionsInterface,
    options?: Object,
  ): Promise<any> {
    if (include) {
      return await this.prismaService.user.findUnique({
        where: fields,
        include: include,
      });
    } else if (select) {
      return await this.prismaService.user.findUnique({
        where: fields,
        select: select,
      });
    } else {
      return await this.prismaService.user.findUnique({
        where: fields,
      });
    }
  }
}
