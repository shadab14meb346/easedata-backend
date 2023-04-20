import { DataSource } from "../model/data-source";
import { DataQuery } from "../model/query";
import { Workspace } from "../model/workspace";
import { UserForJWTGeneration } from "../types/user";
import { DataSourceType } from "../types/data-source";
import {
  hubspotClient,
  makeObjectFromKeys,
  refreshAccessToken,
} from "./hubspot";
import { ApolloError } from "apollo-server-lambda";
import axios from "axios";
import { QuerySchedule } from "../model/query-schedule";

const DEFAULT_PAGE_SIZE = 100;

interface DataQueryInput {
  user: UserForJWTGeneration;
  input: DataQuery.CreateOpts;
}

export const createQuery = async (data: DataQueryInput) => {
  const { user, input } = data;
  //TODO:keep the check if workspace exists otherwise throw error
  //TODO:only admin of the workspace can create a query keep this check here.
  const result = await DataQuery.create(input);
  return result;
};
interface GenericInput {
  user: UserForJWTGeneration;
  id: string;
}

export const getAQuery = async ({ id, user }: GenericInput) => {
  //TODO: keep the check if query exists otherwise throw error
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const result = await DataQuery.get(id);
  return result;
};

export const getDataQueriesOfAWorkspace = async ({
  id,
  user,
}: GenericInput) => {
  const workspace = await Workspace.getAWorkspace(id);
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const results = await DataQuery.getDataQueriesOfAWorkspace(id);
  return results;
};

export const getScheduleQueryOfAWorkspace = async ({
  id,
  user,
}: GenericInput) => {
  const workspace = await Workspace.getAWorkspace(id);
  if (!workspace) {
    throw new ApolloError("Workspace not found");
  }
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const results = await QuerySchedule.getScheduledQueryOfAWorkspace(id);
  return results;
};

type GetBetweenEquivalentFiltersInput = {
  field: string;
  value: string;
  highValue: string;
};

const getBetweenEquivalentFilters = (
  input: GetBetweenEquivalentFiltersInput
) => {
  const { field, value, highValue } = input;
  const greaterThenAndEqualFilter = {
    propertyName: field,
    value,
    operator: "GTE",
  };
  const lessThenAndEqualFilter = {
    propertyName: field,
    value: highValue,
    operator: "LTE",
  };
  return [greaterThenAndEqualFilter, lessThenAndEqualFilter];
};

const getPageInfo = (paging) => {
  const pageInfo = {
    has_next_page: !!paging?.next?.after,
    has_previous_page: false,
    start_cursor: "0",
    end_cursor: paging?.next?.after || "",
  };
  return pageInfo;
};

const getFilteredObjects = async ({
  fields,
  filters,
  sort,
  table_name,
  limit = DEFAULT_PAGE_SIZE,
  after,
}) => {
  const filterGroup = {
    filters: filters
      .map((filter) => {
        if (filter.operator === "BETWEEN") {
          const betweenFilters = getBetweenEquivalentFilters({
            field: filter.field,
            value: filter.value,
            highValue: filter.high_value,
          });
          return betweenFilters;
        }
        const filterObj = {
          propertyName: filter.field,
          operator: filter.operator,
          value: filter.value,
        };
        return filterObj;
      })
      .flat(),
  };
  let stringifySort = "";
  //TODO:fix the sort not working as expected
  if (sort) {
    stringifySort = JSON.stringify({
      propertyName: sort.field,
      direction: sort.direction,
    });
  }
  //Here by default sending an empty query.
  const query = "";

  const publicObjectSearchRequest = {
    filterGroups: [filterGroup],
    ...(stringifySort && { sorts: [stringifySort] }),
    query,
    properties: fields,
    limit,
    after,
  };
  const response = await hubspotClient.crm[table_name].searchApi.doSearch(
    //@ts-ignore
    publicObjectSearchRequest
  );
  const data = response.results.map((result) => {
    const onlyQueriedFields = makeObjectFromKeys(fields, result.properties);
    return onlyQueriedFields;
  });
  return {
    filterObjects: data,
    paging: response.paging,
  };
};

const getHubSpotDataUsingRestAPICall = async ({ accessToken, properties }) => {
  const options = {
    method: "GET",
    url: "https://api.hubspot.com/crm/v3/objects/contacts",
    params: { properties },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: { count: 10, vidOffset: 0 },
  };
  const response = await axios.request(options);
  return response.data;
};
const getHubSpotObjectsData = async (input) => {
  const {
    table_name,
    fields,
    filters,
    sort,
    refresh_token,
    limit = DEFAULT_PAGE_SIZE,
    after = "0",
  } = input;
  //TODO:Enhancements. Ideally we can use the same access token until it's not expired but here currently I am getting a new access token on each request.
  const accessToken = await refreshAccessToken(refresh_token);

  try {
    if (filters?.length) {
      const { filterObjects, paging } = await getFilteredObjects({
        fields,
        filters,
        sort,
        table_name,
        limit,
        after,
      });
      return { data: filterObjects, page_info: getPageInfo(paging) };
    }
    const data = await hubspotClient.crm[table_name].basicApi.getPage(
      limit,
      after,
      fields
    );
    const requiredFormatData = data.results.map((result) => {
      const primaryPropertiesObject = makeObjectFromKeys(
        fields,
        result.properties
      );
      return primaryPropertiesObject;
    });
    return {
      data: requiredFormatData,
      page_info: getPageInfo(data.paging),
    };
  } catch (e) {
    console.log(e);
    throw new ApolloError(
      "Unexpected error from backend, please retry",
      "UNEXPECTED_ERROR"
    );
  }
};
export const executeQuery = async ({
  user,
  input,
  limit,
  after,
}): Promise<{ data: any[]; page_info: any }> => {
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const { data_source_id, ...restInput } = input;
  const dataSource = await DataSource.get(data_source_id);
  if (dataSource.type === DataSourceType.HUB_SPOT) {
    return await getHubSpotObjectsData({
      ...restInput,
      refresh_token: dataSource.refresh_token,
      limit,
      after,
    });
  }
  return {
    data: [],
    page_info: {},
  };
};

const getGSheetIdFromUrl = (url) => {
  const regex = /\/d\/([^/]+)/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  }
  throw new ApolloError("Invalid Google Sheet URL", "INVALID_GSHEET_URL");
};
export const createScheduleQuery = async ({
  query_id,
  gsheet_url,
  interval,
}) => {
  try {
    //TODO: keep a check if  the query_id is valid
    const gSheetId = getGSheetIdFromUrl(gsheet_url);
    const querySchedule = await QuerySchedule.create({
      query_id,
      g_sheet_id: gSheetId,
      interval,
    });
    return {
      id: querySchedule.id,
      query_id: querySchedule.query_id,
      interval: querySchedule.interval,
      status: querySchedule.status,
    };
  } catch (error) {
    throw new ApolloError("Couldn't create query schedule", "DBError");
  }
};
