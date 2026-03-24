import type { Meta, StoryObj } from '@storybook/angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Overlay/Dialog',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DialogModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { visible: false },
    template: `
      <p-button label="Open Dialog" (onClick)="visible = true" />
      <p-dialog header="Dialog Title" [(visible)]="visible" [style]="{width:'450px'}">
        <p>This is the dialog content. You can place any information here.</p>
        <ng-template #footer>
          <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="visible = false" />
          <p-button label="Confirm" (onClick)="visible = false" />
        </ng-template>
      </p-dialog>
    `,
  }),
};

export const WithModal: Story = {
  render: () => ({
    moduleMetadata: { imports: [DialogModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { visible: false },
    template: `
      <p-button label="Open Modal" icon="pi pi-external-link" (onClick)="visible = true" />
      <p-dialog
        header="Confirm Action"
        [(visible)]="visible"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        [style]="{width:'400px'}"
      >
        <div style="display:flex; align-items:center; gap:1rem;">
          <i class="pi pi-exclamation-triangle" style="font-size:2rem; color:var(--p-yellow-500)"></i>
          <span>Are you sure you want to proceed? This action cannot be undone.</span>
        </div>
        <ng-template #footer>
          <p-button label="No" severity="secondary" [outlined]="true" (onClick)="visible = false" />
          <p-button label="Yes, confirm" severity="danger" (onClick)="visible = false" />
        </ng-template>
      </p-dialog>
    `,
  }),
};
