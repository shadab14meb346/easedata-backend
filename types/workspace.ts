export type Workspace = {
  id: string;
  name: string;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
};
export enum WorkspaceRoles {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}
