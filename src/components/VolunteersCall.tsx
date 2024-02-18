import React from "react";
import Navbar from "~/components/navbar";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VolunteersCall = ({ volunteer }: any) => {
  // const router = useRouter();
  // const { id } = router.query;

  // const user = api.user.getUser.useQuery({
  //   userId: sessionData?.user.id ?? "",
  // });

  // const volunteer = user.data?.volunteer;

  // const getPendingOrgOrVol = api.activityCall.getOrgOrVol.useQuery({
  //   activityId: id as string,
  //   volId: volunteer?.id,
  //   status: "PENDING",
  // });

  // const activityQuery = api.activity?.getOne.useQuery({
  //   id: id as string,
  // });

  return (
    <div className="m-4 flex justify-around gap-4">
      <p>
        {volunteer?.firstName} {volunteer?.middleInitial} {volunteer?.lastName}{" "}
        {volunteer?.suffix}
      </p>
      <p></p>
    </div>
  );
};

export default VolunteersCall;
