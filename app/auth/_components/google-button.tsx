import Image from "next/image";

const GoogleButton = ({ redirectTo }: { redirectTo?: string }) => {
  return (
    <a
      className="button-secondary w-full max-w-sm mt-8"
      href={`/api/auth/google${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
    >
      <Image
        width={24}
        height={24}
        src="https://img.icons8.com/color/48/google-logo.png"
        alt=""
      />
      Continue with Google
    </a>
  );
};

export default GoogleButton;
