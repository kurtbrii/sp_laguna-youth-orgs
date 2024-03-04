import React from "react";
import Image from "next/image";
import vol2 from "public/images/vol2.png";
import Link from "next/link";

interface OrgProps {
  organization: {
    id: string;
    orgName: string;
    phoneNumber: string;
    bio: string;
    userId: string;
    mission: string;
    vision: string;
    objectives: string;
    user: {
      id: string;
      image: string | null;
      role: string;
      email: string | null;
    };
    event: {
      id: string;
      name: string;
      organizedBy: string;
      details: string;
      location: string;
      date: Date; // Update this line to Date
      partners: string[];
    }[];
  };
  searchText: string;
}

const OrgCard = ({ organization, searchText }: OrgProps) => {
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(regex, '<span class="highlight">$1</span>'),
        }}
      />
    );
  };

  return (
    <Link
      href={`/homepage/organization/${organization.id}`}
      className="relative h-64  w-72 cursor-pointer flex-col overflow-hidden rounded-md  object-fill  font-custom-lexend  shadow-2xl  transition-transform duration-300 hover:scale-105"
    >
      <style jsx global>{`
        .highlight {
          color: #00bd6e;
          font-weight: black;
        }
      `}</style>
      {/* <div className="h-2/5 bg-slate-600"> */}
      <Image src={vol2} className="h-2/5 w-full object-cover" alt="sunset " />
      <div className=" mx-4 mt-6 h-3/5">
        <p className=" mb-3 overflow-hidden text-ellipsis whitespace-nowrap font-custom-epilogue  text-sm font-black  text-primary">
          {highlightText(organization.orgName.toUpperCase(), searchText)}
        </p>

        <p className="text-sm">
          {/* {organization?.user?.email} */}
          {highlightText(organization?.user?.email ?? "", searchText)}
        </p>
        <p className="text-sm">{organization.phoneNumber}</p>
        {/* <p className="text-sm">Role: {organization?.user?.role}</p> */}
      </div>
      <Image
        className="absolute left-4 top-16 rounded-md"
        src={`${organization?.user?.image}`}
        height={60}
        width={60}
        alt="user image role"
      />
    </Link>
  );
};

export default OrgCard;
