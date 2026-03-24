import type { Meta, StoryObj } from '@storybook/angular';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Component } from '@angular/core';

@Component({
  selector: 'story-confirm-dialog-demo',
  standalone: true,
  imports: [ConfirmDialogModule, ButtonModule],
  providers: [ConfirmationService],
  template: `
    <p-confirmdialog />
    <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
      <p-button label="Delete Record" severity="danger" icon="pi pi-trash" (onClick)="confirmDelete()" />
      <p-button label="Save Changes" icon="pi pi-save" (onClick)="confirmSave()" />
    </div>
  `,
})
class ConfirmDialogDemoComponent {
  constructor(private confirm: ConfirmationService) {}

  confirmDelete() {
    this.confirm.confirm({
      message: 'Are you sure you want to delete this record? This action cannot be undone.',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
    });
  }

  confirmSave() {
    this.confirm.confirm({
      message: 'Do you want to save your changes?',
      header: 'Save Changes',
      icon: 'pi pi-save',
      acceptLabel: 'Save',
      rejectLabel: 'Discard',
    });
  }
}

const meta: Meta<ConfirmDialogDemoComponent> = {
  title: 'PrimeNG/Overlay/ConfirmDialog',
  component: ConfirmDialogDemoComponent,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: { providers: [provideAnimationsAsync()] },
    }),
  ],
};
export default meta;
type Story = StoryObj<ConfirmDialogDemoComponent>;

export const Default: Story = {};
