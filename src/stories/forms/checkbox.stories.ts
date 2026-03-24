import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/Checkbox',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [CheckboxModule, FormsModule] },
    props: { checked: false },
    template: `
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <p-checkbox [(ngModel)]="checked" [binary]="true" inputId="cb1" />
        <label for="cb1">Accept terms</label>
      </div>
    `,
  }),
};

export const Checked: Story = {
  render: () => ({
    moduleMetadata: { imports: [CheckboxModule, FormsModule] },
    props: { checked: true },
    template: `
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <p-checkbox [(ngModel)]="checked" [binary]="true" inputId="cb2" />
        <label for="cb2">Already checked</label>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [CheckboxModule, FormsModule] },
    props: { checked: false },
    template: `
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <p-checkbox [(ngModel)]="checked" [binary]="true" [disabled]="true" inputId="cb3" />
        <label for="cb3">Disabled</label>
      </div>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    moduleMetadata: { imports: [CheckboxModule, FormsModule] },
    props: { selected: ['Angular'] },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <p-checkbox [(ngModel)]="selected" value="Angular" inputId="fw1" />
          <label for="fw1">Angular</label>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <p-checkbox [(ngModel)]="selected" value="React" inputId="fw2" />
          <label for="fw2">React</label>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <p-checkbox [(ngModel)]="selected" value="Vue" inputId="fw3" />
          <label for="fw3">Vue</label>
        </div>
      </div>
    `,
  }),
};
