import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Badge',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Standalone: Story = {
  render: () => ({
    moduleMetadata: { imports: [BadgeModule] },
    template: `
      <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
        <p-badge value="2" />
        <p-badge value="8" severity="secondary" />
        <p-badge value="3" severity="success" />
        <p-badge value="5" severity="info" />
        <p-badge value="!" severity="warn" />
        <p-badge value="4" severity="danger" />
      </div>
    `,
  }),
};

export const OnButton: Story = {
  render: () => ({
    moduleMetadata: { imports: [BadgeModule, ButtonModule] },
    template: `
      <div style="display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap;">
        <p-button label="Messages" icon="pi pi-envelope" [badge]="'5'" />
        <p-button label="Notifications" icon="pi pi-bell" [badge]="'12'" severity="warn" />
        <p-button icon="pi pi-shopping-cart" [rounded]="true" [badge]="'3'" severity="success" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [BadgeModule] },
    template: `
      <div style="display:flex; gap:1.5rem; align-items:center;">
        <p-badge value="2" size="small" />
        <p-badge value="4" />
        <p-badge value="6" size="large" />
        <p-badge value="8" size="xlarge" />
      </div>
    `,
  }),
};

export const DotIndicator: Story = {
  render: () => ({
    moduleMetadata: { imports: [BadgeModule] },
    template: `
      <div style="display:flex; gap:1.5rem; align-items:center;">
        <p-badge severity="success" />
        <p-badge severity="warn" />
        <p-badge severity="danger" />
      </div>
    `,
  }),
};
