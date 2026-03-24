import type { Meta, StoryObj } from '@storybook/angular';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/Listbox',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const cities = [
  { name: 'New York', code: 'NY' },
  { name: 'Los Angeles', code: 'LA' },
  { name: 'Chicago', code: 'CH' },
  { name: 'Houston', code: 'HO' },
  { name: 'Phoenix', code: 'PH' },
];

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListboxModule, FormsModule] },
    props: { selected: null, cities },
    template: `<div style="width:220px"><p-listbox [(ngModel)]="selected" [options]="cities" optionLabel="name" /></div>`,
  }),
};

export const Multiple: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListboxModule, FormsModule] },
    props: { selected: [], cities },
    template: `<div style="width:220px"><p-listbox [(ngModel)]="selected" [options]="cities" optionLabel="name" [multiple]="true" /></div>`,
  }),
};

export const WithFilter: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListboxModule, FormsModule] },
    props: { selected: null, cities },
    template: `<div style="width:220px"><p-listbox [(ngModel)]="selected" [options]="cities" optionLabel="name" [filter]="true" filterPlaceholder="Search..." /></div>`,
  }),
};

export const WithCheckbox: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListboxModule, FormsModule] },
    props: { selected: [], cities },
    template: `<div style="width:220px"><p-listbox [(ngModel)]="selected" [options]="cities" optionLabel="name" [multiple]="true" [checkbox]="true" /></div>`,
  }),
};
