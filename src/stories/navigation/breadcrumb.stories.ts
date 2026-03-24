import type { Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

const meta: Meta = {
  title: 'PrimeNG/Navigation/Breadcrumb',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [BreadcrumbModule] },
    props: {
      items: [
        { label: 'Home', icon: 'pi pi-home' },
        { label: 'Products' },
        { label: 'Electronics' },
        { label: 'Laptops' },
      ] as MenuItem[],
      home: { icon: 'pi pi-home' } as MenuItem,
    },
    template: `<p-breadcrumb [model]="items" />`,
  }),
};

export const WithHome: Story = {
  render: () => ({
    moduleMetadata: { imports: [BreadcrumbModule] },
    props: {
      items: [
        { label: 'Library' },
        { label: 'Books' },
        { label: 'Science Fiction' },
      ] as MenuItem[],
      home: { icon: 'pi pi-home', label: 'Home' } as MenuItem,
    },
    template: `<p-breadcrumb [model]="items" [home]="home" />`,
  }),
};
