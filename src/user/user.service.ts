import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto, UserResponse } from './dto/user-response.dto';
import { generateUuid } from 'src/common/utils/generateUuid';
import Cryptr from 'cryptr';
import { ConfigService } from '@nestjs/config';
import { OrderingSignInResponseDto } from 'src/ordering-co/dto/signin-response.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

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

      const newUser = await this.prisma.user.create({
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
          refreshToken: data.refreshToken as string
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
      throw new ForbiddenException(error)
    }
  }

  /**
   * The funcition will find the user based on the id provided
   *
   * @param   {number}  userId                   The id of user
   *
   * @return  {Promise<CustomUser|null>}         The function will return a Promise of a custom user defined by select in the query
   */

  async findUserById(userId: number) {
    
    return await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        publicId: true,
        level: true,
        userId: true,
        session: {
          select: {
            accessToken: true,
            expiresIn: true,
            tokenType: true,
          },
        },
        business: {
          select: {
            publicId: true,
            name: true,
          },
        },
        refreshToken: true,
      },
    });
  }

}
