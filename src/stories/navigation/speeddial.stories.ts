import type { Meta, StoryObj } from '@storybook/angular';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Navigation/SpeedDial',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const items: MenuItem[] = [
  { icon: 'pi pi-pencil', label: 'Edit' },
  { icon: 'pi pi-share-alt', label: 'Share' },
  { icon: 'pi pi-trash', label: 'Delete' },
];

export const Up: Story = {
  render: () => ({
    moduleMetadata: { imports: [SpeedDialModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { items },
    template: `<div style="position:relative; height:200px; width:200px;"><p-speeddial [model]="items" direction="up" style="position:absolute; bottom:1rem; left:50%; transform:translateX(-50%)" /></div>`,
  }),
};

export const Circle: Story = {
  render: () => ({
    moduleMetadata: { imports: [SpeedDialModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { items },
    template: `<div style="position:relative; height:200px; width:200px;"><p-speeddial [model]="items" type="circle" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%)" /></div>`,
  }),
};

export const SemiCircle: Story = {
  render: () => ({
    moduleMetadata: { imports: [SpeedDialModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { items },
    template: `<div style="position:relative; height:200px; width:200px;"><p-speeddial [model]="items" type="semi-circle" direction="up" style="position:absolute; bottom:1rem; left:50%; transform:translateX(-50%)" /></div>`,
  }),
};
