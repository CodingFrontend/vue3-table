export interface UserTypes {
  id: number;
  lastName: string;
  name: string;
  dateBirth: string;
}

export interface UserParams {
  lastName: string;
  name?: string;
  date: string;
}
