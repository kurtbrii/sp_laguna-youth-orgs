import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AuthRedirect: React.FC = () => {
  const userSession = useSession();
  const router = useRouter();

  if (userSession.data)
    if (userSession.data?.user.role === "GUEST") {
      if (router.pathname !== "/auth/signup") {
        window.location.replace("/auth/signup");
      }
    }

  return <></>;
};

export default AuthRedirect;
