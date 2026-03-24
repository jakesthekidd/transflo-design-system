import type { Meta, StoryObj } from '@storybook/angular';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Forms/Select (Dropdown)',
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
];

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { cities, selected: null },
    template: `
      <div style="width:280px">
        <p-select [(ngModel)]="selected" [options]="cities" optionLabel="name" placeholder="Select a City" />
      </div>
    `,
  }),
};

export const WithGrouping: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      selected: null,
      groupedCities: [
        { label: 'Germany', items: [{ label: 'Berlin', value: 'berlin' }, { label: 'Frankfurt', value: 'frankfurt' }] },
        { label: 'USA', items: [{ label: 'New York', value: 'ny' }, { label: 'Los Angeles', value: 'la' }] },
      ],
    },
    template: `
      <div style="width:280px">
        <p-select [(ngModel)]="selected" [options]="groupedCities" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Select a City" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { cities, selected: cities[0] },
    template: `
      <div style="width:280px">
        <p-select [(ngModel)]="selected" [options]="cities" optionLabel="name" [disabled]="true" />
      </div>
    `,
  }),
};

export const Editable: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { cities, selected: null },
    template: `
      <div style="width:280px">
        <p-select [(ngModel)]="selected" [options]="cities" optionLabel="name" [editable]="true" placeholder="Type or select" />
      </div>
    `,
  }),
};
