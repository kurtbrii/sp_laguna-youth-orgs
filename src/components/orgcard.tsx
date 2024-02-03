import React from "react";
import Image from "next/image";
import vol2 from "../../assets/vol2.png";
import { signIn, signOut, useSession } from "next-auth/react";

const OrgCard = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  return (
    <div className="relative h-64 w-72  cursor-pointer  flex-col  overflow-hidden  rounded-md  object-fill shadow-2xl">
      {/* <div className="h-2/5 bg-slate-600"> */}
      <Image src={vol2} className="h-2/5 w-full object-cover" alt="sunset " />
      <div className=" ml-4 mt-6 h-3/5">
        <p className="mb-3 text-sm font-bold">
          Organization Name this is an organization
        </p>
        <p className="text-sm">dsds</p>
        <p className="text-sm">dsds</p>
      </div>
      <Image
        className="absolute left-4 top-16 rounded-md"
        src={sessionData?.user.image ?? ""}
        height={60}
        width={60}
        alt="sunset"
      />
    </div>
  );
};

export default OrgCard;
