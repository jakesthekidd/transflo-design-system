import type { Meta, StoryObj } from '@storybook/angular';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Forms/AutoComplete',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const countries = ['Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Belgium','Brazil','Canada','Chile','China','Colombia','Croatia','Czech Republic','Denmark','Egypt','Finland','France','Germany','Greece','Hungary','India','Indonesia','Ireland','Israel','Italy','Japan','Jordan','Kenya','Malaysia','Mexico','Morocco','Netherlands','New Zealand','Nigeria','Norway','Pakistan','Peru','Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia','South Africa','South Korea','Spain','Sweden','Switzerland','Thailand','Turkey','Ukraine','United Kingdom','United States','Vietnam'];

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [AutoCompleteModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      value: null,
      suggestions: [] as string[],
      search: (event: any) => countries.filter(c => c.toLowerCase().startsWith(event.query.toLowerCase())),
    },
    template: `
      <div style="width:300px">
        <p-autocomplete [(ngModel)]="value" [suggestions]="suggestions" (completeMethod)="suggestions = search($event)" placeholder="Search countries..." />
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    moduleMetadata: { imports: [AutoCompleteModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      values: [] as string[],
      suggestions: [] as string[],
      search: (event: any) => countries.filter(c => c.toLowerCase().startsWith(event.query.toLowerCase())),
    },
    template: `
      <div style="width:360px">
        <p-autocomplete [(ngModel)]="values" [suggestions]="suggestions" (completeMethod)="suggestions = search($event)" [multiple]="true" placeholder="Add countries..." />
      </div>
    `,
  }),
};

export const Dropdown: Story = {
  render: () => ({
    moduleMetadata: { imports: [AutoCompleteModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      value: null,
      suggestions: [] as string[],
      search: (event: any) => event.query ? countries.filter(c => c.toLowerCase().startsWith(event.query.toLowerCase())) : countries.slice(0, 10),
    },
    template: `
      <div style="width:300px">
        <p-autocomplete [(ngModel)]="value" [suggestions]="suggestions" (completeMethod)="suggestions = search($event)" [dropdown]="true" placeholder="Select a country" />
      </div>
    `,
  }),
};
