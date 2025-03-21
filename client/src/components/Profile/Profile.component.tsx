import { useParams } from "react-router-dom";

export const Profile = () => {
  const { profileId } = useParams();

  return <div>Profile {profileId}</div>;
};

