import React, { MouseEvent, useEffect, createRef } from 'react';
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

  const rootElem = createRef<HTMLDivElement>();


  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    console.log('Plugin element', root);
  });

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
    ref={rootElem}
    height={height}
    width={width}
  >
    <h3>{props.headerText}</h3>
    <div className="button-grid">
      {data.map((row, index) => (
        <button
          className={`phone-button${
            isSelected(selectedValues, String(row[phoneColumn]))
              ? ' active'
              : ''
          }`}
          key={index}
          onClick={event =>
            handleClick(
              event,
              String(row[phoneColumn]),
              String(row[labelColumn] ?? row[phoneColumn]),
            )
          }
          type="button"
        >
          {String(row[labelColumn])}
        </button>
      ))}
    </div>
  </Styles>
);
}