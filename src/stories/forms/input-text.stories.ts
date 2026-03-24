import type { Meta, StoryObj } from '@storybook/angular';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';

const meta: Meta = {
  title: 'PrimeNG/Forms/InputText',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputTextModule] },
    template: `<input pInputText type="text" placeholder="Enter text..." style="width:280px" />`,
  }),
};

export const WithFloatLabel: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputTextModule, FloatLabelModule] },
    template: `
      <p-floatlabel style="width:280px">
        <input pInputText id="username" type="text" />
        <label for="username">Username</label>
      </p-floatlabel>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputTextModule] },
    template: `<input pInputText type="text" value="Disabled value" [disabled]="true" style="width:280px" />`,
  }),
};

export const Invalid: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputTextModule] },
    template: `<input pInputText type="text" placeholder="Invalid input" class="ng-invalid ng-dirty" style="width:280px" />`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputTextModule] },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <input pInputText type="text" placeholder="Small" size="small" style="width:280px" />
        <input pInputText type="text" placeholder="Normal" style="width:280px" />
        <input pInputText type="text" placeholder="Large" size="large" style="width:280px" />
      </div>
    `,
  }),
};
