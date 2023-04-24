import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

const oauthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
});
const refreshAccessToken = async (refreshToken: string) => {
  try {
    const data = {
      client_id: process.env.GA_CLIENT_ID,
      client_secret: process.env.GA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    };
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      data
    );
    oauthClient.setCredentials({
      access_token: response.data.access_token,
      refresh_token: refreshToken,
    });
    return response.data.access_token;
  } catch (error) {
    console.log("Error in refreshing access token");
    console.error(error);
    throw error;
  }
};
export const populateGSheet = async ({
  data,
  gsheetId,
  gsheetOauthRefreshToken,
}) => {
  try {
    await refreshAccessToken(gsheetOauthRefreshToken);
    const doc = new GoogleSpreadsheet(gsheetId);
    doc.useOAuth2Client(oauthClient);
    await doc.loadInfo();
    //pushing the data to the first sheet in the spreadsheet
    const sheet = doc.sheetsByIndex[0];
    await sheet.clear();
    const columns = Object.keys(data[0]);
    await sheet.setHeaderRow(columns);
    await sheet.addRows(data);
    console.log(`Data successfully pushed to Google Sheet`);
    return {
      status: 200,
      message: "Data successfully pushed to Google Sheet",
    };
  } catch (error) {
    console.log("Error in populating Google Sheet");
    console.error(error);
    throw error;
  }
};
