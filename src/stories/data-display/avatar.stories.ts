import type { Meta, StoryObj } from '@storybook/angular';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Avatar',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const LabelAvatar: Story = {
  render: () => ({
    moduleMetadata: { imports: [AvatarModule] },
    template: `
      <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
        <p-avatar label="JD" />
        <p-avatar label="AB" styleClass="mr-2" style="background-color: #ece9fc; color: #2a1261" />
        <p-avatar label="P" shape="circle" />
      </div>
    `,
  }),
};

export const IconAvatar: Story = {
  render: () => ({
    moduleMetadata: { imports: [AvatarModule] },
    template: `
      <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
        <p-avatar icon="pi pi-user" />
        <p-avatar icon="pi pi-user" shape="circle" />
        <p-avatar icon="pi pi-user" size="large" shape="circle" />
        <p-avatar icon="pi pi-user" size="xlarge" shape="circle" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [AvatarModule] },
    template: `
      <div style="display:flex; gap:1rem; align-items:center;">
        <p-avatar label="S" />
        <p-avatar label="L" size="large" />
        <p-avatar label="XL" size="xlarge" />
      </div>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    moduleMetadata: { imports: [AvatarModule, AvatarGroupModule] },
    template: `
      <p-avatargroup>
        <p-avatar label="JD" shape="circle" />
        <p-avatar label="AB" shape="circle" style="background-color:#9c27b0;color:#fff" />
        <p-avatar label="MK" shape="circle" style="background-color:#2196f3;color:#fff" />
        <p-avatar label="+3" shape="circle" style="background-color:#1976d2;color:#fff" />
      </p-avatargroup>
    `,
  }),
};
