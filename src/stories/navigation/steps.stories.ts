import type { Meta, StoryObj } from '@storybook/angular';
import { StepsModule } from 'primeng/steps';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Navigation/Steps',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Steps: Story = {
  render: () => ({
    moduleMetadata: { imports: [StepsModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      activeIndex: 1,
      items: [
        { label: 'Personal Info' },
        { label: 'Account Setup' },
        { label: 'Confirmation' },
      ] as MenuItem[],
    },
    template: `<div style="width:500px"><p-steps [model]="items" [activeIndex]="activeIndex" [readonly]="false" /></div>`,
  }),
};

export const Stepper: Story = {
  render: () => ({
    moduleMetadata: { imports: [StepperModule, ButtonModule, InputTextModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    template: `
      <div style="width:600px">
        <p-stepper [value]="1">
          <p-step-list>
            <p-step [value]="1">Personal Info</p-step>
            <p-step [value]="2">Account Setup</p-step>
            <p-step [value]="3">Done</p-step>
          </p-step-list>
          <p-step-panels>
            <p-step-panel [value]="1">
              <ng-template #content let-activateCallback="activateCallback">
                <div style="display:flex; flex-direction:column; gap:1rem; padding:1rem 0;">
                  <p>Enter your personal information to get started.</p>
                  <input pInputText placeholder="Full name" style="width:280px" />
                  <input pInputText placeholder="Email address" style="width:280px" />
                  <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(2)" />
                </div>
              </ng-template>
            </p-step-panel>
            <p-step-panel [value]="2">
              <ng-template #content let-activateCallback="activateCallback">
                <div style="display:flex; flex-direction:column; gap:1rem; padding:1rem 0;">
                  <p>Set up your account credentials.</p>
                  <input pInputText placeholder="Username" style="width:280px" />
                  <input pInputText type="password" placeholder="Password" style="width:280px" />
                  <div style="display:flex; gap:0.5rem;">
                    <p-button label="Back" severity="secondary" [outlined]="true" (onClick)="activateCallback(1)" />
                    <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(3)" />
                  </div>
                </div>
              </ng-template>
            </p-step-panel>
            <p-step-panel [value]="3">
              <ng-template #content let-activateCallback="activateCallback">
                <div style="padding:1rem 0;">
                  <p><i class="pi pi-check-circle" style="color:#00BF30;font-size:1.5rem;margin-right:0.5rem"></i><strong>Setup complete!</strong></p>
                  <p-button label="Back" severity="secondary" [outlined]="true" (onClick)="activateCallback(2)" />
                </div>
              </ng-template>
            </p-step-panel>
          </p-step-panels>
        </p-stepper>
      </div>
    `,
  }),
};
