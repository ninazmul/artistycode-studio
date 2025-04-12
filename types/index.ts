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

// ====== ADMIN PARAMS
export type CreateAdminParams = {
  Name: string;
  Email: string;
};

// ====== MODERATOR PARAMS
export type CreateModeratorParams = {
  Name: string;
  Email: string;
};

// ====== PROJECT PARAMS
export type CreateProjectParams = {
  title: string;
  description?: string;
  stack: string;
  image: string;
  url: string;
  category: string;
  author: string;
};

// ====== TRANSACTION PARAMS
export type CreateTransactionParams = {
  date: Date;
  project: string;
  category: string;
  amount: string;
  due_amount?: string;
  notes?: string;
};

// ====== RESOURCE PARAMS
export type CreateResourceParams = {
  title: string;
  description?: string;
  stack: string;
  image: string;
  url: string;
  file: string;
  price: string;
  isFree: boolean;
  category: string;
  author: string;
};

// ====== REVIEW PARAMS
export type CreateReviewParams = {
  name: string;
  title: string;
  quote: string;
  image: string;
  verified: boolean;
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

export type CreateOrderParams = {
  resourceId: string;
  buyerName: string;
  buyerEmail: string;
  buyerNumber: string;
  price: string;
  createdAt: Date;
  isFree: boolean;
  delivered: boolean;
  note?: string;
  url:string;
};

export type getOrdersByEmailParams = {
  email: string | null;
  limit?: number;
  page: string | number | null;
};
