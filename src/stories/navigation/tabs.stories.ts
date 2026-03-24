import type { Meta, StoryObj } from '@storybook/angular';
import { TabsModule } from 'primeng/tabs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Navigation/Tabs',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [TabsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">Dashboard</p-tab>
          <p-tab value="1">Profile</p-tab>
          <p-tab value="2">Settings</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <p>Dashboard content goes here.</p>
          </p-tabpanel>
          <p-tabpanel value="1">
            <p>Profile content goes here.</p>
          </p-tabpanel>
          <p-tabpanel value="2">
            <p>Settings content goes here.</p>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    moduleMetadata: { imports: [TabsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0"><i class="pi pi-home" style="margin-right:.5rem"></i>Home</p-tab>
          <p-tab value="1"><i class="pi pi-user" style="margin-right:.5rem"></i>Profile</p-tab>
          <p-tab value="2"><i class="pi pi-cog" style="margin-right:.5rem"></i>Settings</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0"><p>Home panel content.</p></p-tabpanel>
          <p-tabpanel value="1"><p>Profile panel content.</p></p-tabpanel>
          <p-tabpanel value="2"><p>Settings panel content.</p></p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    `,
  }),
};
