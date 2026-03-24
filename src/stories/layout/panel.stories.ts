import type { Meta, StoryObj } from '@storybook/angular';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Layout/Panel',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [PanelModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <div style="width:480px">
        <p-panel header="Panel Title">
          <p>This is the panel content. Panels are great for grouping related information with a visible header.</p>
        </p-panel>
      </div>
    `,
  }),
};

export const Toggleable: Story = {
  render: () => ({
    moduleMetadata: { imports: [PanelModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <div style="width:480px">
        <p-panel header="Collapsible Panel" [toggleable]="true">
          <p>Click the arrow icon to collapse or expand this panel.</p>
        </p-panel>
      </div>
    `,
  }),
};

export const Fieldset: Story = {
  render: () => ({
    moduleMetadata: { imports: [FieldsetModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <div style="width:480px">
        <p-fieldset legend="Personal Information">
          <p>Use fieldsets to group related form elements with a descriptive label in the border.</p>
        </p-fieldset>
      </div>
    `,
  }),
};

export const ToggleableFieldset: Story = {
  render: () => ({
    moduleMetadata: { imports: [FieldsetModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <div style="width:480px">
        <p-fieldset legend="Advanced Options" [toggleable]="true" [collapsed]="true">
          <p>This fieldset starts collapsed. Click the legend to expand it.</p>
        </p-fieldset>
      </div>
    `,
  }),
};

export const Divider: Story = {
  render: () => ({
    moduleMetadata: { imports: [DividerModule] },
    template: `
      <div style="width:480px;">
        <p>Content above the divider.</p>
        <p-divider />
        <p>Content below the divider.</p>
        <p-divider align="center"><span style="color:#6c757d; font-size:0.875rem;">OR</span></p-divider>
        <p>Content after the labeled divider.</p>
      </div>
    `,
  }),
};
