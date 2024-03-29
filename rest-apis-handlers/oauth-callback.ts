import { DataSourceType } from "./../types/data-source";
import { Client } from "@hubspot/api-client";
import { verifyToken } from "../common/jwt";
import { DataSource } from "../model/data-source";
import { addDataSourceToWorkspace } from "../model/workspace-to-data-source";
const hubspotClient = new Client();

export async function handler(event, context, callback) {
  const code = event.queryStringParameters.code;
  const state = JSON.parse(event.queryStringParameters.state);
  const user = verifyToken(state.token);
  const workspaceId = state.workspaceId;
  //TODO: validate the workspaceId is valid and the "user" has access to it
  const hubSpotOptions = {
    grant_type: "authorization_code",
    client_id: process.env.HUB_SPOT_CLIENT_ID,
    client_secret: process.env.HUB_SPOT_CLIENT_SECRET,
    redirect_uri: process.env.HUB_SPOT_REDIRECT_URI,
    code,
  };
  const getTokensResponse = await hubspotClient.oauth.tokensApi.createToken(
    hubSpotOptions.grant_type,
    hubSpotOptions.code as string,
    hubSpotOptions.redirect_uri,
    hubSpotOptions.client_id,
    hubSpotOptions.client_secret
  );
  const dataSourceRow = await DataSource.create({
    access_token: getTokensResponse.accessToken,
    refresh_token: getTokensResponse.refreshToken,
    type: DataSourceType.HUB_SPOT,
  });
  await addDataSourceToWorkspace({
    dataSourceId: dataSourceRow.id,
    workspaceId: workspaceId,
  });
  return {
    statusCode: 301,
    headers: { Location: process.env.REDIRECT_TO_DASHBOARD },
  };
}
