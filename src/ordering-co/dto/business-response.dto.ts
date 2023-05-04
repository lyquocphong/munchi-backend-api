import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderingBusinessResponseDto {

  @Expose()
  name: string;
  @Expose()
  email: string;

  @Expose()
  enabled: number;

  @Expose()
  address: string;
    
}
