export interface LoggedInUserType {
  company: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  middleName: string;
  mobile: string;
  token: string;
  type: string;
  isAdmin: boolean;
}

export interface SelectOptionType {
  text: string;
  value: string;
  disabled?: boolean;
}

export interface ResponseType {
  data: null | any;
  message: string | null;
  success: true;
}
