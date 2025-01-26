// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== EVENTS PARAMS
export type CreateEventParams = {
  userId: string;
  event: {
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    createdAt: Date;
    url: string;
  };
  path: string;
};

export type UpdateEventParams = {
  userId: string;
  event: {
    _id: string;
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    createdAt: Date;
    url: string;
  };
  path: string;
};

export type DeleteEventParams = {
  eventId: string;
  path: string;
};

export type GetAllEventsParams = {
  query: string;
  limit: number;
  page: number;
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  createdAt: Date;
  url: string;
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

// ====== ADMIN PARAMS
export type CreateAdminParams = {
  Name: string;
  Email: string;
};

// ====== ISLAMIC RESOURCE PARAMS
export type CreateIslamicResourceParams = {
  Category: string;
  FileName: string;
  Link: string;
};

// ====== COMMUNITY SERVICE RESOURCE PARAMS
export type CreateCommunityServiceResourceParams = {
  Category: string;
  Name: string;
  Address: string;
  State: string;
  Website: string;
  Contact: string;
};

// ====== GALLERY PARAMS
export type AddPhotoParams = {
  Title: string;
  Image: string;
  Category: string;
};

// ====== BANNER PARAMS
export type AddBannerParams = {
  Title: string;
  Image: string;
};

// ====== RESOURCE PARAMS
export type ResourceParams = {
  Heading: string;
  Image: string;
  Link: string;
  Category: string;
};

// ====== NOTICE PARAMS
export type AddNoticeParams = {
  Notice: string;
};

// ====== REGISTRATION PARAMS
export type RegistrationParams = {
  firstName: string;
  lastName: string;
  address: string;
  number: string;
  email: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelation: string;
  signature: string;
  date: Date;
  status: string;
  userId?: string;
};

// ====== FREE ORDER PARAMS
export type FreeOrderParams = {
  name: string;
  address: string;
  number: string;
  email: string;
  date: Date;
  eventTitle: string;
  eventId: string;
};

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string;
  eventId: string;
  price: string;
  isFree: boolean;
  buyerId: string;
};

export type CreateOrderParams = {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string;
  createdAt: Date;
};

export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
};

export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number;
  page: string | number | null;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};
