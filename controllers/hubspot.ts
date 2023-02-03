import { Client } from "@hubspot/api-client";
import { getMostRecentDataSource } from "../model/data-source";
const hubspotClient = new Client({
  numberOfApiCallRetries: 3,
});
const refreshAccessToken = async (refreshToken: string) => {
  const data = await hubspotClient.oauth.tokensApi.createToken(
    "refresh_token",
    undefined,
    undefined,
    process.env.HUB_SPOT_CLIENT_ID,
    process.env.HUB_SPOT_CLIENT_SECRET,
    refreshToken
  );
  hubspotClient.setAccessToken(data.accessToken);
};
export const getHubSpotContacts = async (userId) => {
  const dataSource = await getMostRecentDataSource(userId);
  //ideally we can use the same access token un till it's not expired but here currently I am getting a new access token on each request.
  await refreshAccessToken(dataSource.refresh_token);
  const limit = 100;
  const after = "0";
  const properties = ["createdate", "firstname", "lastname"];
  const data = await hubspotClient.crm.contacts.basicApi.getPage(
    limit,
    after,
    properties
  );
  const requiredFormatData = data.results.map((result) => {
    const { createdate, firstname, lastname } = result.properties;
    const primaryPropertiesObject = {
      created_at: createdate,
      first_name: firstname,
      last_name: lastname,
    };
    return primaryPropertiesObject;
  });
  return requiredFormatData;
};
