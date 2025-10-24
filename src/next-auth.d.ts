import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
      name: string;
      email: string;
      // phone: string
      is_onb:boolean
      resName : string
      is_ver : boolean
      // email : string
      address : string
    };
  }

  interface User {
    id: string;
    token: string;
    // phone:string
    is_onb:boolean
    resName : string
    is_ver : boolean
    email : string
    address : string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    token: string;
  
  }
}
