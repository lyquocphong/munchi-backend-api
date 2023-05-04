export interface UserFieldOptionsInterface {
  userId?: number;
  publicId?: string;
}

export interface IncludeUserParameterOptionsInterface {
  business?: boolean;
  session?: boolean;
}

export interface SelectParameterOptionsInterface {
  userId: boolean;
  hash: boolean;
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  publicId?: boolean;
  level?: boolean;
  refreshToken?: boolean;
}
