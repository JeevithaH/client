import { redirect } from 'next/navigation';

export default function SignUpPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const rawUrl = (searchParams?.callbackUrl || searchParams?.redirect_url || '/checkout') as string;
  const callbackUrl = rawUrl.startsWith('/login') || rawUrl.startsWith('/sign-in') ? '/checkout' : rawUrl;
  redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}
