import type { Meta, StoryObj } from '@storybook/angular';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Forms/DatePicker',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DatePickerModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { date: null },
    template: `<div style="width:220px"><p-datepicker [(ngModel)]="date" placeholder="Select a date" /></div>`,
  }),
};

export const WithTime: Story = {
  render: () => ({
    moduleMetadata: { imports: [DatePickerModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { date: null },
    template: `<div style="width:250px"><p-datepicker [(ngModel)]="date" [showTime]="true" [hourFormat]="'12'" placeholder="Select date & time" /></div>`,
  }),
};

export const DateRange: Story = {
  render: () => ({
    moduleMetadata: { imports: [DatePickerModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { dates: null },
    template: `<div style="width:250px"><p-datepicker [(ngModel)]="dates" selectionMode="range" placeholder="Select a range" /></div>`,
  }),
};

export const Inline: Story = {
  render: () => ({
    moduleMetadata: { imports: [DatePickerModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { date: new Date() },
    template: `<p-datepicker [(ngModel)]="date" [inline]="true" />`,
  }),
};

export const MonthPicker: Story = {
  render: () => ({
    moduleMetadata: { imports: [DatePickerModule, FormsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { date: null },
    template: `<div style="width:220px"><p-datepicker [(ngModel)]="date" view="month" dateFormat="mm/yy" placeholder="Select a month" /></div>`,
  }),
};
