import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrderingCoService } from 'src/ordering-co/ordering-co.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  BusinessFieldOptionsInterface,
  BusinessOptionsInterface,
  IncludeBusinessFieldOptionsInterface,
  SelectBusinessFieldOptionsInterface,
} from './dto/business-field.dto';
import { Business } from '@prisma/client';
import { generateUuid } from 'src/common/utils/generateUuid';
import { OrderingBusinessResponseDto } from 'src/ordering-co/dto/business-response.dto';

@Injectable()
export class BusinessService {
  constructor(
    private orderingCoService: OrderingCoService,
    private userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * [allBusiness description]
   *
   * @param   {string}  accessToken   The verify token sent from client
   * @param   {string}  userPublicId  The public id of user
   * @return  {[type]}                Return all business user currently have
   */
  async allBusiness(accessToken: string, userPublicId: string) {
    const response = await this.orderingCoService.allBusiness(accessToken);
    try {
      const user = await this.userService.findUser({ publicId: userPublicId }, { business: true });
      if (!user) throw new ForbiddenException('Something wrong happend');
      await response.map(async (business: any) => {
        console.log(business.id);
        const existedBusiness = await this.findBusiness({ businessId: business.id });
        console.log('Existing business: ', existedBusiness);
        if (existedBusiness) {
          return user.business;
        } else {
          return await this.createBusiness(business, user.userId);
        }
      });
      return await this.findBusiness({ userId: user.userId }, undefined, undefined, { method: { findMany: true } });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  /**
   * [createBusiness description]
   *
   * @param   {Business}  orderingCoReponse  Business data from ordering-co
   * @param   {number}    userId             The id of user
   *
   * @return  {Promise<Business>}                       return new user data
   */
  async createBusiness(orderingCoReponse: Business, userId: number): Promise<Business> {
    return await this.prismaService.business.create({
      data: {
        businessId: orderingCoReponse.id,
        name: orderingCoReponse.name,
        publicId: generateUuid(),
        userId: userId,
      },
    });
  }

  /**
   * [findById description]
   *
   * @param   {string}  accessToken       The verify token sent from client
   *
   * @param   {string}  businessPublicId  The publib id of the business
   *
   * @return  {Promise<OrderingBusinessResponseDto>}      It will return business object
   */
  async findById(accessToken: string, businessPublicId: string): Promise<OrderingBusinessResponseDto> {
    const business = await this.findBusiness({ publicId: businessPublicId });
    console.log(business);
    const response = await this.orderingCoService.businessById(accessToken, business.businessId);
    return response;
  }

  /**
   * The function will find business base on the passing parameter which fit with the prisma query
   *
   * @param {BusinessFieldOptionsInterface}        field    Field to filter to find business
   *
   * @param {IncludeBusinessFieldOptionsInterface} include  Field related to user schema want to return
   *
   * @param {SelectBusinessFieldOptionsInterface}  select   Field in business schema want to return
   *
   * @param {BusinessOptionsInterface}             options  Other options to (methods,order)
   *
   * @return  {[type]}  It will return a promise base on the option which will have a customer type of Prisma
   */

  async findBusiness(
    fields: BusinessFieldOptionsInterface,
    include?: IncludeBusinessFieldOptionsInterface,
    select?: SelectBusinessFieldOptionsInterface,
    options?: BusinessOptionsInterface,
  ): Promise<any> {
    if (include) {
      return await this.prismaService.business.findUnique({
        where: fields,
        include: include,
      });
    } else if (select) {
      return await this.prismaService.business.findUnique({
        where: fields,
        select: select,
      });
    } else if (options) {
      if (options.method?.findMany) {
        return await this.prismaService.business.findMany({
          where: fields,
        });
      }
    } else {
      return await this.prismaService.business.findUnique({
        where: fields,
      });
    }
  }
}
