import { verifyToken } from "../common/jwt";
import { DataSource } from "../model/data-source";
import { DataSourceType } from "./../types/data-source";
import { addDataSourceToWorkspace } from "../model/workspace-to-data-source";
import querystring from "querystring";
import axios from "axios";

export async function handler(event, context, callback) {
  console.log({ qs: event?.queryStringParameters });
  const code = event?.queryStringParameters?.code;
  const state = JSON.parse(event.queryStringParameters.state);
  const user = verifyToken(state.token);
  //TODO: validate the workspaceId is valid and the "user" has access to it
  const requestBody = {
    code,
    client_id: process.env.GA_CLIENT_ID,
    client_secret: process.env.GA_CLIENT_SECRET,
    redirect_uri: process.env.GA_REDIRECT_URI,
    grant_type: "authorization_code",
  };
  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  const response = await axios.post(
    tokenEndpoint,
    querystring.stringify(requestBody)
  );
  const { access_token, refresh_token } = response.data;
  const dataSourceRow = await DataSource.create({
    access_token: access_token as string,
    refresh_token: refresh_token as string,
    type: DataSourceType.GSHEET,
  });
  console.log({ dataSourceRow });
  await addDataSourceToWorkspace({
    dataSourceId: dataSourceRow.id,
    workspaceId: state.workspaceId,
  });
  return {
    statusCode: 301,
    headers: { Location: process.env.REDIRECT_TO_DASHBOARD },
  };
}
