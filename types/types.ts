export type PermissionKey =
  | "canEditAllocation"
  | "canEditBudgetAmount"
  | "canIncreaseCreditBuilder";

export type Role = "basic" | "premium" | "freemium"; 

export type Permissions = Record<Role, Record<PermissionKey, boolean>>;
