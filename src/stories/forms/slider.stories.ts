import type { Meta, StoryObj } from '@storybook/angular';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/Slider',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [SliderModule, FormsModule] },
    props: { value: 40 },
    template: `<div style="width:300px"><p-slider [(ngModel)]="value" /></div>`,
  }),
};

export const Range: Story = {
  render: () => ({
    moduleMetadata: { imports: [SliderModule, FormsModule] },
    props: { values: [20, 80] },
    template: `<div style="width:300px"><p-slider [(ngModel)]="values" [range]="true" /></div>`,
  }),
};

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: [SliderModule, FormsModule] },
    props: { value: 60 },
    template: `<div style="height:200px; width:40px; display:flex; justify-content:center;"><p-slider [(ngModel)]="value" orientation="vertical" /></div>`,
  }),
};

export const Stepped: Story = {
  render: () => ({
    moduleMetadata: { imports: [SliderModule, FormsModule] },
    props: { value: 25 },
    template: `<div style="width:300px"><p-slider [(ngModel)]="value" [step]="25" /></div>`,
  }),
};
