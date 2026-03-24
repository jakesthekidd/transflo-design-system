import type { Meta, StoryObj } from '@storybook/angular';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/Rating',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [RatingModule, FormsModule] },
    props: { value: 3 },
    template: `<p-rating [(ngModel)]="value" />`,
  }),
};

export const WithCancel: Story = {
  render: () => ({
    moduleMetadata: { imports: [RatingModule, FormsModule] },
    props: { value: 4 },
    template: `<p-rating [(ngModel)]="value" [cancel]="true" />`,
  }),
};

export const ReadOnly: Story = {
  render: () => ({
    moduleMetadata: { imports: [RatingModule, FormsModule] },
    props: { value: 4 },
    template: `<p-rating [(ngModel)]="value" [readonly]="true" />`,
  }),
};

export const TenStars: Story = {
  render: () => ({
    moduleMetadata: { imports: [RatingModule, FormsModule] },
    props: { value: 7 },
    template: `<p-rating [(ngModel)]="value" [stars]="10" />`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [RatingModule, FormsModule] },
    props: { value: 2 },
    template: `<p-rating [(ngModel)]="value" [disabled]="true" />`,
  }),
};
