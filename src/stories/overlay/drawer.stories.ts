import type { Meta, StoryObj } from '@storybook/angular';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Overlay/Drawer',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Right: Story = {
  render: () => ({
    moduleMetadata: { imports: [DrawerModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { visible: false },
    template: `
      <p-button label="Open Drawer" icon="pi pi-arrow-right" (onClick)="visible = true" />
      <p-drawer [(visible)]="visible" header="Right Drawer" position="right">
        <p>This is the drawer content. You can add any navigation links, forms, or details here.</p>
      </p-drawer>
    `,
  }),
};

export const Left: Story = {
  render: () => ({
    moduleMetadata: { imports: [DrawerModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { visible: false },
    template: `
      <p-button label="Open Left Drawer" icon="pi pi-arrow-left" (onClick)="visible = true" />
      <p-drawer [(visible)]="visible" header="Navigation" position="left">
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <p-button label="Dashboard" icon="pi pi-home" [text]="true" style="justify-content:flex-start" />
          <p-button label="Users" icon="pi pi-users" [text]="true" style="justify-content:flex-start" />
          <p-button label="Reports" icon="pi pi-chart-bar" [text]="true" style="justify-content:flex-start" />
          <p-button label="Settings" icon="pi pi-cog" [text]="true" style="justify-content:flex-start" />
        </div>
      </p-drawer>
    `,
  }),
};

export const Bottom: Story = {
  render: () => ({
    moduleMetadata: { imports: [DrawerModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { visible: false },
    template: `
      <p-button label="Open Bottom Drawer" icon="pi pi-arrow-down" (onClick)="visible = true" />
      <p-drawer [(visible)]="visible" header="Filter Options" position="bottom">
        <p>Bottom drawer is great for filter panels or mobile-style sheets.</p>
      </p-drawer>
    `,
  }),
};
