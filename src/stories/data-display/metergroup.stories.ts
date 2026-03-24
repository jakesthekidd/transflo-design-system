import type { Meta, StoryObj } from '@storybook/angular';
import { MeterGroupModule } from 'primeng/metergroup';

const meta: Meta = {
  title: 'PrimeNG/Data Display/MeterGroup',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [MeterGroupModule] },
    props: {
      value: [
        { label: 'Apps', color: '#2474BB', value: 40 },
        { label: 'Messages', color: '#72CDF4', value: 25 },
        { label: 'Media', color: '#00BF30', value: 20 },
        { label: 'System', color: '#FFA300', value: 15 },
      ],
    },
    template: `<div style="width:400px"><p-metergroup [value]="value" /></div>`,
  }),
};

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: [MeterGroupModule] },
    props: {
      value: [
        { label: 'Q1', color: '#2474BB', value: 35 },
        { label: 'Q2', color: '#1D5D96', value: 25 },
        { label: 'Q3', color: '#72CDF4', value: 20 },
        { label: 'Q4', color: '#E3F5FD', value: 20 },
      ],
    },
    template: `<div style="height:250px"><p-metergroup [value]="value" orientation="vertical" /></div>`,
  }),
};
