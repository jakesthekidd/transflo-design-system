import type { Meta, StoryObj } from '@storybook/angular';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/ToggleSwitch',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleSwitchModule, FormsModule] },
    props: { checked: false },
    template: `<p-toggleswitch [(ngModel)]="checked" />`,
  }),
};

export const Checked: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleSwitchModule, FormsModule] },
    props: { checked: true },
    template: `<p-toggleswitch [(ngModel)]="checked" />`,
  }),
};

export const WithLabel: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleSwitchModule, FormsModule] },
    props: { checked: true },
    template: `
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <p-toggleswitch [(ngModel)]="checked" inputId="darkmode" />
        <label for="darkmode" style="cursor:pointer;">Enable dark mode</label>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleSwitchModule, FormsModule] },
    props: { checked: true },
    template: `<p-toggleswitch [(ngModel)]="checked" [disabled]="true" />`,
  }),
};
