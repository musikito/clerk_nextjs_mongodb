/**
 * Imports the `SignUp` component from the `@clerk/nextjs` library.
 * This component provides a sign-up form for users to create an account.
 */
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <SignUp afterSignOutUrl="/" />
    </div>
  );
}
