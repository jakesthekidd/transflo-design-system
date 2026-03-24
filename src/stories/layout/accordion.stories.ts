import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionModule } from 'primeng/accordion';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Layout/Accordion',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [AccordionModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <div style="width:500px">
        <p-accordion>
          <p-accordion-panel value="0">
            <p-accordion-header>What is PrimeNG?</p-accordion-header>
            <p-accordion-content>
              <p>PrimeNG is a rich UI component library for Angular with over 90 flexible and customizable components.</p>
            </p-accordion-content>
          </p-accordion-panel>
          <p-accordion-panel value="1">
            <p-accordion-header>How do I install it?</p-accordion-header>
            <p-accordion-content>
              <p>Run <code>npm install primeng</code> in your Angular project, then import the modules you need.</p>
            </p-accordion-content>
          </p-accordion-panel>
          <p-accordion-panel value="2">
            <p-accordion-header>Is it free to use?</p-accordion-header>
            <p-accordion-content>
              <p>Yes, PrimeNG is open source and available under the MIT license.</p>
            </p-accordion-content>
          </p-accordion-panel>
        </p-accordion>
      </div>
    `,
  }),
};

export const MultipleOpen: Story = {
  render: () => ({
    moduleMetadata: { imports: [AccordionModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <div style="width:500px">
        <p-accordion [multiple]="true" [value]="['0','1']">
          <p-accordion-panel value="0">
            <p-accordion-header>Section 1</p-accordion-header>
            <p-accordion-content><p>Content for section 1. Multiple panels can be open simultaneously.</p></p-accordion-content>
          </p-accordion-panel>
          <p-accordion-panel value="1">
            <p-accordion-header>Section 2</p-accordion-header>
            <p-accordion-content><p>Content for section 2. This one is also open by default.</p></p-accordion-content>
          </p-accordion-panel>
          <p-accordion-panel value="2">
            <p-accordion-header>Section 3</p-accordion-header>
            <p-accordion-content><p>Content for section 3. Click to expand.</p></p-accordion-content>
          </p-accordion-panel>
        </p-accordion>
      </div>
    `,
  }),
};
