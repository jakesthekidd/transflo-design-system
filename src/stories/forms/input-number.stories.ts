import type { Meta, StoryObj } from '@storybook/angular';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/InputNumber',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberModule, FormsModule] },
    props: { value: null },
    template: `<div style="width:200px"><p-inputnumber [(ngModel)]="value" placeholder="Enter a number" /></div>`,
  }),
};

export const Currency: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberModule, FormsModule] },
    props: { value: 1500 },
    template: `<div style="width:200px"><p-inputnumber [(ngModel)]="value" mode="currency" currency="USD" locale="en-US" /></div>`,
  }),
};

export const WithButtons: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberModule, FormsModule] },
    props: { value: 0 },
    template: `<div style="width:160px"><p-inputnumber [(ngModel)]="value" [showButtons]="true" [min]="0" [max]="100" /></div>`,
  }),
};

export const Percentage: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberModule, FormsModule] },
    props: { value: 0.5 },
    template: `<div style="width:160px"><p-inputnumber [(ngModel)]="value" prefix="%" [minFractionDigits]="1" [maxFractionDigits]="2" /></div>`,
  }),
};

export const Decimal: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberModule, FormsModule] },
    props: { value: 1.5 },
    template: `<div style="width:200px"><p-inputnumber [(ngModel)]="value" [minFractionDigits]="2" [maxFractionDigits]="5" /></div>`,
  }),
};
