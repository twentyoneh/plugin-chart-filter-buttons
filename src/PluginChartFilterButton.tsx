import React, { MouseEvent, useEffect, useMemo, useRef } from 'react';
import { DataRecordValue, styled } from '@superset-ui/core';
import { PluginChartFilterButtonProps, PluginChartFilterButtonStylesProps } from './types';


const Styles = styled.div<PluginChartFilterButtonStylesProps>`
  background: transparent;
  padding: ${({ theme }) => theme.gridUnit * 2}px 0;
  border-radius: 0;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;

  h3 {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
    font-size: ${({ theme }) => theme.typography.sizes.l}px;
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    color: #1f2937;
  }

  .button-grid {
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.gridUnit * 2}px;
  }

  .phone-button {
    border: none;
    border-radius: 999px;
    padding: 10px 16px;
    background: #ffffff;
    color: #1f2937;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
  }

  .phone-button:hover {
    transform: translateY(-1px);
    background: #e0f2fe;
    box-shadow: 0 8px 20px rgba(14, 116, 144, 0.18);
  }

  .phone-button:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.12);
  }

  .phone-button.active {
    background: #e0f2fe;
    color: #0958d9;
    box-shadow: 0 8px 20px rgba(14, 116, 144, 0.18);
  }

`;

function isSelected(
  selectedValues: DataRecordValue[] | null | undefined,
  value: string,
) {
  return !!selectedValues?.some(selected => String(selected) === value);
}

interface FilterButtonOption {
  phone: string;
  label: string;
}

function buildButtonOptions(
  data: PluginChartFilterButtonProps['data'],
  phoneColumn: string,
  labelColumn: string,
) {
  const seenPhones = new Set<string>();

  return data.reduce<FilterButtonOption[]>((acc, row) => {
    const phone = String(row[phoneColumn]);
    if (seenPhones.has(phone)) {
      return acc;
    }

    seenPhones.add(phone);
    acc.push({
      phone,
      label: String(row[labelColumn] ?? row[phoneColumn]),
    });

    return acc;
  }, []);
}


export default function PluginChartFilterButton(props: PluginChartFilterButtonProps) {
  const {
    data,
    height,
    width,
    labelColumn,
    phoneColumn,
    selectedValues,
    setDataMask,
  } = props;

  const cachedButtonOptionsRef = useRef<FilterButtonOption[]>([]);

  const buttonOptionsFromData = useMemo(
    () => buildButtonOptions(data, phoneColumn, labelColumn),
    [data, labelColumn, phoneColumn],
  );

  useEffect(() => {
    if (!selectedValues?.length) {
      cachedButtonOptionsRef.current = buttonOptionsFromData;
      return;
    }

    if (!cachedButtonOptionsRef.current.length) {
      cachedButtonOptionsRef.current = buttonOptionsFromData;
      return;
    }

    const seenPhones = new Set(
      cachedButtonOptionsRef.current.map(option => option.phone),
    );
    const mergedOptions = [...cachedButtonOptionsRef.current];

    buttonOptionsFromData.forEach(option => {
      if (!seenPhones.has(option.phone)) {
        seenPhones.add(option.phone);
        mergedOptions.push(option);
      }
    });

    cachedButtonOptionsRef.current = mergedOptions;
  }, [buttonOptionsFromData, selectedValues]);

  const buttonOptions =
    selectedValues?.length && cachedButtonOptionsRef.current.length
      ? cachedButtonOptionsRef.current
      : buttonOptionsFromData;

  const applyFilter = (phone: string | null, label?: string) => {
    const values = phone ? [phone] : [];

    setDataMask({
      extraFormData: {
        filters: values.length
          ? [
              {
                col: phoneColumn,
                op: 'IN',
                val: values,
              },
            ]
          : [],
      },
      filterState: {
        value: values.length ? values : null,
        selectedValues: values.length ? values : null,
        label: label ?? null,
      },
    });
  };

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>,
    phone: string,
    label: string,
  ) => {
    event.preventDefault();

    if (isSelected(selectedValues, phone)) {
      applyFilter(null);
      return;
    }

    applyFilter(phone, label);
  };

  return (
  <Styles
    height={height}
    width={width}
  >
    <h3>{props.headerText}</h3>
    <div className="button-grid">
      {buttonOptions.map(option => (
        <button
          className={`phone-button${
            isSelected(selectedValues, option.phone)
              ? ' active'
              : ''
          }`}
          key={option.phone}
          onClick={event =>
            handleClick(
              event,
              option.phone,
              option.label,
            )
          }
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  </Styles>
);
}
