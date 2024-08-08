import UserInfo from "@/components/UserInfo";
import { currentUser } from "@/lib/auth";

const Server = async () => {
  // retrieve the user's data from the session object
  const user = await currentUser();

  // pass down user's information retrieved from the lib utility function
  return <UserInfo user={user} label="💻 Server component" />;
};

export default Server;
