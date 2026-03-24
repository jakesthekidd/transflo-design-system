import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';

const meta: Meta = {
  title: 'PrimeNG/Forms/ButtonGroup',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonGroupModule, ButtonModule] },
    template: `
      <p-buttongroup>
        <p-button label="Save" icon="pi pi-save" />
        <p-button label="Delete" icon="pi pi-trash" severity="danger" />
        <p-button label="Cancel" icon="pi pi-times" severity="secondary" />
      </p-buttongroup>
    `,
  }),
};

export const OutlinedGroup: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonGroupModule, ButtonModule] },
    template: `
      <p-buttongroup>
        <p-button label="Left" [outlined]="true" />
        <p-button label="Center" [outlined]="true" />
        <p-button label="Right" [outlined]="true" />
      </p-buttongroup>
    `,
  }),
};

export const IconGroup: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonGroupModule, ButtonModule] },
    template: `
      <p-buttongroup>
        <p-button icon="pi pi-align-left" [outlined]="true" />
        <p-button icon="pi pi-align-center" [outlined]="true" />
        <p-button icon="pi pi-align-right" [outlined]="true" />
        <p-button icon="pi pi-align-justify" [outlined]="true" />
      </p-buttongroup>
    `,
  }),
};
