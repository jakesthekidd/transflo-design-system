import type { Meta, StoryObj } from '@storybook/angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Forms/MultiSelect',
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
  { name: 'Philadelphia', code: 'PL' },
];

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [MultiSelectModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { selected: null, cities },
    template: `
      <div style="width:300px">
        <p-multiselect [(ngModel)]="selected" [options]="cities" optionLabel="name" placeholder="Select Cities" />
      </div>
    `,
  }),
};

export const WithFilter: Story = {
  render: () => ({
    moduleMetadata: { imports: [MultiSelectModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { selected: null, cities },
    template: `
      <div style="width:300px">
        <p-multiselect [(ngModel)]="selected" [options]="cities" optionLabel="name" [filter]="true" filterPlaceholder="Search cities..." placeholder="Select Cities" />
      </div>
    `,
  }),
};

export const WithChips: Story = {
  render: () => ({
    moduleMetadata: { imports: [MultiSelectModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { selected: [cities[0], cities[1]], cities },
    template: `
      <div style="width:300px">
        <p-multiselect [(ngModel)]="selected" [options]="cities" optionLabel="name" display="chip" placeholder="Select Cities" />
      </div>
    `,
  }),
};
