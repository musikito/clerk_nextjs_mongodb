/**
 * Indicates that this file is a client-side React component.
 * This directive tells Next.js to render this component on the client-side instead of the server-side.
 */
"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";

const ClientPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return (
    <div className="h-full flex flex-col items-center justify-center text-2xl">
      Hello, {user.firstName} welcome to Clerk
    </div>
  );
};

export default ClientPage;
