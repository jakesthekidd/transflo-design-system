import type { Meta, StoryObj } from '@storybook/angular';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/InputMask',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const PhoneNumber: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputMaskModule, FormsModule] },
    props: { value: null },
    template: `<div style="width:220px"><p-inputmask [(ngModel)]="value" mask="(999) 999-9999" placeholder="(555) 555-5555" /></div>`,
  }),
};

export const Date: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputMaskModule, FormsModule] },
    props: { value: null },
    template: `<div style="width:160px"><p-inputmask [(ngModel)]="value" mask="99/99/9999" placeholder="MM/DD/YYYY" /></div>`,
  }),
};

export const SSN: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputMaskModule, FormsModule] },
    props: { value: null },
    template: `<div style="width:160px"><p-inputmask [(ngModel)]="value" mask="999-99-9999" placeholder="999-99-9999" /></div>`,
  }),
};

export const Serial: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputMaskModule, FormsModule] },
    props: { value: null },
    template: `<div style="width:180px"><p-inputmask [(ngModel)]="value" mask="a*-999-a999" placeholder="Serial number" /></div>`,
  }),
};
