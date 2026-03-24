import type { Meta, StoryObj } from '@storybook/angular';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Overlay/Tooltip',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [TooltipModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <p-button label="Hover me" pTooltip="This is a tooltip" tooltipPosition="top" />
    `,
  }),
};

export const Positions: Story = {
  render: () => ({
    moduleMetadata: { imports: [TooltipModule, ButtonModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <div style="display:flex; gap:1rem; flex-wrap:wrap; padding:3rem;">
        <p-button label="Top" pTooltip="Top tooltip" tooltipPosition="top" />
        <p-button label="Bottom" pTooltip="Bottom tooltip" tooltipPosition="bottom" />
        <p-button label="Left" pTooltip="Left tooltip" tooltipPosition="left" />
        <p-button label="Right" pTooltip="Right tooltip" tooltipPosition="right" />
      </div>
    `,
  }),
};
