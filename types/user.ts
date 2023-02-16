export interface IUser {
  id?: number;
  email?: string;
  admin?: boolean;
}

export type UserForJWTGeneration = {
  id: number;
  email: string;
  admin: boolean;
};
