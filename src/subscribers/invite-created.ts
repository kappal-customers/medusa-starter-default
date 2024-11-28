import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import {
  INotificationModuleService,
  IUserModuleService,
} from "@medusajs/types";
import { Modules } from "@medusajs/utils";
import { EmailTemplates } from "../modules/email/templates";

export default async function userInviteHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);
  const userModuleService: IUserModuleService = container.resolve(Modules.USER);
  const invite = await userModuleService.retrieveInvite(data.id);

  try {
    await notificationModuleService.createNotifications({
      to: invite.email,
      channel: "email",
      template: EmailTemplates.INVITE_USER,
      data: {
        emailOptions: {
          replyTo: "info@example.com",
          subject: "You've been invited to Kappal Store!",
        },
        inviteLink: `${process.env.BACKEND_URL}/dashboard/invite?token=${invite.token}`,
        preview: "The administration dashboard awaits...",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export const config: SubscriberConfig = {
  event: ["invite.created", "invite.resent"],
};