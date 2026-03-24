import type { Meta, StoryObj } from '@storybook/angular';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Overlay/Popover',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [PopoverModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <p-button label="Show Popover" (onClick)="op.toggle($event)" #btn />
      <p-popover #op>
        <div style="padding:0.5rem 0; width:200px;">
          <p style="margin:0 0 0.5rem; font-weight:600;">Quick Info</p>
          <p style="margin:0; color:#6c757d; font-size:0.875rem;">This popover appears on button click and can contain any content.</p>
        </div>
      </p-popover>
    `,
  }),
};

export const UserCard: Story = {
  render: () => ({
    moduleMetadata: { imports: [PopoverModule, ButtonModule, AvatarModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <p-button label="View Profile" icon="pi pi-user" [outlined]="true" (onClick)="op.toggle($event)" />
      <p-popover #op>
        <div style="padding:0.5rem; width:240px; display:flex; flex-direction:column; gap:0.75rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <p-avatar label="JD" shape="circle" size="large" style="background:#2474BB;color:#fff" />
            <div>
              <div style="font-weight:600;">Jake Cummings</div>
              <div style="color:#6c757d; font-size:0.8rem;">Product Designer</div>
            </div>
          </div>
          <hr style="margin:0; border-color:#e2e6eb;" />
          <div style="font-size:0.875rem; color:#6c757d;">
            <div><i class="pi pi-envelope" style="margin-right:0.5rem"></i>jake@transflo.com</div>
          </div>
        </div>
      </p-popover>
    `,
  }),
};
