import type { Meta, StoryObj } from '@storybook/angular';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Forms/Password',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [PasswordModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { value: '' },
    template: `<div style="width:260px"><p-password [(ngModel)]="value" placeholder="Enter password" /></div>`,
  }),
};

export const WithStrengthMeter: Story = {
  render: () => ({
    moduleMetadata: { imports: [PasswordModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { value: '' },
    template: `<div style="width:260px"><p-password [(ngModel)]="value" [feedback]="true" placeholder="Enter password" /></div>`,
  }),
};

export const NoToggle: Story = {
  render: () => ({
    moduleMetadata: { imports: [PasswordModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { value: '' },
    template: `<div style="width:260px"><p-password [(ngModel)]="value" [toggleMask]="false" [feedback]="false" placeholder="Enter password" /></div>`,
  }),
};
