import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

// ─── Command Center Input Component ───────────────────────────────────────────
@Component({
  selector: 'cc-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  template: `
    <div class="cc-field">
      <label class="cc-label">
        {{ label }}<span *ngIf="state === 'error'" class="cc-required"> *</span>
      </label>
      <div class="cc-input-wrapper" [ngClass]="'cc-input-wrapper--' + state">
        <input
          pInputText
          class="cc-input"
          [placeholder]="(state === 'default' || state === 'hover' || state === 'disabled') ? placeholder : ''"
          [value]="(state === 'active') ? displayValue : ''"
          [disabled]="state === 'disabled'"
        />
        <span class="cc-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="7" r="4" stroke="#374151" stroke-width="1.8"/>
            <path d="M2 21c0-4 3.134-7 7-7s7 3 7 7" stroke="#374151" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M19 8v6M22 11h-6" stroke="#374151" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .cc-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 260px;
    }

    .cc-label {
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
      padding-left: 2px;
    }

    .cc-required {
      color: #EF4444;
      margin-left: 1px;
    }

    /* ── Wrapper ── */
    .cc-input-wrapper {
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-radius: 20px;
      border: 1.5px solid #1E40AF;
      transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
      padding: 0;
      overflow: hidden;
    }

    .cc-input-wrapper--default {
      background-color: #ffffff;
      border-color: #1E40AF;
    }

    .cc-input-wrapper--hover {
      background-color: #ffffff;
      border-color: #1E40AF;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    .cc-input-wrapper--focus {
      background-color: #ffffff;
      border-color: #1E40AF;
      border-width: 2px;
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.2);
    }

    .cc-input-wrapper--active {
      background-color: #ffffff;
      border-color: #1E40AF;
      border-width: 2px;
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.2);
    }

    .cc-input-wrapper--error {
      background-color: #ffffff;
      border-color: #EF4444;
    }

    .cc-input-wrapper--disabled {
      background-color: #F9FAFB;
      border-color: #D1D5DB;
      opacity: 0.55;
      pointer-events: none;
    }

    /* ── PrimeNG pInputText overrides ── */
    :host ::ng-deep .cc-input.p-inputtext {
      flex: 1;
      width: 100%;
      border: none !important;
      background: transparent !important;
      border-radius: 0 !important;
      outline: none !important;
      box-shadow: none !important;
      padding: 9px 4px 9px 14px !important;
      font-size: 14px;
      color: #1F2937;
      font-family: inherit;
      min-width: 0;
    }

    :host ::ng-deep .cc-input.p-inputtext:enabled:focus {
      border: none !important;
      box-shadow: none !important;
    }

    :host ::ng-deep .cc-input.p-inputtext:enabled:hover {
      border: none !important;
    }

    :host ::ng-deep .cc-input.p-inputtext::placeholder {
      color: #9CA3AF;
    }

    :host ::ng-deep .cc-input.p-inputtext:disabled {
      background: transparent !important;
      opacity: 1;
      cursor: not-allowed;
    }

    /* ── Icon ── */
    .cc-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px 0 4px;
      flex-shrink: 0;
    }

    .cc-icon-wrap svg {
      display: block;
    }
  `]
})
export class CcInputComponent {
  @Input() label = 'Title';
  @Input() placeholder = 'Input';
  @Input() displayValue = 'sdsdssd';
  @Input() state: 'default' | 'hover' | 'focus' | 'active' | 'error' | 'disabled' = 'default';
}

// ─── Story Meta ───────────────────────────────────────────────────────────────
const meta: Meta<CcInputComponent> = {
  title: 'Command Center/Input',
  component: CcInputComponent,
  decorators: [
    moduleMetadata({
      imports: [CcInputComponent],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Command Center styled input field. Rounded corners with a light blue-gray background and add-contact icon. Used across the Command Center product experience.',
      },
    },
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'light-gray', value: '#F3F4F6' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Field label' },
    placeholder: { control: 'text', description: 'Placeholder text' },
    displayValue: { control: 'text', description: 'Value shown in active state' },
    state: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'active', 'error', 'disabled'],
      description: 'Visual state of the input',
    },
  },
};

export default meta;
type Story = StoryObj<CcInputComponent>;

// ─── Individual Stories ───────────────────────────────────────────────────────
export const Default: Story = {
  args: { label: 'Title', placeholder: 'Input', state: 'default' },
};

export const Hover: Story = {
  args: { label: 'Title', placeholder: 'Input', state: 'hover' },
};

export const Focus: Story = {
  args: { label: 'Title', state: 'focus' },
};

export const Active: Story = {
  args: { label: 'Title', displayValue: 'sdsdssd', state: 'active' },
};

export const Error: Story = {
  args: { label: 'Title', state: 'error' },
};

export const Disabled: Story = {
  args: { label: 'Title', placeholder: 'Input', state: 'disabled' },
};

// ─── All States ───────────────────────────────────────────────────────────────
export const AllStates: Story = {
  name: 'All States',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#F3F4F6; width:320px;">
        <cc-input label="Title" placeholder="Input" state="default"></cc-input>
        <cc-input label="Title" placeholder="Input" state="hover"></cc-input>
        <cc-input label="Title" state="focus"></cc-input>
        <cc-input label="Title" displayValue="sdsdssd" state="active"></cc-input>
        <cc-input label="Title" state="error"></cc-input>
        <cc-input label="Title" placeholder="Input" state="disabled"></cc-input>
      </div>
    `,
    moduleMetadata: { imports: [CcInputComponent] },
  }),
};
