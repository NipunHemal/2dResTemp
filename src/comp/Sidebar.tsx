"use client";
import { Button } from "@/components/ui/button";
import { disconnectSocket } from "@/lib/socket";

import { Button as BTN } from "@nextui-org/react";

import { Mail } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const currentPage = usePathname();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // const router = useRouter();

  const [theUser, settheUser] = useState("");

  return (
    <div className="  md:w-16  lg:w-60 hidden md:flex flex-col  bg-[#18181B]  h-screen">
      <div className=" lg:flex hidden   p-2 flex-1 gap-2 flex-col">
        <Link href={"/dashboard"}>
          <Button
            className={` ${
              currentPage === "/dashboard"
                ? "bg-[#444444]  hover:bg-[#444444]"
                : "bg-[#262629] hover:bg-[#2f2f33]"
            } flex justify-center gap-1  py-6 w-full`}
          >
            Dashboard
          </Button>
        </Link>

        <Link href={"/reservations"}>
          <Button
            className={` ${
              currentPage === "/reservations"
                ? "bg-[#444444]  hover:bg-[#444444]"
                : "bg-[#262629] hover:bg-[#2f2f33]"
            } flex justify-center gap-1  py-6 w-full`}
          >
            Reservations
          </Button>
        </Link>

        <Link href={"/tables-management"}>
          <Button
            className={` ${
              currentPage === "/tables-management"
                ? "bg-[#444444]  hover:bg-[#444444]"
                : "bg-[#262629] hover:bg-[#2f2f33]"
            } flex justify-center gap-1  py-6 w-full`}
          >
            Tables Management
          </Button>
        </Link>

        <Link href={"/billings"}>
          <Button
            className={` ${
              currentPage === "/billings"
                ? "bg-[#444444]  hover:bg-[#444444]"
                : "bg-[#262629] hover:bg-[#2f2f33]"
            } flex justify-center gap-1  py-6 w-full`}
          >
            Payments & Billings
          </Button>
        </Link>

        <Link href={"/settings"}>
          <Button
            className={` ${
              currentPage === "/settings"
                ? "bg-[#444444]  hover:bg-[#444444]"
                : "bg-[#262629] hover:bg-[#2f2f33]"
            } flex justify-center gap-1  py-6 w-full`}
          >
            Settings
          </Button>
        </Link>
      </div>

      {/* tab devices  */}

      <div className="flex lg:hidden items-center   p-2 flex-1 mt-3 gap-4 flex-col">
        <Link href={"/dashboard"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`   md:w-8 md:h-8   lg:w-6 ${
              currentPage === "/dashboard" ? "text-[#FF385C]" : "text-white"
            }        lg:h-6`}
          >
            <path
              fill-rule="evenodd"
              d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z"
              clip-rule="evenodd"
            />
          </svg>
        </Link>

        <Link href={"/reservations"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className={`   md:w-8 md:h-8   lg:w-6 ${
              currentPage === "/reservations" ? "text-[#FF385C]" : "text-white"
            }        lg:h-6`}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
            />
          </svg>
        </Link>

        <Link href={"/tables-management"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className={`   md:w-8 md:h-8   lg:w-6 ${
              currentPage === "/tables-management"
                ? "text-[#FF385C]"
                : "text-white"
            }        lg:h-6`}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        </Link>

        <Link href={"/billings"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className={`   md:w-8 md:h-8   lg:w-6 ${
              currentPage === "/billings" ? "text-[#FF385C]" : "text-white"
            }        lg:h-6`}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
            />
          </svg>
        </Link>

        <Link href={"/settings"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`   md:w-8 md:h-8   lg:w-6 ${
              currentPage === "/settings" ? "text-[#FF385C]" : "text-white"
            }        lg:h-6`}
          >
            <path
              fill-rule="evenodd"
              d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
              clip-rule="evenodd"
            />
          </svg>
        </Link>
      </div>

      {/* tab devices  */}

      <div className="   w-full pb-10 hidden   gap-4 lg:flex flex-col items-center h-fit">
        {/* onPress={logout}  */}
        <BTN
          onPress={() => {
            disconnectSocket();
            signOut({ callbackUrl: "/login" });
          }}
          className="  font-poppinsreg5"
        >
          {" "}
          Log Out{" "}
        </BTN>

        <div>
          {/* <h1 className=' font-semibold text-slate-50 text-center -ml-2 '> Made By Kensurge ❤️ </h1> */}
          <h1 className=" text-slate-400 text-center  -ml-4 ">
            {" "}
            Copyright © 2025{" "}
          </h1>
        </div>
      </div>

      {/* tab device  */}
      <div className="   w-full pb-10 flex lg:hidden flex-col items-center h-fit">
        {/* <h1 className=' font-semibold text-slate-50 text-center -ml-2 '> ❤️ </h1> */}

        <svg
          onClick={() => signOut({ callbackUrl: "/login" })}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6   rotate-180  text-white md:w-8 md:h-8 "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
      </div>
      {/* tab device  */}
    </div>
  );
};

export default Sidebar;
