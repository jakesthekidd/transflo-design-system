import type { Meta, StoryObj } from '@storybook/angular';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Navigation/SplitButton',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const items: MenuItem[] = [
  { label: 'Save as Draft', icon: 'pi pi-file' },
  { label: 'Save & Share', icon: 'pi pi-share-alt' },
  { separator: true },
  { label: 'Discard', icon: 'pi pi-trash' },
];

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [SplitButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { items },
    template: `<p-splitbutton label="Save" icon="pi pi-save" [model]="items" />`,
  }),
};

export const Severities: Story = {
  render: () => ({
    moduleMetadata: { imports: [SplitButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { items },
    template: `
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
        <p-splitbutton label="Primary" [model]="items" />
        <p-splitbutton label="Secondary" severity="secondary" [model]="items" />
        <p-splitbutton label="Success" severity="success" [model]="items" />
        <p-splitbutton label="Danger" severity="danger" [model]="items" />
      </div>
    `,
  }),
};

export const Outlined: Story = {
  render: () => ({
    moduleMetadata: { imports: [SplitButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { items },
    template: `<p-splitbutton label="Actions" [model]="items" [outlined]="true" />`,
  }),
};
