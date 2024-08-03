/**
 * Imports the `SignIn` component from the `@clerk/nextjs` library.
 * This component provides a sign-in interface for users, allowing them to authenticate with the application.
 */
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <SignIn afterSignOutUrl="/" />
    </div>
  );
}
