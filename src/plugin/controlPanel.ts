import { t, validateNonEmpty } from '@superset-ui/core';
import { ControlPanelConfig } from '@superset-ui/chart-controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'phone_column',
            config: {
              type: 'SelectControl',
              label: t('Phone column'),
              description: t('Column used to filter the dashboard'),
              validators: [validateNonEmpty],
              mapStateToProps: ({ datasource }) => ({
                choices:
                  datasource?.columns?.map(column => [
                    column.column_name,
                  ]) || [],
              }),
            },
          },
        ],
        [
          {
            name: 'label_column',
            config: {
              type: 'SelectControl',
              label: t('Label column'),
              description: t('Column displayed on the button'),
              validators: [validateNonEmpty],
              mapStateToProps: ({ datasource }) => ({
                choices:
                  datasource?.columns?.map(column => [
                    column.column_name,
                  ]) || [],
              }),
            },
          },
        ],
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      label: t('Chart options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'header_text',
            config: {
              type: 'TextControl',
              default: 'Phone Filter Buttons',
              renderTrigger: true,
              label: t('Header Text'),
              description: t('Text shown above the buttons'),
            },
          },
        ],
      ],
    },
  ],
};

export default config;