import ArenasView from "@/components/arenas/ArenasView";
import { useAuthState } from "react-firebase-hooks/auth";

const Arenas = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <div>
      <ArenasView />
    </div>
  );
};

export default Arenas;