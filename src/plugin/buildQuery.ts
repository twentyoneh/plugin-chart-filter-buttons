import { buildQueryContext, QueryFormData } from '@superset-ui/core';


export default function buildQuery(formData: QueryFormData) {
  const phoneColumn = formData.phone_column;
  const labelColumn = formData.label_column;

  const columns = [phoneColumn, labelColumn].filter(Boolean);
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      columns,
    },
  ]);
}
