import type { Meta, StoryObj } from '@storybook/angular';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Component } from '@angular/core';

@Component({
  selector: 'story-toast-demo',
  standalone: true,
  imports: [ToastModule, ButtonModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
      <p-button label="Success" severity="success" icon="pi pi-check" (onClick)="showSuccess()" />
      <p-button label="Info" severity="info" icon="pi pi-info-circle" (onClick)="showInfo()" />
      <p-button label="Warning" severity="warn" icon="pi pi-exclamation-triangle" (onClick)="showWarn()" />
      <p-button label="Error" severity="danger" icon="pi pi-times" (onClick)="showError()" />
    </div>
  `,
})
class ToastDemoComponent {
  constructor(private msg: MessageService) {}
  showSuccess() { this.msg.add({ severity: 'success', summary: 'Success', detail: 'Operation completed.' }); }
  showInfo() { this.msg.add({ severity: 'info', summary: 'Info', detail: 'Here is some information.' }); }
  showWarn() { this.msg.add({ severity: 'warn', summary: 'Warning', detail: 'Please review this.' }); }
  showError() { this.msg.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }); }
}

const meta: Meta<ToastDemoComponent> = {
  title: 'PrimeNG/Overlay/Toast',
  component: ToastDemoComponent,
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
type Story = StoryObj<ToastDemoComponent>;

export const Default: Story = {};
