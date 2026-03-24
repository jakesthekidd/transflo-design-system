import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Progress',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const ProgressBar: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressBarModule] },
    template: `
      <div style="width:400px; display:flex; flex-direction:column; gap:1rem;">
        <p-progressbar [value]="25" />
        <p-progressbar [value]="50" />
        <p-progressbar [value]="75" />
        <p-progressbar [value]="100" />
      </div>
    `,
  }),
};

export const ProgressBarWithLabel: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressBarModule] },
    template: `<div style="width:400px"><p-progressbar [value]="65" [showValue]="true" /></div>`,
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressBarModule] },
    template: `<div style="width:400px; height:6px"><p-progressbar mode="indeterminate" /></div>`,
  }),
};

export const Spinner: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressSpinnerModule] },
    template: `
      <div style="display:flex; gap:2rem; align-items:center;">
        <div style="width:50px;height:50px"><p-progressspinner /></div>
        <div style="width:80px;height:80px"><p-progressspinner strokeWidth="4" /></div>
        <div style="width:50px;height:50px"><p-progressspinner strokeWidth="8" animationDuration="2s" /></div>
      </div>
    `,
  }),
};
