import type { Meta, StoryObj } from '@storybook/angular';
import { MessageModule } from 'primeng/message';

const meta: Meta = {
  title: 'PrimeNG/Overlay/Messages',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Success: Story = {
  render: () => ({
    moduleMetadata: { imports: [MessageModule] },
    template: `<p-message severity="success" text="Operation completed successfully." />`,
  }),
};

export const Info: Story = {
  render: () => ({
    moduleMetadata: { imports: [MessageModule] },
    template: `<p-message severity="info" text="Here is some useful information." />`,
  }),
};

export const Warning: Story = {
  render: () => ({
    moduleMetadata: { imports: [MessageModule] },
    template: `<p-message severity="warn" text="Please review before continuing." />`,
  }),
};

export const Error: Story = {
  render: () => ({
    moduleMetadata: { imports: [MessageModule] },
    template: `<p-message severity="error" text="Something went wrong. Please try again." />`,
  }),
};

export const AllSeverities: Story = {
  render: () => ({
    moduleMetadata: { imports: [MessageModule] },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.75rem; width:400px;">
        <p-message severity="success" text="Operation completed successfully." />
        <p-message severity="info" text="Here is some useful information." />
        <p-message severity="warn" text="Please review before continuing." />
        <p-message severity="error" text="Something went wrong. Please try again." />
      </div>
    `,
  }),
};
