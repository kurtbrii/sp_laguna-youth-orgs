type ActivityProps = {
  activity: {
    id: string;
    name: string;
    details: string;
    date: Date;
    location: string;
    images: string[];
    organization: {
      id: string;
      orgName: string;
      phoneNumber: string;
      bio: string;
      user: {
        id: string;
        image: string | null;
      };
    };
    centersTags: string[] | null;
    customTags: string[] | null;
    hasOrganizations: boolean;
    hasVolunteers: boolean;
    hasParticipants: boolean;
    organizationId: string;
  };
};

export type { ActivityProps }