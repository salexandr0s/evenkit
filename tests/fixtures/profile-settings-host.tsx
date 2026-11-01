import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ProfileSettings, type ProfileValue } from "../../registry/blocks/account-settings.js";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

declare global { interface Window { profileTestHost: { resolve: () => void; reject: () => void } } }

const profile: ProfileValue = { id: "alex", name: "Alex Morgan", email: "alex@example.test" };
function ProfileHost() {
  const requests = useRef<{ resolve: () => void; reject: () => void }[]>([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    window.profileTestHost = {
      resolve: () => requests.current.shift()?.resolve(),
      reject: () => requests.current.shift()?.reject(),
    };
  }, []);
  return <>
    <ProfileSettings profile={profile} onSave={draft => {
      setCount(value => value + 1);
      return new Promise<ProfileValue>((resolve, reject) => {
        requests.current.push({ resolve: () => resolve(draft), reject: () => reject(new Error("Please retry the save.")) });
      });
    }} />
    <label>Outside the profile<input /></label>
    <output aria-label="Save requests">{count}</output>
  </>;
}

createRoot(document.getElementById("root")!).render(<ProfileHost />);
