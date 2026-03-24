import type { Meta, StoryObj } from '@storybook/angular';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Navigation/Toolbar',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToolbarModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <p-toolbar>
        <ng-template #start>
          <p-button icon="pi pi-plus" label="New" class="mr-2" />
          <p-button icon="pi pi-upload" label="Upload" severity="secondary" [outlined]="true" />
        </ng-template>
        <ng-template #end>
          <p-button icon="pi pi-search" severity="secondary" [outlined]="true" class="mr-2" />
          <p-button icon="pi pi-cog" severity="secondary" [outlined]="true" />
        </ng-template>
      </p-toolbar>
    `,
  }),
};

export const TableToolbar: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToolbarModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <p-toolbar>
        <ng-template #start>
          <p-button icon="pi pi-plus" label="New" />
          <p-button icon="pi pi-pencil" label="Edit" severity="secondary" [outlined]="true" style="margin-left:0.5rem" />
          <p-button icon="pi pi-trash" label="Delete" severity="danger" [outlined]="true" style="margin-left:0.5rem" />
        </ng-template>
        <ng-template #end>
          <p-button icon="pi pi-download" label="Export" severity="secondary" [outlined]="true" />
        </ng-template>
      </p-toolbar>
    `,
  }),
};
