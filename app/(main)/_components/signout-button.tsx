"use client";
import { signout } from "@/lib/actions/auth";

const SignoutButton = () => {
  async function handleSignout() {
    await signout();
  }

  return (
    <div
      role="button"
      className="button-secondary"
      onClick={() => handleSignout()}
    >
      Sign out
    </div>
  );
};

export default SignoutButton;
