import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import React, { useState } from "react";
import DeleteModal from "~/components/DeleteModal";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import Carousel from "~/components/Carousel";
import Modal from "react-modal";
import ViewLocationModal from "~/components/ViewLocationModal";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

const EventPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [toggleModal, setToggleModal] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const eventQuery = api.event.getOne.useQuery({
    id: id as string,
  });

  const event = eventQuery.data;
  const isLoading = eventQuery.isLoading;

  const deleteEvent = api.event.deleteEvent.useMutation();

  const archiveEvent = api.event.archiveEvent.useMutation({
    onSuccess: async () => {
      await eventQuery.refetch();
    },
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const showMap = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleToggleButton = () => {
    setToggleModal(!toggleModal);
  };

  const handleEditButton = () => {
    void router.push({
      pathname: `/homepage/event/[id]/edit`,
      query: {
        id: event?.id,
      },
    });
  };

  const handleArchiveButton = () => {
    archiveEvent.mutate({
      id: event?.id ?? "",
      archived: !event?.archived ?? true,
    });
  };

  const handleDeleteButton = () => {
    deleteEvent.mutate({
      id: id as string,
    });

    void router.push("/homepage");
  };

  return (
    <div className="flex flex-col flex-wrap">
      <Navbar />

      <div className="relative mx-16 my-10  flex justify-center  gap-12  font-custom-lexend text-customBlack-100 phone:m-5 phone:flex-col   phone:gap-10">
        {isLoading ? (
          <div
            className="isLoading rounded-box border"
            style={{
              width: "40%",
              height: "248px",
            }}
          ></div>
        ) : (
          <Carousel images={event?.images ?? [""]} />
        )}

        <div
          className="flex w-4/5 flex-col"
          style={{
            wordBreak: "break-word",
            whiteSpace: "pre-line",
            hyphens: "auto",
          }}
        >
          {/* EVENT NAME */}
          <section className="flex items-center justify-between">
            {!isLoading ? (
              <h1 className="text-gradient font-custom-epilogue  text-4xl font-extrabold  phone:text-3xl ">
                {event?.name}
              </h1>
            ) : (
              <div className="isLoading h-10"></div>
            )}

            {!isLoading &&
              sessionData?.user.id === event?.organization.user.id && (
                <div className="flex gap-4">
                  <IconButton
                    onClick={() => handleArchiveButton()}
                    title={`${event?.archived ? "Unarchive Event" : "Archive Event"}`}
                  >
                    {event?.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
                  </IconButton>

                  <IconButton
                    onClick={() => handleEditButton()}
                    title="Edit Event"
                  >
                    <EditTwoToneIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => handleToggleButton()}
                    title="Delete Event"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
          </section>

          <div className=" my-2 flex items-center gap-1">
            <EventIcon
              className="h-4 w-4 opacity-75"
              style={{ color: "var(--black100)" }}
            />

            {isLoading ? (
              <div className="isLoading h-5 w-full"></div>
            ) : (
              <p className="text-md italic text-customBlack-50">
                {getDate(event?.date).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-stretch gap-1">
            <PlaceIcon
              className="h-4 w-4 opacity-75"
              style={{ color: "var(--black100)" }}
            />

            {isLoading ? (
              <div className="isLoading mb-6 h-5 w-full"></div>
            ) : (
              <p
                onClick={showMap}
                className="text-md hover:text-gradient mb-6 cursor-pointer italic text-customBlack-50 phone:text-sm"
              >
                {event?.location}
              </p>
            )}

            <Modal
              isOpen={modalIsOpen}
              onRequestClose={showMap}
              contentLabel="Location Modal"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                },
                content: {
                  borderRadius: "15px",
                  width: "80%",
                  height: "90%",
                  margin: "auto",
                  padding: "0",
                },
              }}
            >
              <ViewLocationModal location={event?.location ?? ""} />
            </Modal>
          </div>

          <p
            className="text-md text-customBlack-50 phone:text-sm"
            style={{ fontSize: "12px" }}
          >
            Organized By:
          </p>

          {isLoading ? (
            <div className="isLoading h-5 w-full"></div>
          ) : (
            <p className="text-gradient text-sm">{event?.organizedBy}</p>
          )}

          {event && event?.partners?.length > 0 && (
            <>
              <p
                className="text-md mt-4 text-customBlack-50"
                style={{ fontSize: "12px" }}
              >
                In partnership with:
              </p>

              {isLoading ? (
                <div className="isLoading h-5 w-full"></div>
              ) : (
                event?.partners?.map((partner: string, index: number) => (
                  <p key={index} className="text-gradient text-sm">
                    {partner}
                  </p>
                ))
              )}
            </>
          )}

          {isLoading ? (
            <div className="mt-8 flex flex-col gap-2">
              <div className="isLoading h-5 w-full"></div>
              <div className="isLoading h-5 w-full"></div>
              <div className="isLoading h-5 w-full"></div>
            </div>
          ) : (
            <p className="overflow-wrap break-word mt-8 whitespace-pre-wrap">
              {event?.details}
            </p>
          )}
        </div>
      </div>

      <DeleteModal
        toggleModal={toggleModal}
        handleToggleButton={handleToggleButton}
        handleDeleteButton={handleDeleteButton}
        string={"event"}
      />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDate(date: any) {
  const adjustedDate = date; // Create a new Date object
  adjustedDate.setHours(adjustedDate.getHours() + 8);
  console.log(adjustedDate);
  return adjustedDate;
}

export default EventPage;
