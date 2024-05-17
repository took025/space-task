export interface userInterface {
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
  clientNumber: any;
  id?: string;
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

export interface apiData {
  first: number;
  items: number;
  last: number;
  next: number;
  pages: number;
  prev: any;
  data: userInterface[];
}
