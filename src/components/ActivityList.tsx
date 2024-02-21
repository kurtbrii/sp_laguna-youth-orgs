import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSession } from "next-auth/react";
import { $Enums, User } from "@prisma/client";
import Image from "next/image";
import { api } from "~/utils/api";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActivityList = ({ data }: any) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const volunteer = data?.volunteer;
  const organization = data?.organization;
  const activity = data?.activity;

  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const cancelActivity = api.activityCall.deleteVolJoinOrg.useMutation();

  const handleDeleteActivity = () => {
    cancelActivity.mutate({
      volId: volunteer.id,
      activityId: activity.id,
    });

    // alert(volunteer.id);
    // alert(activity.id);

    alert("Deleted Activity");
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      style={{
        color: `${expanded ? "white" : "var(--black-100)"}`,
        marginBottom: "30px",
      }}
    >
      <AccordionSummary
        aria-controls="panel1-content"
        style={{
          background: `${expanded ? "linear-gradient(to right, var(--primary), var(--secondary))" : "white"}`,
          color: `${expanded ? "white" : "var(--black-100)"}`,
          fontWeight: "bold",
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        {activity.name} by {activity.organization.orgName}
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex flex-col gap-10 font-custom-lexend text-customBlack-100">
          <div>
            <div className="my-2 flex items-center gap-1 ">
              <EventIcon
                className="h-4 w-4 opacity-75"
                style={{ color: "var(--black100)" }}
              />

              <p className="text-md italic text-customBlack-50">
                {activity?.date.toLocaleString()}
              </p>
            </div>

            <div className="flex items-stretch gap-1">
              <PlaceIcon
                className="h-4 w-4 opacity-75"
                style={{ color: "var(--black100)" }}
              />

              <p className="text-md italic text-customBlack-50">
                {activity?.location}
              </p>
            </div>
          </div>

          <p className="">
            Details: <br />
            {activity.details}
          </p>

          <div className="flex gap-4">
            <button
              className="btn-outline px-16 py-2"
              style={{ color: "var(--red)", borderColor: "var(--red)" }}
              onClick={() => handleDeleteActivity()}
            >
              Cancel Request
            </button>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActivityList;
