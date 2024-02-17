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

type VolunteerProps = {
  volunteer: {
    organizationId: string;
    status: string;
    organization: {
      id: string;
      orgName: string;
      phoneNumber: string;
      bio: string;
      user: User;
    };
    volunteer: {
      select: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        role: $Enums.ROLE;
      };
    };
    volunteerId: string;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VolunteerList = ({ volunteer, organization }: any) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const approveStatus = api.volJoinOrg.updateVolJoinOrg.useMutation();

  const handleApproveVol = () => {
    approveStatus.mutate({
      volId: volunteer.id,
      orgId: organization.id,
    });

    alert("Volunteer Approved");
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
        {volunteer.firstName} {volunteer.middleInitial} {volunteer.lastName}
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex gap-4 py-6 font-custom-lexend text-customBlack-100">
          <Image
            className="rounded-md"
            src={`${volunteer.user.image}`}
            height={300}
            width={300}
            alt="user image role"
          />
          <div className="flex flex-col">
            <p className="text-gradient text-lg font-bold">
              {volunteer.firstName} {volunteer.middleInitial}{" "}
              {volunteer.lastName}
            </p>
            <p>Sex: {volunteer.sex}</p>
            <p>Age: {volunteer.age}</p>
            <p>Email: {volunteer.user.email}</p>
            <p className="mb-5">Phone Number: {volunteer.phoneNumber}</p>
            <p className="mb-10">{volunteer.bio}</p>

            <div className="flex gap-4">
              <button
                className="btn-outline w-1/2 px-16 py-2"
                style={{ color: "var(--red)", borderColor: "var(--red)" }}
              >
                Discard
              </button>
              <button
                className="btn-active w-1/2 px-16 py-2"
                onClick={() => handleApproveVol()}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default VolunteerList;
