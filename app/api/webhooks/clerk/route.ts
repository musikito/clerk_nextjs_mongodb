import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/actions/user.action";
import { NextResponse } from "next/server";

/**
 * Handles incoming Clerk webhooks and processes user creation events.
 *
 * This function is the route handler for the POST request to the /api/webhooks/clerk endpoint.
 * It verifies the incoming webhook from Clerk, extracts the user data from the event, and creates a new user in the application.
 *
 * @param req - The incoming HTTP request object.
 * @returns A JSON response with a success message and the created user object.
 */
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  
  /**
   * Handles a Clerk webhook event, creating a new user in the application if the event type is "user.created".
   *
   * @param evt - The Clerk webhook event object.
   * @param body - The raw webhook payload body.
   * @returns A JSON response with a success message and the created user object, or a 400 error response if there is an issue.
   */
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      photo: image_url!,
      firstName: first_name,
      lastName: last_name,
    };

    console.log(user);

    const newUser = await createUser(user);

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "New user created", user: newUser });
  }
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
