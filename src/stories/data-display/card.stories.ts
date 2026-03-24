import type { Meta, StoryObj } from '@storybook/angular';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Card',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [CardModule] },
    template: `
      <div style="width:360px">
        <p-card header="Card Title" subheader="Card Subtitle">
          <p>This is the card content. You can put any information here that you want to display.</p>
        </p-card>
      </div>
    `,
  }),
};

export const WithFooter: Story = {
  render: () => ({
    moduleMetadata: { imports: [CardModule, ButtonModule] },
    template: `
      <div style="width:360px">
        <p-card header="Featured Article" subheader="By Jane Smith">
          <ng-template #footer>
            <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
              <p-button label="Cancel" severity="secondary" [outlined]="true" />
              <p-button label="Read More" />
            </div>
          </ng-template>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
        </p-card>
      </div>
    `,
  }),
};

export const Simple: Story = {
  render: () => ({
    moduleMetadata: { imports: [CardModule] },
    template: `
      <div style="width:360px">
        <p-card>
          <p>A simple card with no header or footer — just content.</p>
        </p-card>
      </div>
    `,
  }),
};
