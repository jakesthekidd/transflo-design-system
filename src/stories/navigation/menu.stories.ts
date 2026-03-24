import type { Meta, StoryObj } from '@storybook/angular';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Navigation/Menu',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Inline: Story = {
  render: () => ({
    moduleMetadata: { imports: [MenuModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      items: [
        { label: 'Profile', icon: 'pi pi-user' },
        { label: 'Settings', icon: 'pi pi-cog' },
        { separator: true },
        { label: 'Sign Out', icon: 'pi pi-sign-out' },
      ] as MenuItem[],
    },
    template: `<p-menu [model]="items" />`,
  }),
};

export const Popup: Story = {
  render: () => ({
    moduleMetadata: { imports: [MenuModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      items: [
        { label: 'New', icon: 'pi pi-plus' },
        { label: 'Edit', icon: 'pi pi-pencil' },
        { label: 'Duplicate', icon: 'pi pi-copy' },
        { separator: true },
        { label: 'Delete', icon: 'pi pi-trash' },
      ] as MenuItem[],
    },
    template: `
      <p-button label="Actions" icon="pi pi-ellipsis-v" (onClick)="menu.toggle($event)" />
      <p-menu #menu [model]="items" [popup]="true" />
    `,
  }),
};

export const WithGroups: Story = {
  render: () => ({
    moduleMetadata: { imports: [MenuModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      items: [
        {
          label: 'Documents',
          items: [
            { label: 'New', icon: 'pi pi-plus' },
            { label: 'Open', icon: 'pi pi-folder-open' },
          ],
        },
        {
          label: 'Account',
          items: [
            { label: 'Profile', icon: 'pi pi-user' },
            { label: 'Settings', icon: 'pi pi-cog' },
            { label: 'Sign Out', icon: 'pi pi-sign-out' },
          ],
        },
      ] as MenuItem[],
    },
    template: `<p-menu [model]="items" />`,
  }),
};
