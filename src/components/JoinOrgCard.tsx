import React from "react";
import Image from "next/image";
import vol2 from "public/images/vol2.png";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { type User } from "@prisma/client";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
// interface OrgProps {
//   organization: {
//     id: string;
//     orgName: string;
//     phoneNumber: string;
//     bio: string;
//     userId: string;
//     mission: string;
//     vision: string;
//     objectives: string;
//     user: {
//       id: string;
//       image: string | null;
//       role: string;
//       email: string | null; // Update this line to handle null
//     };
//     event: {
//       id: string;
//       name: string;
//       organizedBy: string;
//       details: string;
//       location: string;
//       date: Date; // Update this line to Date
//       partners: string[];
//     }[];
//   };
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JoinOrgCard = ({ organization, volId }: any) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const router = useRouter();

  const cancelOrgRequest = api.volJoinOrg.deleteVolJoinOrg.useMutation();

  const handleViewOrg = () => {
    void router.push(``);
  };

  const handleCancelRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    cancelOrgRequest.mutate({ volId: volId, orgId: organization.id });

    alert("Cancelled Successfully");
  };

  return (
    <Link
      className="relative h-72 w-72  cursor-pointer  flex-col  overflow-hidden  rounded-md  object-fill font-custom-lexend shadow-2xl"
      onClick={() => handleViewOrg()}
      href={`/homepage/organization/${organization.id}`}
    >
      {/* <div className="h-2/5 bg-slate-600"> */}
      <Image src={vol2} className="h-2/5 w-full object-cover" alt="sunset " />
      <div className=" mx-4 mt-6 h-3/5">
        <p className="mb-3 overflow-hidden text-ellipsis  whitespace-nowrap font-custom-epilogue  text-sm font-bold">
          {organization.orgName}
        </p>
        <p className="text-sm">{organization.phoneNumber}</p>
        <p className="mb-5 text-sm">Role: {organization?.user?.role}</p>

        <button
          onClick={(e) => handleCancelRequest(e)}
          className="btn-outline self-center px-5 py-2"
          style={{ color: "var(--red)", borderColor: "var(--red)" }}
        >
          Cancel Request
        </button>
      </div>
      <Image
        className="absolute left-4 top-20 rounded-md"
        src={`${organization?.user?.image}`}
        height={60}
        width={60}
        alt="user image role"
      />
    </Link>
  );
};

export default JoinOrgCard;
