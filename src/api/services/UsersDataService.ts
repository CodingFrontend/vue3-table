import baseUrl from "@/api/baseUrl";

import type { UserTypes, UserParams } from "@/types/UserTypes";

class UsersDataService {
  getAllUsers(): Promise<UserTypes[]> {
    return baseUrl.get("/users");
  }

  addUser(params: UserParams): Promise<any> {
    return baseUrl.post("/users", params);
  }

  deleteUser(id: number): Promise<any> {
    return baseUrl.delete(`/users/${id}`);
  }

  updateUser(id: number, params: UserParams): Promise<any> {
    return baseUrl.patch(`/users/${id}`, params);
  }
}

export default new UsersDataService();
