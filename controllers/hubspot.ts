import { Client } from "@hubspot/api-client";
import { DataSource } from "../model/data-source";
import { HUB_SPOT_TABLES } from "../types/data-source";
export const hubspotClient = new Client({
  numberOfApiCallRetries: 3,
});
export const refreshAccessToken = async (refreshToken: string) => {
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
export const makeObjectFromKeys = (keys, values) => {
  const obj = {};
  keys.forEach((key) => {
    obj[key] = values[key];
  });
  return obj;
};

type InputType = {
  objectName: HUB_SPOT_TABLES;
  dataSourceId: string;
};
const getFieldDataType = (type) => {
  switch (type) {
    case "string":
      return "TEXT";
    case "number":
      return "NUMBER";
    case "datetime":
      return "DATE";
    default:
      return "TEXT";
  }
};
export const getAllImportantObjectProperties = async ({
  objectName,
  dataSourceId,
}: InputType) => {
  const dataSource = await DataSource.get(dataSourceId);
  await refreshAccessToken(dataSource.refresh_token);
  const data = await hubspotClient.crm.properties.coreApi.getAll(objectName);
  if (objectName === HUB_SPOT_TABLES.DEALS) {
    //In case of deals I am sending all properties because I am not sure which properties are important.
    const importantProperties = data.results
      .sort((a, b) => {
        if (!a?.displayOrder || !b?.displayOrder) return 0;
        return b.displayOrder - a.displayOrder;
      })
      .map((result) => {
        return {
          name: result.name,
          label: result.label,
          data_type: getFieldDataType(result.type),
        };
      });
    return importantProperties;
  }
  //TODO:this can be optimized
  const importantProperties = data.results
    .filter((result) => {
      return result.formField === true || result.name === "createdate";
    })
    .sort((a, b) => {
      if (!a?.displayOrder || !b?.displayOrder) return 0;
      return b.displayOrder - a.displayOrder;
    })
    .map((result) => {
      return {
        name: result.name,
        label: result.label,
        data_type: getFieldDataType(result.type),
      };
    });
  return importantProperties;
};
