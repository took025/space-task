export interface UserInterface {
  id: string;
  name: string;
  surname: string;
  gender: string;
  personalId: string;
  phoneNumber: string;
  factualAdress: {
    country: string;
    city: string;
    address: string;
  };
  LegalAddress: {
    country: string;
    city: string;
    address: string;
  };
  image: string;
  accountModel?: accountModel[];
}

export interface accountModel {
  id?: string;
  clientNumber: any;
  cliendNumber: string;
  accountType: {
    name: string;
  };
  currency: [
    {
      name: string;
    }
  ];
  accountStatus: {
    name: string;
  };
  accountNumber: string;
}

export interface ApiData {
  first: number;
  items: number;
  last: number;
  next: number;
  pages: number;
  prev: any;
  data: UserInterface[];
}
export interface User {
  id?: string;
  email?: string;
  password?: string;
  personalId: string;
}
