import type { Meta, StoryObj } from '@storybook/angular';
import { ChipModule } from 'primeng/chip';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Chip',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ChipModule] },
    template: `<p-chip label="Angular" />`,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    moduleMetadata: { imports: [ChipModule] },
    template: `
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <p-chip label="Angular" icon="pi pi-bolt" />
        <p-chip label="Verified" icon="pi pi-check-circle" />
        <p-chip label="Premium" icon="pi pi-star" />
      </div>
    `,
  }),
};

export const Removable: Story = {
  render: () => ({
    moduleMetadata: { imports: [ChipModule] },
    template: `
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <p-chip label="Design" [removable]="true" />
        <p-chip label="Development" [removable]="true" />
        <p-chip label="Testing" [removable]="true" />
      </div>
    `,
  }),
};

export const Tags: Story = {
  render: () => ({
    moduleMetadata: { imports: [ChipModule] },
    template: `
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <p-chip label="TypeScript" />
        <p-chip label="Angular" />
        <p-chip label="PrimeNG" />
        <p-chip label="Storybook" />
        <p-chip label="Figma" />
      </div>
    `,
  }),
};
