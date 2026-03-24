import type { Meta, StoryObj } from '@storybook/angular';
import { SkeletonModule } from 'primeng/skeleton';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Skeleton',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Text: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkeletonModule] },
    template: `
      <div style="width:300px; display:flex; flex-direction:column; gap:0.5rem;">
        <p-skeleton />
        <p-skeleton width="80%" />
        <p-skeleton width="60%" />
      </div>
    `,
  }),
};

export const Card: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkeletonModule] },
    template: `
      <div style="width:300px; padding:1rem; border:1px solid #e2e6eb; border-radius:8px; display:flex; flex-direction:column; gap:1rem;">
        <p-skeleton height="160px" borderRadius="8px" />
        <p-skeleton height="1.2rem" />
        <p-skeleton height="1rem" width="80%" />
        <p-skeleton height="1rem" width="60%" />
        <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
          <p-skeleton height="2.5rem" width="5rem" borderRadius="6px" />
          <p-skeleton height="2.5rem" width="5rem" borderRadius="6px" />
        </div>
      </div>
    `,
  }),
};

export const ListRows: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkeletonModule] },
    template: `
      <div style="width:360px; display:flex; flex-direction:column; gap:1rem;">
        <div *ngFor="let i of [1,2,3,4]" style="display:flex; align-items:center; gap:1rem;">
          <p-skeleton shape="circle" size="3rem" />
          <div style="flex:1; display:flex; flex-direction:column; gap:0.4rem;">
            <p-skeleton height="1rem" />
            <p-skeleton height="0.8rem" width="70%" />
          </div>
        </div>
      </div>
    `,
  }),
};
