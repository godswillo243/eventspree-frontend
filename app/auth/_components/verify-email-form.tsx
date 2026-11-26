"use client";

import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import {
  startTransition,
  SubmitEventHandler,
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";

import { Slot } from "@/components/input-otp-slot";
import Spinner from "@/components/spinner";
import { cn } from "@/lib/utils";
import { verifyEmail, resendEmailOtp } from "@/lib/actions/auth";

const COOLDOWN_SECONDS = 60;
const storageKey = (email: string) => `resend_at:${email}`;

function useResendCooldown(email: string) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const key = storageKey(email);
    // First visit: an OTP was just sent by signup, so start the cooldown now.
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, String(Date.now() + COOLDOWN_SECONDS * 1000));
    }
    const tick = () => {
      const at = Number(sessionStorage.getItem(key));
      setRemaining(Math.max(0, Math.ceil((at - Date.now()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [email]);

  const restart = () => {
    sessionStorage.setItem(
      storageKey(email),
      String(Date.now() + COOLDOWN_SECONDS * 1000),
    );
    setRemaining(COOLDOWN_SECONDS);
  };

  return [remaining, restart] as const;
}

export default function VerifyEmailForm({ email }: { email: string }) {
  const [otp, setOtp] = useState("");
  const [remaining, restartCooldown] = useResendCooldown(email);
  const [resending, startResend] = useTransition();
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const [state, action, pending] = useActionState(
    async (prev: { error?: string }, fd: { email: string; otp: string }) => {
      const result = await verifyEmail(fd); // on success this redirects and never returns
      setOtp(""); // wrong code → clear the input
      return result;
    },
    {},
  );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    startTransition(() => {
      action({ email, otp });
    });
  };

  const handleResend = () =>
    startResend(async () => {
      try {
        await resendEmailOtp({ email });
        restartCooldown();
        setNotice({ ok: true, text: "We sent you a new code." });
      } catch (e) {
        setNotice({
          ok: false,
          text: (e as Error).message || "Couldn't resend. Try again.",
        });
      }
    });

  const canResend = remaining === 0 && !resending;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h2 className="heading-2">Verify your email.</h2>
      <p className="prose-body">Check your email ({email}) for your code.</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-2"
      >
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="otp" value={otp} />

        <OTPInput
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
          autoComplete="one-time-code"
          disabled={pending}
          render={({ slots }) => (
            <div className="mt-4 flex gap-1">
              {slots.map((slot, i) => (
                <Slot {...slot} key={i} />
              ))}
            </div>
          )}
        />

        <button
          type="submit"
          className="button-primary w-full"
          disabled={pending || otp.length < 6}
        >
          {pending ? <Spinner size="sm" /> : "Verify"}
        </button>

        {state.error && (
          <p role="alert" className="error-text">
            {state.error}
          </p>
        )}
      </form>

      <div className="flex items-center gap-2 prose-body">
        <p>Didn&apos;t see the email?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className={cn(
            "font-medium hover:underline hover:text-neutral-800",
            !canResend && "pointer-events-none text-neutral-400",
          )}
        >
          {resending ? "Sending…" : "Resend"}
        </button>
        {remaining > 0 && <span>({remaining}s)</span>}
      </div>

      {notice && (
        <p role="status" className={notice.ok ? "prose-body" : "error-text"}>
          {notice.text}
        </p>
      )}
    </div>
  );
}
