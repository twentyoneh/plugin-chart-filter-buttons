import {
  ChartProps,
  DataRecordValue,
  TimeseriesDataRecord,
} from '@superset-ui/core';

function normalizeSelectedValues(
  selectedValues: unknown,
  value: unknown,
): DataRecordValue[] | null {
  if (Array.isArray(selectedValues)) {
    return selectedValues as DataRecordValue[];
  }

  if (
    selectedValues &&
    typeof selectedValues === 'object' &&
    !Array.isArray(selectedValues)
  ) {
    return Object.values(selectedValues as Record<string, DataRecordValue>);
  }

  if (Array.isArray(value)) {
    return value as DataRecordValue[];
  }

  return null;
}

export default function transformProps(chartProps: ChartProps) {
  const {
    width,
    height,
    formData,
    queriesData,
    hooks: { setDataMask = () => {} },
    filterState,
  } = chartProps;

  const headerText = formData.headerText ?? formData.header_text;
  const phoneColumn = formData.phoneColumn ?? formData.phone_column;
  const labelColumn = formData.labelColumn ?? formData.label_column;

  const data = queriesData[0].data as TimeseriesDataRecord[];

  return {
    width,
    height,
    data,
    headerText,
    setDataMask,
    phoneColumn,
    labelColumn,
    selectedValues: normalizeSelectedValues(
      filterState?.selectedValues,
      filterState?.value,
    ),
  };
}
