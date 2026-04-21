import { v4 as uuidv4 } from 'uuid';

export const buildInvitationCode = () => uuidv4();
export const buildInvitationPassword = () => Math.floor(10000 + Math.random() * 90000).toString();

export const buildGuestPortalUrl = (invitationCode) =>
  `${process.env.FRONTEND_BASE_URL}/convite/${invitationCode}`;
