/**
 * Service for managing user data in the database.
 * @param {PrismaService} prisma - The Prisma service instance.
 * @param {ConfigService} configService - The Config service instance.
 * @returns None
 */
import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
//import { UserDto, UserResponse } from './dto/user-response.dto';
import { generateUuid } from 'src/common/utils/generateUuid';
import Cryptr from 'cryptr';
import { ConfigService } from '@nestjs/config';
import { OrderingSignInResponseDto } from 'src/ordering-co/dto/signin-response.dto';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

  /**
   * This is an async function that creates a user with encrypted password and returns selected fields.
   *
   * @param data - An object that contains the user data to be created, with the password field
   * included separately from the rest of the user data. The 'hash' field is omitted from this object
   * as it will be generated from the password using the Cryptr library.
   * @param fields - fields is a parameter of type Prisma.UserSelect, which is used to specify the
   * fields to be selected from the User entity when creating a new user. It allows for more efficient
   * queries by only selecting the necessary fields.
   *
   * @returns The `createUser` function returns a Promise that resolves to a Partial of the User
   * object. The User object is created by calling the `prisma.user.create` method with the
   * `insertData` object and the `fields` object as arguments. If the creation is successful, the
   * function returns the created User object. If there is an error, the function throws an
   * InternalServerErrorException.
   */
  async createUser(
    data: Omit<Prisma.UserCreateInput, 'hash'> & { password: string },
    fields: Prisma.UserSelect,
  ): Promise<Partial<User>> {
    const cryptr = new Cryptr(this.configService.get<string>('app.secret') as string);
    const { password, ...userPayload } = data;

    const insertData = {
      ...userPayload,
      hash: cryptr.encrypt(password),
      publicId: generateUuid(),
    } as Prisma.UserCreateInput;

    try {
      return (await this.prisma.user.create({
        data: insertData,
        select: fields,
      })) as User;
    } catch (error) {
      // TODO: Need to apply log centric
      console.log(error);
      throw new InternalServerErrorException('Create user failed');
    }
  }

  /**
   * This function finds a user by their ID and returns selected user data.
   *
   * @param {number} id - The unique identifier of the user that we want to find in the database.
   * @param select - The `select` parameter is an object that specifies which fields of the `User`
   * model should be included in the query result. It uses the Prisma `UserSelect` type to ensure that
   * only valid fields are included. The `select` parameter can be used to optimize the query by only
   * fetching
   *
   * @returns The `findUserById` function returns a Promise that resolves to a Partial<User> object or
   * null. The object returned depends on the `select` parameter passed to the function, which
   * determines the fields to be included in the returned object. The function uses the `prisma` client
   * to query the database for a user with the specified `id`.
   */
  async findUserById(id: number, fields: Prisma.UserSelect | null): Promise<Partial<User> | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: fields,
    });
  }
}
