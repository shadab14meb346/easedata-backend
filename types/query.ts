export type DataQueryType = {
  name: string;
  description?: string;
  data_source_id: number;
  table_name: string;
  workspace_id: number;
  fields: string[];
  create_at?: string;
  update_at?: string;
};
