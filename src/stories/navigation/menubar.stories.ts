import type { Meta, StoryObj } from '@storybook/angular';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Navigation/Menubar',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [MenubarModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      items: [
        {
          label: 'Home',
          icon: 'pi pi-home',
        },
        {
          label: 'Products',
          icon: 'pi pi-box',
          items: [
            { label: 'All Products', icon: 'pi pi-list' },
            { label: 'Add New', icon: 'pi pi-plus' },
            { separator: true },
            { label: 'Categories', icon: 'pi pi-tags' },
          ],
        },
        {
          label: 'Reports',
          icon: 'pi pi-chart-bar',
          items: [
            { label: 'Sales', icon: 'pi pi-dollar' },
            { label: 'Analytics', icon: 'pi pi-chart-line' },
          ],
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
        },
      ] as MenuItem[],
    },
    template: `<p-menubar [model]="items" />`,
  }),
};

export const WithBadges: Story = {
  render: () => ({
    moduleMetadata: { imports: [MenubarModule, BadgeModule, AvatarModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      items: [
        { label: 'Dashboard', icon: 'pi pi-home' },
        { label: 'Inbox', icon: 'pi pi-envelope', badge: '4' },
        { label: 'Alerts', icon: 'pi pi-bell', badge: '12' },
      ] as MenuItem[],
    },
    template: `<p-menubar [model]="items" />`,
  }),
};
