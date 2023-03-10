import { google } from "googleapis";
import fs from "fs";

const oauth2Client = new google.auth.OAuth2(
  process.env.GA_CLIENT_ID,
  process.env.GA_CLIENT_SECRET,
  process.env.GA_REDIRECT_URI
);

export const getGaAccountSummaries = async (refreshToken) => {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  try {
    const response = await google
      .analytics({
        version: "v3",
        auth: oauth2Client,
      })
      .management.accountSummaries.list();
    const accounts = response?.data?.items?.map((item) => {
      return {
        name: item.name,
        id: item.id,
        web_properties: item.webProperties?.map((webProperty) => {
          return {
            id: webProperty.id,
            internal_web_property_id: webProperty.internalWebPropertyId,
            level: webProperty.level,
            name: webProperty.name,
            website_url: webProperty.websiteUrl,
            profiles: webProperty.profiles?.map((profile) => {
              return {
                name: profile.name,
                id: profile.id,
                type: profile.type,
              };
            }),
          };
        }),
      };
    });
    return accounts;
  } catch (e) {
    console.log(e);
  }
};
export const getGaColumns = async (refreshToken) => {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  try {
    const response = await google
      .analytics({
        version: "v3",
        auth: oauth2Client,
      })
      .metadata.columns.list({
        reportType: "ga",
      });
    const dataWithOnlyImportantFields = response?.data?.items?.map(
      (item: any) => {
        const {
          id,
          attributes: { dataType, description, status, type, uiName, group },
        } = item;
        const obj = {
          data_type: dataType,
          description: description,
          group,
          id,
          status,
          type,
          ui_name: uiName,
        };
        return obj;
      }
    );
    return dataWithOnlyImportantFields;
  } catch (e) {
    console.log(e);
  }
};
export const getGaSegments = async (refreshToken) => {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  try {
    const response = await google
      .analytics({
        version: "v3",
        auth: oauth2Client,
      })
      .management.segments.list();
    const dataWithOnlyImportantFields = response?.data?.items?.map(
      (item: any) => {
        const { name, segmentId, definition, type } = item;
        const obj = {
          definition,
          id: segmentId,
          name,
          type,
        };
        return obj;
      }
    );
    return dataWithOnlyImportantFields;
  } catch (e) {
    console.log(e);
  }
};
