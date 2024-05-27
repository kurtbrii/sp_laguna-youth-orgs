import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Modal from "react-modal";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteModal from "~/components/DeleteModal";
import { useState } from "react";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import EmailActivityCall from "~/components/EmailActivityCall";
import Carousel from "~/components/Carousel";
import ViewLocationModal from "~/components/ViewLocationModal";

const ActivitiesPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [toggleModal, setToggleModal] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const activityQuery = api.activity?.getOne.useQuery({
    id: id as string,
  });

  const activity = activityQuery.data;
  const isLoading = activityQuery.isLoading;

  const deleteActivity = api.activity.deleteActivity.useMutation();

  // ! USER IS AN ORGANIZATION OR VOLUNTEER
  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const volunteer = user.data?.volunteer;
  const organization = user.data?.organization;

  const deleteOrgOrVol = api.activityCall.deleteVolJoinOrg.useMutation();

  // ! LOGIC FOR GETTING ORGANIZATIONS
  // const getOrganization = api.activityCall.getOrgOrVol.useQuery({
  //   activityId: id as string,
  //   orgId: organization?.id ?? "",
  //   status: "PENDING",
  // });

  const getOrgOrVol = api.activityCall.getOrgOrVol.useQuery({
    activityId: id as string,
    volId: volunteer?.id,
    orgId: organization?.id,
    // label: "volunteer",
    status: "PENDING",
  });

  // ! LOGIC FOR TOGGLE BUTTONS
  const [toggleVolunteerNow, setToggleVolunteerNow] = useState(false);
  const [togglePartnership, setTogglePartnership] = useState(false);
  const [toggleJoinActivity, setToggleJoinActivity] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const showMap = () => {
    setModalIsOpen(!modalIsOpen);
  };

  // if (!id) {
  //   return <div>No organization ID provided</div>;
  // }

  // if (activityQuery.isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (activityQuery.error ?? !activityQuery.data) {
  //   return <div>Error loading organization data</div>;
  // }

  // ! LOGIC FOR TOGGLE HANDLING
  const handleToggleVolunteer = () => {
    setToggleVolunteerNow(!toggleVolunteerNow);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Add smooth scrolling effect
    });
  };

  const handleToggleOrganization = () => {
    setTogglePartnership(!togglePartnership);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Add smooth scrolling effect
    });
  };

  const handleToggleGuest = () => {
    setToggleJoinActivity(!toggleJoinActivity);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Add smooth scrolling effect
    });
  };

  const handleToggleButton = () => {
    setToggleModal(!toggleModal);
  };

  // ! ADD/EDIT ACTIVITY
  const handleEditButton = () => {
    void router.push({
      pathname: `/homepage/activities/[id]/edit`,
      query: {
        id: activity?.id,
      },
    });
  };

  const handleDeleteButton = () => {
    deleteActivity.mutate({
      id: id as string,
    });

    void router.push("/homepage/activities");
  };

  // ! VOLUNTEER/ORGANIZATION JOINING/PARTNERING LOGIC
  const handleDeleteOrgOrVolActivity = () => {
    deleteOrgOrVol.mutate({
      activityId: id as string,
      volId: volunteer?.id,
      orgId: organization?.id,
    });

    alert("Cancel Successful");
  };

  const handleRouterPush = (link: string) => {
    void router.push(`${id as string}/${link}`);
  };

  return (
    <div className="mb-10 flex flex-col">
      <Navbar />
      <div className="mx-16 my-10 mb-0 flex  justify-center gap-8 font-custom-lexend   text-customBlack-100">
        {/* IMAGES OF EVENTS*/}

        {isLoading ? (
          <div
            className="isLoading rounded-box border"
            style={{
              width: "40%",
              height: "248px",
            }}
          ></div>
        ) : (
          <Carousel images={activity?.images ?? [""]} />
        )}

        <div
          className="flex w-4/5 flex-col"
          style={{
            wordBreak: "break-word",
            whiteSpace: "pre-line",
            hyphens: "auto",
          }}
        >
          <div>
            {/* EVENT NAME */}
            <section className="flex  items-center justify-between">
              {!isLoading ? (
                <h1 className="text-gradient font-custom-epilogue text-4xl  font-extrabold ">
                  {activity?.name}
                </h1>
              ) : (
                <div className="isLoading h-10"></div>
              )}

              {!isLoading &&
                sessionData?.user.id === activity?.organization.user.id && (
                  <div className="flex gap-4">
                    <IconButton onClick={handleEditButton}>
                      <EditTwoToneIcon />
                    </IconButton>
                    <IconButton onClick={() => handleToggleButton()}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )}
            </section>

            <div>
              <div className="my-2 flex items-center gap-1 ">
                <EventIcon
                  className="h-4 w-4 opacity-75"
                  style={{ color: "var(--black100)" }}
                />

                {isLoading ? (
                  <div className="isLoading h-5 w-full"></div>
                ) : (
                  <p className="text-md italic text-customBlack-50">
                    {activity?.date.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex gap-1">
                <PlaceIcon
                  className="h-4 w-4 opacity-75"
                  style={{ color: "var(--black100)" }}
                />

                {isLoading ? (
                  <div className="isLoading h-5 w-full"></div>
                ) : (
                  <p
                    onClick={showMap}
                    className="text-md hover:text-gradient mb-6 cursor-pointer italic text-customBlack-50 phone:text-sm"
                  >
                    {activity?.location}
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
                  <ViewLocationModal location={activity?.location ?? ""} />
                </Modal>
              </div>
            </div>

            <p
              className="text-md text-customBlack-50"
              style={{ fontSize: "12px" }}
            >
              Organized By:
            </p>

            {isLoading ? (
              <div className="isLoading h-5 w-full"></div>
            ) : (
              <button
                className="text-gradient text-sm"
                onClick={() =>
                  router.push(
                    `/homepage/organization/${activity?.organization?.id}`,
                  )
                }
              >
                {activity?.organization?.orgName}
              </button>
            )}

            {isLoading ? (
              <div className="mt-8 flex flex-col gap-2">
                <div className=" isLoading h-5"></div>
                <div className=" isLoading h-5"></div>
                <div className=" isLoading h-5"></div>
              </div>
            ) : (
              <p className=" mt-8 whitespace-pre-wrap">{activity?.details}</p>
            )}
          </div>
        </div>

        {/* <button onClick={() => alert(getOrgOrVol.data?.[0]?.volunteerId)}>
          button
        </button> */}
      </div>

      {/* CENTERS OF PARTICIPATION TAGS */}
      <div className="mx-20 mb-3 mt-10 flex justify-center gap-2">
        {activity?.centersTags?.map((data, index) => (
          <button
            key={index}
            className="flex items-center gap-5"
            onClick={() =>
              router.push(
                `/homepage/centers-of-participation?id=${activity?.organization?.id}&name=${activity?.organization?.orgName}&tag=${data}`,
              )
            }
          >
            <p
              className=" btn-outline border border-primary px-3 py-2 text-primary "
              style={{ fontSize: "12px" }}
            >
              {data}
            </p>
          </button>
        ))}
      </div>

      {/* CUSTOM TAGS */}
      <div className="mx-20 mb-20 flex justify-center gap-2">
        {activity?.customTags?.map((data, index) => (
          <div key={index} className="flex items-center gap-5">
            <p
              className=" btn-outline border border-customBlack-100 px-3 py-2 text-customBlack-100 "
              style={{ fontSize: "12px" }}
            >
              {data}
            </p>
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      {sessionStatus !== "authenticated" && activity?.hasParticipants && (
        <button
          className="btn-active w-1/2 self-center px-2 py-2"
          onClick={() => handleToggleGuest()}
        >
          Join Activity
        </button>
      )}

      {sessionData?.user.role === "VOLUNTEER" &&
        activity?.hasVolunteers &&
        (getOrgOrVol.data?.[0]?.volunteerId ? (
          getOrgOrVol.data?.[0]?.status === "PENDING" ? (
            <button
              className="btn-outline w-1/2 self-center px-2 py-2"
              onClick={() => handleDeleteOrgOrVolActivity()}
            >
              Cancel Request
            </button>
          ) : (
            <button
              className="btn-active w-1/2 cursor-no-drop self-center px-2 py-2  opacity-60 hover:translate-y-0"
              disabled
            >
              Already Joined
            </button>
          )
        ) : (
          <button
            className="btn-active w-1/2 self-center px-2 py-2"
            onClick={() => handleToggleVolunteer()}
            // onClick={() => handleVolunteerCall()}
          >
            Volunteer Now
          </button>
        ))}

      {sessionData?.user.role === "ORGANIZATION" &&
        organization?.id !== activity?.organizationId &&
        activity?.hasOrganizations &&
        (getOrgOrVol.data?.[0]?.organizationId ? (
          getOrgOrVol.data?.[0]?.status === "PENDING" ? (
            <button
              className="btn-outline w-1/2 self-center px-2 py-2"
              onClick={() => handleDeleteOrgOrVolActivity()}
            >
              Cancel Request
            </button>
          ) : (
            <button
              className="btn-active w-1/2 cursor-no-drop self-center px-2 py-2  opacity-60 hover:translate-y-0"
              disabled
            >
              Already Partnered With
            </button>
          )
        ) : (
          <button
            className="btn-active w-1/2 self-center px-2 py-2"
            onClick={() => handleToggleOrganization()}

            // onClick={() => handleOrganizationCall()}
          >
            Partner With Us
          </button>
        ))}

      {/* FORMS */}

      <div className="mx-16">
        {toggleVolunteerNow || togglePartnership ? (
          <>
            {toggleVolunteerNow && (
              <section className="mx-40 mt-6 flex flex-row items-center justify-center bg-secondary p-4 ">
                <p className="font-custom-epilogue text-xl font-extrabold text-white">
                  Volunteer Now
                </p>
              </section>
            )}

            {togglePartnership && (
              <section className="mx-40 mt-6 flex flex-row items-center justify-center bg-secondary p-4 ">
                <p className="font-custom-epilogue text-xl font-extrabold text-white">
                  Partner With Us
                </p>
              </section>
            )}

            <EmailActivityCall
              activity={activity}
              sessionEmail={sessionData?.user.email}
              role={sessionData?.user.role ?? "GUEST"}
              volunteer={volunteer}
              organization={organization}
            />
          </>
        ) : null}

        {toggleJoinActivity && (
          <>
            <section className="mx-40 mt-6 flex flex-row items-center justify-center bg-secondary p-4 ">
              <p className="font-custom-epilogue text-xl font-extrabold text-white">
                Join Activity
              </p>
            </section>
            <EmailActivityCall
              activity={activity}
              sessionEmail={sessionData?.user.email}
              role={sessionData?.user.role ?? "GUEST"}
            />
          </>
        )}
      </div>

      <div className="mx-20 flex justify-center gap-5 ">
        {/* MANAGING ACTIVITIES */}
        {sessionData?.user.role === "ORGANIZATION" &&
          organization?.id === activity?.organizationId &&
          activity?.hasOrganizations && (
            <button
              className="btn-outline w-1/2 self-center px-2 py-2"
              onClick={() => handleRouterPush("partnership")}
            >
              Manage Partnership
            </button>
          )}

        {sessionData?.user.role === "ORGANIZATION" &&
          organization?.id === activity?.organizationId &&
          activity?.hasParticipants && (
            <button
              className="btn-outline w-1/2 self-center px-2 py-2"
              onClick={() => handleRouterPush("participants")}
            >
              Manage Participants
            </button>
          )}

        {sessionData?.user.role === "ORGANIZATION" &&
          organization?.id === activity?.organizationId &&
          activity?.hasVolunteers && (
            <button
              className="btn-outline w-1/2 self-center px-2 py-2"
              onClick={() => handleRouterPush("volunteers")}
            >
              Manage Volunteers
            </button>
          )}
      </div>

      <DeleteModal
        toggleModal={toggleModal}
        handleToggleButton={handleToggleButton}
        handleDeleteButton={handleDeleteButton}
        string={"activity"}
      />
      {/* <button onClick={() => alert(activity?.id)}>kodo</button> */}
    </div>
  );
};

export default ActivitiesPage;
