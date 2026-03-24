import type { Meta, StoryObj } from '@storybook/angular';
import { TagModule } from 'primeng/tag';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Tag',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [TagModule] },
    template: `<p-tag value="New" />`,
  }),
};

export const Severities: Story = {
  render: () => ({
    moduleMetadata: { imports: [TagModule] },
    template: `
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
        <p-tag value="Primary" />
        <p-tag value="Secondary" severity="secondary" />
        <p-tag value="Success" severity="success" />
        <p-tag value="Info" severity="info" />
        <p-tag value="Warning" severity="warn" />
        <p-tag value="Danger" severity="danger" />
        <p-tag value="Contrast" severity="contrast" />
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    moduleMetadata: { imports: [TagModule] },
    template: `
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
        <p-tag value="Confirmed" severity="success" icon="pi pi-check" />
        <p-tag value="Pending" severity="warn" icon="pi pi-clock" />
        <p-tag value="Rejected" severity="danger" icon="pi pi-times" />
      </div>
    `,
  }),
};

export const Rounded: Story = {
  render: () => ({
    moduleMetadata: { imports: [TagModule] },
    template: `
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
        <p-tag value="Rounded" [rounded]="true" />
        <p-tag value="Success" severity="success" [rounded]="true" />
        <p-tag value="Info" severity="info" [rounded]="true" />
      </div>
    `,
  }),
};
