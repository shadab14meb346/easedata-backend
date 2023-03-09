import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GA_CLIENT_ID,
  process.env.GA_CLIENT_SECRET,
  process.env.GA_REDIRECT_URI
);

export const getGaAccountSummaries = async () => {
  const refresh_token =
    "1//0gU3vjgoq4_q_CgYIARAAGBASNwF-L9IrA0c4xnY8tAhrQW0OpNqSCmsMM_1smI1n4DOfLCaDpnpAcIF5gT-gYdCIimF6rev8lRw";
  oauth2Client.setCredentials({
    refresh_token,
  });
  try {
    const response = await google
      .analytics({
        version: "v3",
        auth: oauth2Client,
      })
      .management.accountSummaries.list();
    console.log(JSON.stringify(response.data));
  } catch (e) {
    console.log(e);
  }
};
