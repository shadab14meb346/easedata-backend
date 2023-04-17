import { DataSourceType } from "../types/data-source";
import { verifyToken } from "../common/jwt";
import { DataSource } from "../model/data-source";
import { addDataSourceToWorkspace } from "../model/workspace-to-data-source";
import querystring from "querystring";
import axios from "axios";

export async function handler(event, context, callback) {
  const code = event.queryStringParameters.code;
  const state = JSON.parse(event.queryStringParameters.state);
  const user = verifyToken(state.token);
  const workspaceId = state.workspaceId;
  //TODO: validate the workspaceId is valid and the "user" has access to it
  const url = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  const formData = {
    grant_type: "authorization_code",
    client_id: process.env.MS_CLIENT_ID,
    client_secret: process.env.MS_CLIENT_SECRET,
    redirect_uri: process.env.MS_REDIRECT_URI,
    code,
  };
  try {
    const response = await axios({
      method: "post",
      url: url,
      data: querystring.stringify(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const dataSourceRow = await DataSource.create({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      type: DataSourceType.MS_OFFICE_SHEET,
    });
    await addDataSourceToWorkspace({
      dataSourceId: dataSourceRow.id,
      workspaceId: workspaceId,
    });
  } catch (e) {
    console.log(e);
  }

  return {
    statusCode: 301,
    headers: { Location: process.env.REDIRECT_TO_DASHBOARD },
  };
}
