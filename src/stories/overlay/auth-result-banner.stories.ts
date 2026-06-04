import type { Meta, StoryObj } from '@storybook/angular';

/**
 * Auth Result Banner — inline pass/fail confirmation used after a
 * "Test Authentication" or similar verification action on a form.
 *
 * Pattern: persistent inline banner anchored above the form's action
 * bar. Dismissable. Green for success, red for failure. Uses the same
 * structural copy on both sides so the result is scannable:
 *
 *   "Authentication successful — connected to {system}."
 *   "Authentication failed — could not connect to {system}. Verify credentials and try again."
 *
 * Choose this over a toast when the user might need to read the
 * message while fixing the underlying input.
 */
const meta: Meta = {
  title: 'Patterns/Auth Result Banner',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inline success / failure banner for credential-test actions. Mirror the success and failure copy so users can scan the outcome at a glance.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const BANNER_STYLES = `
  <style>
    .test-result {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      border: 1px solid;
      font-family: inherit;
    }
    .test-result--pass {
      background: #e5f9ea;
      color: #1b6b3a;
      border-color: #a3d9b1;
    }
    .test-result--fail {
      background: #fbe9ea;
      color: #83131a;
      border-color: #f0a5ab;
    }
    .test-result i:first-child {
      font-size: 1rem;
    }
    .test-result span {
      flex: 1 1 auto;
    }
    .test-result__dismiss {
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      padding: 0;
      line-height: 1;
      font-size: 1rem;
    }
    .test-result__dismiss:hover {
      opacity: 1;
    }
  </style>
`;

export const Success: Story = {
  render: () => ({
    template: `
      ${BANNER_STYLES}
      <div class="test-result test-result--pass">
        <i class="pi pi-check-circle"></i>
        <span>Authentication successful — connected to McLeod v22 — WorkflowAI Import Loads.</span>
        <button type="button" class="test-result__dismiss" aria-label="Dismiss">
          <i class="pi pi-times"></i>
        </button>
      </div>
    `,
  }),
};

export const Failed: Story = {
  render: () => ({
    template: `
      ${BANNER_STYLES}
      <div class="test-result test-result--fail">
        <i class="pi pi-times-circle"></i>
        <span>Authentication failed — could not connect to McLeod v22 — WorkflowAI Import Loads. Verify credentials and try again.</span>
        <button type="button" class="test-result__dismiss" aria-label="Dismiss">
          <i class="pi pi-times"></i>
        </button>
      </div>
    `,
  }),
};

export const SideBySide: Story = {
  name: 'Both states',
  render: () => ({
    template: `
      ${BANNER_STYLES}
      <div style="display:flex; flex-direction:column; gap:12px; max-width: 900px;">
        <div class="test-result test-result--pass">
          <i class="pi pi-check-circle"></i>
          <span>Authentication successful — connected to McLeod v22 — WorkflowAI Import Loads.</span>
          <button type="button" class="test-result__dismiss" aria-label="Dismiss">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="test-result test-result--fail">
          <i class="pi pi-times-circle"></i>
          <span>Authentication failed — could not connect to McLeod v22 — WorkflowAI Import Loads. Verify credentials and try again.</span>
          <button type="button" class="test-result__dismiss" aria-label="Dismiss">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    `,
  }),
};
