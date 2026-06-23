import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

// ─── Command Center Select Component ──────────────────────────────────────────
@Component({
  selector: 'cc-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  template: `
    <div class="cc-field">
      <label class="cc-label" [class.cc-label--error]="state === 'error'">
        {{ label }}<span *ngIf="state === 'error'" class="cc-required"> *</span>
      </label>
      <div
        class="cc-select-wrapper"
        [ngClass]="'cc-select-wrapper--' + state"
      >
        <p-select
          class="cc-select"
          [options]="options"
          [(ngModel)]="selectedValue"
          [placeholder]="placeholder"
          [disabled]="state === 'disabled'"
          appendTo="body"
        ></p-select>
      </div>
    </div>
  `,
  styles: [`
    .cc-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 280px;
    }

    .cc-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--c-surface-900);
      padding-left: 4px;
    }

    .cc-label--error {
      color: var(--c-surface-900);
    }

    .cc-required {
      color: var(--c-red-500);
      margin-left: 2px;
    }

    .cc-select-wrapper {
      border-radius: 20px;
      border: 1.5px solid var(--c-blue-700);
      background: var(--c-surface-0);
      overflow: hidden;
      transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
    }

    .cc-select-wrapper--default {
      border-color: var(--c-blue-700);
      background: var(--c-surface-0);
    }

    .cc-select-wrapper--hover {
      border-color: var(--c-blue-700);
      background: var(--c-surface-0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    .cc-select-wrapper--focus {
      border-color: var(--c-blue-700);
      border-width: 2px;
      background: var(--c-surface-0);
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.2);
    }

    .cc-select-wrapper--active {
      border-color: var(--c-blue-700);
      border-width: 2px;
      background: var(--c-surface-0);
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.2);
    }

    .cc-select-wrapper--error {
      border-color: var(--c-red-500);
      background: var(--c-surface-0);
    }

    .cc-select-wrapper--disabled {
      border-color: var(--c-surface-500);
      background: var(--c-surface-100);
      opacity: 0.55;
      pointer-events: none;
    }

    /* ── PrimeNG p-select overrides ── */
    :host ::ng-deep .cc-select {
      width: 100%;
      display: block;
    }

    :host ::ng-deep .cc-select .p-select {
      width: 100%;
      border: none !important;
      background: transparent !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    :host ::ng-deep .cc-select .p-select:not(.p-disabled):hover {
      border: none !important;
      box-shadow: none !important;
    }

    :host ::ng-deep .cc-select .p-select:not(.p-disabled).p-focus {
      border: none !important;
      box-shadow: none !important;
    }

    :host ::ng-deep .cc-select .p-select-label {
      padding: 9px 4px 9px 14px !important;
      font-size: 14px !important;
      color: var(--c-bluegray-900) !important;
    }

    :host ::ng-deep .cc-select .p-select-label.p-placeholder {
      color: var(--c-surface-600) !important;
    }

    :host ::ng-deep .cc-select .p-select-dropdown {
      color: var(--c-blue-700) !important;
      padding-right: 12px;
    }
  `]
})
class CcSelectComponent {
  @Input() label = 'Title';
  @Input() placeholder = 'Select option';
  @Input() state: 'default' | 'hover' | 'focus' | 'active' | 'error' | 'disabled' = 'default';

  selectedValue: string | null = null;

  options = [
    { label: 'Option One', value: 'one' },
    { label: 'Option Two', value: 'two' },
    { label: 'Option Three', value: 'three' },
    { label: 'Option Four', value: 'four' },
  ];
}

// ─── Story Meta ───────────────────────────────────────────────────────────────
const meta: Meta<CcSelectComponent> = {
  title: 'Command Center/Select',
  component: CcSelectComponent,
  decorators: [
    moduleMetadata({
      imports: [CcSelectComponent],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Command Center styled dropdown select. Pill-shaped with light blue background. Matches the Command Center input visual language.',
      },
    },
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'light-gray', value: 'var(--c-surface-200)' },
        { name: 'white', value: 'var(--c-surface-0)' },
      ],
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Field label' },
    placeholder: { control: 'text', description: 'Placeholder text' },
    state: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'active', 'error', 'disabled'],
      description: 'Visual state of the select',
    },
  },
};

export default meta;
type Story = StoryObj<CcSelectComponent>;

// ─── Individual Stories ───────────────────────────────────────────────────────

export const Default: Story = {
  args: { label: 'Title', placeholder: 'Select option', state: 'default' },
};

export const Hover: Story = {
  args: { label: 'Title', placeholder: 'Select option', state: 'hover' },
};

export const Focus: Story = {
  args: { label: 'Title', placeholder: 'Select option', state: 'focus' },
};

export const Active: Story = {
  args: { label: 'Title', placeholder: 'Select option', state: 'active' },
};

export const Error: Story = {
  args: { label: 'Title', placeholder: 'Select option', state: 'error' },
};

export const Disabled: Story = {
  args: { label: 'Title', placeholder: 'Select option', state: 'disabled' },
};

export const WithValue: Story = {
  name: 'With Selected Value',
  args: { label: 'Title', state: 'default' },
  render: (args) => ({
    props: {
      ...args,
      selectedValue: 'one',
    },
    template: `<cc-select label="Title" state="default"></cc-select>`,
    moduleMetadata: { imports: [CcSelectComponent] },
  }),
};

// ─── All States Together ──────────────────────────────────────────────────────
export const AllStates: Story = {
  name: 'All States',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; padding:24px;">
        <cc-select label="Title" placeholder="Select option" state="default"></cc-select>
        <cc-select label="Title" placeholder="Select option" state="hover"></cc-select>
        <cc-select label="Title" placeholder="Select option" state="focus"></cc-select>
        <cc-select label="Title" placeholder="Select option" state="active"></cc-select>
        <cc-select label="Title" placeholder="Select option" state="error"></cc-select>
        <cc-select label="Title" placeholder="Select option" state="disabled"></cc-select>
      </div>
    `,
    moduleMetadata: { imports: [CcSelectComponent] },
  }),
};
