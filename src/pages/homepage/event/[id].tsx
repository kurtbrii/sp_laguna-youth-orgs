import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";

import {
  LinearTextGradient,
  RadialTextGradient,
  ConicTextGradient,
} from "react-text-gradients-and-animations";
import Navbar from "~/components/NavBar";
import { useSession } from "next-auth/react";
import OrgCard from "~/components/OrgCard";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

const EventPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const router = useRouter();
  const { id } = router.query;

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const eventQuery = api.event.getOne.useQuery({
    id: id as string,
  });

  const event = eventQuery.data;

  if (!id) {
    return <div>No organization ID provided</div>;
  }

  if (eventQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (eventQuery.error ?? !eventQuery.data) {
    return <div>Error loading organization data</div>;
  }

  return (
    <>
      <Navbar />
      <div className="mx-16 my-10  flex  justify-center gap-2 font-custom-lexend   text-customBlack-100">
        {/* IMAGES OF EVENTS*/}
        <div className="mr-24 flex w-2/5 flex-col gap-1">
          <Image
            className="flex w-full rounded-md"
            src={event.organization.user.image}
            alt="Organization Image"
            height={300}
            width={300}
          />

          <div className="flex gap-1">
            <Image
              className="rounded-md"
              src={event.organization.user.image}
              alt="Organization Image"
              height={300}
              width={300}
            />
            <Image
              className="rounded-md"
              src={event.organization.user.image}
              alt="Organization Image"
              height={300}
              width={300}
            />
            <Image
              className="rounded-md"
              src={event.organization.user.image}
              alt="Organization Image"
              height={300}
              width={300}
            />
          </div>
        </div>

        <div className="flex w-4/5 flex-col">
          {/* EVENT NAME */}
          <section className="flex items-center justify-between">
            <h1 className="text-gradient font-custom-epilogue text-4xl  font-extrabold ">
              {event.name}
            </h1>
            <div className="flex gap-4">
              <IconButton>
                <EditTwoToneIcon />
              </IconButton>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </div>
          </section>

          <p className="text-md mb-6 italic text-customBlack-50">
            {event.date.toLocaleString()}
          </p>

          <p
            className="text-md text-customBlack-50"
            style={{ fontSize: "12px" }}
          >
            Organized By:
          </p>
          <p className="text-gradient text-sm">{event.organizedBy}</p>

          {event?.partners.length > 0 && (
            <>
              <p
                className="text-md mt-4 text-customBlack-50"
                style={{ fontSize: "12px" }}
              >
                In partnership with:
              </p>
              {event?.partners?.map((partner: string, index: number) => (
                <p key={index} className="text-sm">
                  {partner}
                </p>
              ))}
            </>
          )}

          <p className="mt-12">{event.details}</p>
        </div>
      </div>
    </>
  );
};

export default EventPage;
