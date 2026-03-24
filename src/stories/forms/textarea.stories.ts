import type { Meta, StoryObj } from '@storybook/angular';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/Textarea',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [TextareaModule, FormsModule] },
    props: { value: '' },
    template: `
      <textarea
        pTextarea
        [(ngModel)]="value"
        rows="4"
        cols="30"
        placeholder="Enter your message..."
      ></textarea>
    `,
  }),
};

export const AutoResize: Story = {
  render: () => ({
    moduleMetadata: { imports: [TextareaModule, FormsModule] },
    props: { value: 'This textarea will grow as you type more content into it.' },
    template: `
      <textarea
        pTextarea
        [(ngModel)]="value"
        [autoResize]="true"
        rows="3"
        cols="30"
      ></textarea>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [TextareaModule, FormsModule] },
    props: { value: 'Cannot edit this.' },
    template: `
      <textarea
        pTextarea
        [(ngModel)]="value"
        [disabled]="true"
        rows="4"
        cols="30"
      ></textarea>
    `,
  }),
};
