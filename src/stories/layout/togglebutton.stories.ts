import type { Meta, StoryObj } from '@storybook/angular';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Layout/ToggleButton',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleButtonModule, FormsModule] },
    props: { checked: false },
    template: `<p-togglebutton [(ngModel)]="checked" onLabel="Active" offLabel="Inactive" />`,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleButtonModule, FormsModule] },
    props: { checked: true },
    template: `<p-togglebutton [(ngModel)]="checked" onLabel="Enabled" offLabel="Disabled" onIcon="pi pi-check" offIcon="pi pi-times" />`,
  }),
};

export const Group: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleButtonModule, FormsModule] },
    props: { bold: false, italic: false, underline: true },
    template: `
      <div style="display:flex; gap:0.5rem;">
        <div style="width:3rem"><p-togglebutton [(ngModel)]="bold" onIcon="pi pi-bold" offIcon="pi pi-bold" onLabel="" offLabel="" /></div>
        <div style="width:3rem"><p-togglebutton [(ngModel)]="italic" onIcon="pi pi-italic" offIcon="pi pi-italic" onLabel="" offLabel="" /></div>
        <div style="width:3rem"><p-togglebutton [(ngModel)]="underline" onIcon="pi pi-underline" offIcon="pi pi-underline" onLabel="" offLabel="" /></div>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleButtonModule, FormsModule] },
    props: { checked: true },
    template: `<p-togglebutton [(ngModel)]="checked" onLabel="Active" offLabel="Inactive" [disabled]="true" />`,
  }),
};
