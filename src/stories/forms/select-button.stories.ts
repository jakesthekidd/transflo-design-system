import type { Meta, StoryObj } from '@storybook/angular';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/SelectButton',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectButtonModule, FormsModule] },
    props: {
      value: 'Monthly',
      options: ['Monthly', 'Yearly'],
    },
    template: `<p-selectbutton [(ngModel)]="value" [options]="options" />`,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectButtonModule, FormsModule] },
    props: {
      value: 'list',
      options: [
        { label: 'List', value: 'list', icon: 'pi pi-list' },
        { label: 'Grid', value: 'grid', icon: 'pi pi-th-large' },
      ],
    },
    template: `<p-selectbutton [(ngModel)]="value" [options]="options" optionLabel="label" optionValue="value" />`,
  }),
};

export const Multiple: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectButtonModule, FormsModule] },
    props: {
      values: ['Bold'],
      options: [
        { label: 'Bold', value: 'Bold', icon: 'pi pi-bold' },
        { label: 'Italic', value: 'Italic', icon: 'pi pi-italic' },
        { label: 'Underline', value: 'Underline', icon: 'pi pi-underline' },
      ],
    },
    template: `<p-selectbutton [(ngModel)]="values" [options]="options" optionLabel="label" optionValue="value" [multiple]="true" />`,
  }),
};
