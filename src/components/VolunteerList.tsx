/* eslint-disable @typescript-eslint/no-explicit-any */
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

const VolunteerList = ({ volunteer, organization, data, refetch }: any) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const approveStatus = api.volJoinOrg.updateVolJoinOrg.useMutation();

  const discard = api.volJoinOrg.deleteVolJoinOrg.useMutation();

  const handleApproveVol = async () => {
    approveStatus.mutate({
      volId: volunteer.id,
      orgId: organization.id,
    });

    alert("Request Approved");

    await refetch();
    await refetch();
  };

  const handleDiscard = async () => {
    discard.mutate({
      volId: volunteer.id,
      orgId: organization.id,
    });

    alert("Request Discarded");

    await refetch();
    await refetch();
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
        <div className="flex gap-10 py-6 font-custom-lexend text-customBlack-100">
          <Image
            className="h-1/5 w-1/5 rounded-md"
            src={`${volunteer.user.image}`}
            height={300}
            width={300}
            alt="user image role"
          />
          <div className="flex w-4/5 flex-col">
            <Typography
              className="text-gradient text-lg font-bold"
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "var(--black-100)",
                fontFamily: "Lexend, sans-serif",
              }}
            >
              {volunteer.firstName} {volunteer.middleInitial}{" "}
              {volunteer.lastName}
            </Typography>
            <Typography
              style={{
                color: "var(--black-100)",
                fontFamily: "Lexend, sans-serif",
              }}
            >
              Sex: {volunteer.sex}
            </Typography>
            <Typography>Age: {volunteer.age}</Typography>
            <Typography
              style={{
                color: "var(--black-100)",
                fontFamily: "Lexend, sans-serif",
              }}
            >
              Email: {volunteer.user.email}
            </Typography>
            <Typography
              className="mb-5"
              style={{
                marginBottom: "30px",

                color: "var(--black-100)",
                fontFamily: "Lexend, sans-serif",
              }}
            >
              Phone Number: {volunteer.phoneNumber}
            </Typography>

            <Typography
              className="mb-10"
              style={{
                color: "var(--black-100)",
                fontFamily: "Lexend, sans-serif",
              }}
            >
              <p className="italic text-customBlack-50">Bio:</p>
              {volunteer.bio}
            </Typography>
            <Typography
              style={{
                color: "var(--black-100)",
                fontFamily: "Lexend, sans-serif",
                marginBottom: "28px",
              }}
            ></Typography>

            <Typography
              style={{
                color: "var(--black-100)",
                fontFamily: "Lexend, sans-serif",
                whiteSpace: "pre-wrap",
              }}
            >
              <p className="italic text-customBlack-50">Email Content:</p>
              {data.body}
            </Typography>

            <div className="mt-12 flex gap-4">
              <button
                className="btn-active w-1/3 px-16 py-2"
                onClick={() => handleApproveVol()}
              >
                Confirm
              </button>

              <button
                className="btn-outline w-1/3 px-16 py-2"
                style={{ color: "var(--red)", borderColor: "var(--red)" }}
                onClick={() => handleDiscard()}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default VolunteerList;
