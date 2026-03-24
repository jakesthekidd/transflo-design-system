import type { Meta, StoryObj } from '@storybook/angular';
import { InputOtpModule } from 'primeng/inputotp';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/InputOTP',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputOtpModule, FormsModule] },
    props: { value: null },
    template: `<p-inputotp [(ngModel)]="value" />`,
  }),
};

export const WithLength: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputOtpModule, FormsModule] },
    props: { value: null },
    template: `<p-inputotp [(ngModel)]="value" [length]="6" />`,
  }),
};

export const IntegerOnly: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputOtpModule, FormsModule] },
    props: { value: null },
    template: `<p-inputotp [(ngModel)]="value" [integerOnly]="true" [length]="6" />`,
  }),
};

export const Masked: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputOtpModule, FormsModule] },
    props: { value: null },
    template: `<p-inputotp [(ngModel)]="value" [mask]="true" [length]="6" />`,
  }),
};
