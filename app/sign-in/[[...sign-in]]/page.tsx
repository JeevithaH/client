import { redirect } from 'next/navigation';

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const callbackUrl = (searchParams?.callbackUrl || searchParams?.redirect_url || '/account') as string;
  redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}
