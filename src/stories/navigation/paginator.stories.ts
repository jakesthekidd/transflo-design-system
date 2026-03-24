import type { Meta, StoryObj } from '@storybook/angular';
import { PaginatorModule } from 'primeng/paginator';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Navigation/Paginator',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [PaginatorModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { first: 0, rows: 10, totalRecords: 120 },
    template: `
      <p-paginator
        [first]="first"
        [rows]="rows"
        [totalRecords]="totalRecords"
        (onPageChange)="first = $event.first; rows = $event.rows"
      />
    `,
  }),
};

export const WithRowsPerPage: Story = {
  render: () => ({
    moduleMetadata: { imports: [PaginatorModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { first: 0, rows: 10, totalRecords: 200 },
    template: `
      <p-paginator
        [first]="first"
        [rows]="rows"
        [totalRecords]="totalRecords"
        [rowsPerPageOptions]="[5, 10, 25, 50]"
        (onPageChange)="first = $event.first; rows = $event.rows"
      />
    `,
  }),
};
