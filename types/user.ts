export interface IUser {
  id?: number;
  email?: string;
  admin?: boolean;
  name?: string;
}

export type UserForJWTGeneration = {
  id: number;
  email: string;
  admin: boolean;
  name: string;
};
