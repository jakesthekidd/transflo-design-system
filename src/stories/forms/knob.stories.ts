import type { Meta, StoryObj } from '@storybook/angular';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/Knob',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [KnobModule, FormsModule] },
    props: { value: 40 },
    template: `<p-knob [(ngModel)]="value" />`,
  }),
};

export const WithStep: Story = {
  render: () => ({
    moduleMetadata: { imports: [KnobModule, FormsModule] },
    props: { value: 25 },
    template: `<p-knob [(ngModel)]="value" [step]="25" />`,
  }),
};

export const MinMax: Story = {
  render: () => ({
    moduleMetadata: { imports: [KnobModule, FormsModule] },
    props: { value: -20 },
    template: `<p-knob [(ngModel)]="value" [min]="-50" [max]="50" />`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [KnobModule, FormsModule] },
    props: { value: 65 },
    template: `<p-knob [(ngModel)]="value" [disabled]="true" />`,
  }),
};

export const CustomSize: Story = {
  render: () => ({
    moduleMetadata: { imports: [KnobModule, FormsModule] },
    props: { value: 75 },
    template: `<p-knob [(ngModel)]="value" [size]="150" />`,
  }),
};
