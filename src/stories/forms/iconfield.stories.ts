import type { Meta, StoryObj } from '@storybook/angular';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/IconField',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const LeadingIcon: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconFieldModule, InputIconModule, InputTextModule, FormsModule] },
    template: `
      <p-iconfield style="width:280px">
        <p-inputicon styleClass="pi pi-search" />
        <input pInputText type="text" placeholder="Search..." />
      </p-iconfield>
    `,
  }),
};

export const TrailingIcon: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconFieldModule, InputIconModule, InputTextModule, FormsModule] },
    template: `
      <p-iconfield iconPosition="right" style="width:280px">
        <p-inputicon styleClass="pi pi-envelope" />
        <input pInputText type="email" placeholder="Email address" />
      </p-iconfield>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconFieldModule, InputIconModule, InputTextModule, FormsModule] },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <p-iconfield style="width:280px">
          <p-inputicon styleClass="pi pi-user" />
          <input pInputText placeholder="Username" />
        </p-iconfield>
        <p-iconfield style="width:280px">
          <p-inputicon styleClass="pi pi-lock" />
          <input pInputText type="password" placeholder="Password" />
        </p-iconfield>
        <p-iconfield iconPosition="right" style="width:280px">
          <p-inputicon styleClass="pi pi-calendar" />
          <input pInputText placeholder="Select date" />
        </p-iconfield>
      </div>
    `,
  }),
};
