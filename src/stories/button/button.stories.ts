import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Button',
  decorators: [
    (story) => ({
      ...story(),
      moduleMetadata: {
        imports: [ButtonModule],
      },
      applicationConfig: {
        providers: [provideAnimationsAsync()],
      },
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Primary Button" />`,
  }),
};

export const Secondary: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Secondary Button" severity="secondary" />`,
  }),
};

export const Success: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Success" severity="success" />`,
  }),
};

export const Warning: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Warning" severity="warn" />`,
  }),
};

export const Danger: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Danger" severity="danger" />`,
  }),
};

export const Info: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Info" severity="info" />`,
  }),
};

export const Outlined: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Outlined" [outlined]="true" />`,
  }),
};

export const Text: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Text Button" [text]="true" />`,
  }),
};

export const Rounded: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Rounded" [rounded]="true" />`,
  }),
};

export const Raised: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Raised" [raised]="true" />`,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Save" icon="pi pi-save" />`,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button icon="pi pi-trash" severity="danger" [rounded]="true" aria-label="Delete" />`,
  }),
};

export const Loading: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Loading..." [loading]="true" />`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `<p-button label="Disabled" [disabled]="true" />`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `
      <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
        <p-button label="Small" size="small" />
        <p-button label="Normal" />
        <p-button label="Large" size="large" />
      </div>
    `,
  }),
};

export const AllSeverities: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonModule] },
    template: `
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <p-button label="Primary" />
        <p-button label="Secondary" severity="secondary" />
        <p-button label="Success" severity="success" />
        <p-button label="Info" severity="info" />
        <p-button label="Warning" severity="warn" />
        <p-button label="Danger" severity="danger" />
        <p-button label="Contrast" severity="contrast" />
      </div>
    `,
  }),
};
