import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#0C1427] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#0C1427] font-semibold font-serif">
          Authenticating Patron Session...
        </p>
        <p className="text-[11px] text-zinc-500">
          Securing your session with Clerk Atelier SSO.
        </p>
      </div>
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/account"
        signUpFallbackRedirectUrl="/account"
      />
    </div>
  );
}
