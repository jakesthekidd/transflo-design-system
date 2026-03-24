import type { Meta, StoryObj } from '@storybook/angular';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'PrimeNG/Forms/RadioButton',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [RadioButtonModule, FormsModule] },
    props: { selected: 'Option 1' },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <p-radiobutton [(ngModel)]="selected" value="Option 1" inputId="r1" />
          <label for="r1">Option 1</label>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <p-radiobutton [(ngModel)]="selected" value="Option 2" inputId="r2" />
          <label for="r2">Option 2</label>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <p-radiobutton [(ngModel)]="selected" value="Option 3" inputId="r3" />
          <label for="r3">Option 3</label>
        </div>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [RadioButtonModule, FormsModule] },
    props: { selected: 'A' },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <p-radiobutton [(ngModel)]="selected" value="A" inputId="rd1" [disabled]="true" />
          <label for="rd1">Selected & Disabled</label>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <p-radiobutton [(ngModel)]="selected" value="B" inputId="rd2" [disabled]="true" />
          <label for="rd2">Unselected & Disabled</label>
        </div>
      </div>
    `,
  }),
};
