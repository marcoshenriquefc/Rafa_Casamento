export const buildInvitationCode = () => Math.floor(10000000 + Math.random() * 90000000).toString();
export const buildInvitationPassword = () => Math.floor(10000 + Math.random() * 90000).toString();

export const buildGuestPortalUrl = (invitationCode) =>
  `${process.env.FRONTEND_BASE_URL}/convite/${invitationCode}`;
