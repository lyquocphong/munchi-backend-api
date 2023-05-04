export interface BusinessFieldOptionsInterface {
  businessId?: number;
  publicId?: string;
  name?: string;
  userId?: number;
}

export interface IncludeBusinessFieldOptionsInterface {
  user?: boolean;
}

export interface SelectBusinessFieldOptionsInterface {
  businessId?: boolean;
  publicId?: boolean;
  name?: boolean;
  userId?: boolean;
}

export interface BusinessOptionsInterface {
   method?: Method,
   option?: object
  }

export interface Method {
    findMany?: boolean;
    findUnique? : boolean;
    delete?: true
}