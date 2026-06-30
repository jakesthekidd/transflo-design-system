import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

/* ────────────────────────────────────────────────────────────────────────────
 * USER WORKFLOW · SIDE PANEL
 *
 * A responsive, container-agnostic side panel for editing a workflow step or
 * action. Width and height come from inputs so the panel can sit inside any
 * parent container (drawer, split-pane, modal, free-floating overlay).
 *
 * STRUCTURE
 *   ┌─────────────────────────────────────┐
 *   │  (Step Name)         ✕              │  ← optional sub-label + close
 *   │  {Action Name} ⌄                    │  ← title (+ optional dropdown)
 *   │                                     │
 *   │  [Property type]    [ 💾 Save ]     │  ← optional pill + save button
 *   │                                     │
 *   │  Define Action ⓘ              ⌄    │  ← collapsible section 1
 *   │  ┌───────────────────────────────┐  │
 *   │  │ <ng-content select="[define]"> │ │
 *   │  └───────────────────────────────┘  │
 *   │                                     │
 *   │  Settings ⓘ                   ⌄    │  ← collapsible section 2
 *   │  ┌───────────────────────────────┐  │
 *   │  │ <ng-content select="[settings]">│
 *   │  └───────────────────────────────┘  │
 *   └─────────────────────────────────────┘
 *
 * USAGE
 *   <uw-side-panel
 *     title="Pre-trip inspection"
 *     subLabel="Start Load"
 *     propertyType="Input"
 *     [width]="'320px'"
 *     [height]="'100%'"
 *     [defineActionOpen]="true"
 *     (save)="onSave()"
 *     (closed)="onClose()"
 *   >
 *     <div define-action>...your form for Define Action...</div>
 *     <div settings>...your settings form...</div>
 *   </uw-side-panel>
 * ────────────────────────────────────────────────────────────────────────── */

@Component({
  selector: 'uw-side-panel',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    <aside
      class="sp"
      [style.width]="width"
      [style.height]="height"
      [style.minWidth]="minWidth"
      [style.maxWidth]="maxWidth"
    >

      <!-- ── Header ── -->
      <header class="sp__header">
        <div class="sp__title-row">
          <div class="sp__title-group">
            <div *ngIf="subLabel" class="sp__sub-label">{{ subLabel }}</div>
            <button
              type="button"
              class="sp__title"
              [class.sp__title--with-dropdown]="titleHasDropdown"
              [attr.aria-haspopup]="titleHasDropdown ? 'true' : null"
              (click)="onTitleClick()"
            >
              <span>{{ title }}</span>
              <i *ngIf="titleHasDropdown" class="pi pi-chevron-down sp__title-chevron"></i>
            </button>
          </div>
          <button
            *ngIf="showClose"
            type="button"
            class="sp__close"
            (click)="closed.emit()"
            pTooltip="Close"
            tooltipPosition="bottom"
            aria-label="Close panel"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="sp__meta-row" *ngIf="propertyType || showSave">
          <span *ngIf="propertyType" class="sp__property-pill">{{ propertyType }}</span>
          <span class="sp__spacer"></span>
          <button
            *ngIf="showSave"
            type="button"
            class="sp__save"
            (click)="save.emit()"
          >
            <i class="pi pi-save"></i>
            <span>{{ saveLabel }}</span>
          </button>
        </div>
      </header>

      <!-- ── Scrollable body holds both collapsible sections ── -->
      <div class="sp__body">

        <!-- Section 1 -->
        <section class="sp__section" [class.sp__section--open]="defineActionOpen">
          <button
            type="button"
            class="sp__section-head"
            (click)="defineActionOpen = !defineActionOpen"
            [attr.aria-expanded]="defineActionOpen"
          >
            <span class="sp__section-title">{{ defineActionLabel }}</span>
            <i *ngIf="defineActionInfo"
               class="pi pi-info-circle sp__section-info"
               [pTooltip]="defineActionInfo"
               tooltipPosition="right"></i>
            <span class="sp__section-spacer"></span>
            <i class="pi sp__section-chevron"
               [ngClass]="defineActionOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
          </button>
          <div class="sp__section-body" *ngIf="defineActionOpen">
            <ng-content select="[define-action]"></ng-content>
            <div *ngIf="!hasDefineActionContent" class="sp__placeholder">
              <i class="pi pi-inbox"></i>
              <span>Pass content via <code>&lt;div define-action&gt;…&lt;/div&gt;</code></span>
            </div>
          </div>
        </section>

        <!-- Section 2 -->
        <section class="sp__section" [class.sp__section--open]="settingsOpen">
          <button
            type="button"
            class="sp__section-head"
            (click)="settingsOpen = !settingsOpen"
            [attr.aria-expanded]="settingsOpen"
          >
            <span class="sp__section-title">{{ settingsLabel }}</span>
            <i *ngIf="settingsInfo"
               class="pi pi-info-circle sp__section-info"
               [pTooltip]="settingsInfo"
               tooltipPosition="right"></i>
            <span class="sp__section-spacer"></span>
            <i class="pi sp__section-chevron"
               [ngClass]="settingsOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
          </button>
          <div class="sp__section-body" *ngIf="settingsOpen">
            <ng-content select="[settings]"></ng-content>
            <div *ngIf="!hasSettingsContent" class="sp__placeholder">
              <i class="pi pi-inbox"></i>
              <span>Pass content via <code>&lt;div settings&gt;…&lt;/div&gt;</code></span>
            </div>
          </div>
        </section>

      </div>
    </aside>
  `,
  styles: [`
    :host { display: inline-block; }

    /* ── Panel shell ───────────────────────────────────────────────────────── */
    .sp {
      display: flex;
      flex-direction: column;
      background: var(--c-surface-0);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      font-family: var(--font-sans);
      color: var(--t-body);
      box-sizing: border-box;
    }

    /* ── Header ────────────────────────────────────────────────────────────── */
    .sp__header {
      padding: 14px 16px 12px 16px;
      flex-shrink: 0;
    }

    .sp__title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .sp__title-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }

    .sp__sub-label {
      font: var(--fw-regular) var(--fs-xs)/1.3 var(--font-sans);
      color: var(--t-muted);
    }

    .sp__title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0;
      background: transparent;
      border: none;
      cursor: default;
      font: var(--fw-bold) var(--fs-lg)/1.2 var(--font-sans);
      color: var(--t-heading);
      text-align: left;
      max-width: 100%;
    }
    .sp__title--with-dropdown { cursor: pointer; }
    .sp__title--with-dropdown:hover { color: var(--c-blue-700); }

    .sp__title-chevron {
      font-size: 12px;
      color: var(--t-muted);
    }
    .sp__title--with-dropdown:hover .sp__title-chevron { color: var(--c-blue-700); }

    .sp__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: var(--t-muted);
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.12s, color 0.12s;
    }
    .sp__close:hover { background: var(--c-surface-200); color: var(--t-heading); }

    /* ── Meta row ──────────────────────────────────────────────────────────── */
    .sp__meta-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }

    .sp__spacer { flex: 1; }

    .sp__property-pill {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      background: var(--c-blue-50);
      color: var(--c-blue-700);
      border: 1px solid var(--c-blue-100);
      border-radius: 12px;
      font: var(--fw-semibold) var(--fs-xs)/1.2 var(--font-sans);
    }

    .sp__save {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--c-blue-500);
      color: var(--c-surface-0);
      border: none;
      border-radius: 4px;
      font: var(--fw-semibold) var(--fs-xs)/1.2 var(--font-sans);
      cursor: pointer;
      transition: background 0.12s;
    }
    .sp__save:hover  { background: var(--c-blue-600); }
    .sp__save:active { background: var(--c-blue-700); }
    .sp__save i      { font-size: 12px; }

    /* ── Body / collapsible sections ───────────────────────────────────────── */
    .sp__body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 0 16px 16px 16px;
    }

    .sp__section {
      border-top: 1px solid var(--c-surface-300);
    }
    .sp__section:first-child { border-top: 0; }

    .sp__section-head {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 14px 0;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      color: var(--t-heading);
    }
    .sp__section-head:hover .sp__section-chevron { color: var(--c-blue-500); }

    .sp__section-title {
      font: var(--fw-semibold) var(--fs-base)/1.3 var(--font-sans);
      color: var(--t-heading);
    }

    .sp__section-info {
      color: var(--t-muted);
      font-size: 12px;
    }

    .sp__section-spacer { flex: 1; }

    .sp__section-chevron {
      color: var(--t-muted);
      font-size: 12px;
      transition: color 0.12s;
    }

    .sp__section-body {
      padding-bottom: 12px;
    }

    .sp__placeholder {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 12px;
      background: var(--c-surface-100);
      border: 1px dashed var(--c-surface-400);
      border-radius: 6px;
      color: var(--t-muted);
      font: var(--fw-regular) var(--fs-xs)/1.4 var(--font-sans);
    }
    .sp__placeholder i { color: var(--c-surface-600); }
    .sp__placeholder code {
      font-family: var(--font-mono);
      color: var(--t-body);
      background: var(--c-surface-200);
      padding: 1px 4px;
      border-radius: 3px;
    }
  `],
})
export class SidePanelComponent {
  // ─── Sizing — both axes accept any CSS length value ─────────────────────────
  /** Container width (px, %, vh, rem, etc.). Defaults to 320 px. */
  @Input() width: string = '320px';
  /** Container height. Pass '100%' to fill the parent. */
  @Input() height: string = '600px';
  @Input() minWidth: string = '260px';
  @Input() maxWidth: string = '100%';

  // ─── Header inputs ──────────────────────────────────────────────────────────
  /** Main title — e.g. "{Action Name}" or "{Step name}". */
  @Input() title: string = '{Action Name}';
  /** Optional sub-label rendered above the title (e.g. parent step name). */
  @Input() subLabel?: string;
  /** Show a dropdown chevron next to the title (signals title is changeable). */
  @Input() titleHasDropdown: boolean = true;
  /** Light-blue pill shown under the title (e.g. property/action type). */
  @Input() propertyType?: string;
  /** Show the Save button. */
  @Input() showSave: boolean = true;
  /** Label for the Save button. */
  @Input() saveLabel: string = 'Save';
  /** Show the close × button. */
  @Input() showClose: boolean = true;

  // ─── Section configuration ──────────────────────────────────────────────────
  @Input() defineActionLabel: string = 'Define Action';
  @Input() defineActionInfo?: string;
  @Input() defineActionOpen: boolean = true;

  @Input() settingsLabel: string = 'Settings';
  @Input() settingsInfo?: string;
  @Input() settingsOpen: boolean = false;

  // ─── Outputs ────────────────────────────────────────────────────────────────
  @Output() save        = new EventEmitter<void>();
  @Output() closed      = new EventEmitter<void>();
  @Output() titleClick  = new EventEmitter<void>();

  // ─── Internals ──────────────────────────────────────────────────────────────
  /** Story-time helpers — toggled via story args to demo empty vs. populated sections. */
  hasDefineActionContent = true;
  hasSettingsContent     = true;

  onTitleClick() { if (this.titleHasDropdown) this.titleClick.emit(); }
}

// ─── Demo wrapper so stories can show real-looking content ──────────────────
@Component({
  selector: 'uw-side-panel-demo',
  standalone: true,
  imports: [CommonModule, SidePanelComponent],
  template: `
    <div [style.width]="hostWidth" [style.height]="hostHeight" [style.padding]="hostPadding"
         [style.background]="hostBackground" style="box-sizing: border-box;">
      <uw-side-panel
        [title]="title"
        [subLabel]="subLabel"
        [propertyType]="propertyType"
        [titleHasDropdown]="titleHasDropdown"
        [showSave]="showSave"
        [saveLabel]="saveLabel"
        [showClose]="showClose"
        [width]="width"
        [height]="height"
        [defineActionLabel]="defineActionLabel"
        [defineActionInfo]="defineActionInfo"
        [defineActionOpen]="defineActionOpen"
        [settingsLabel]="settingsLabel"
        [settingsInfo]="settingsInfo"
        [settingsOpen]="settingsOpen"
      >
        <div *ngIf="showDemoContent" define-action>
          <p style="margin: 0 0 8px 0; font: var(--fw-regular) var(--fs-sm)/1.5 var(--font-sans); color: var(--t-body);">
            This is where the "Define Action" form lives. Replace this slot with your own controls.
          </p>
          <input type="text" placeholder="Action value name" style="
            width: 100%; padding: 8px 10px;
            border: 1px solid var(--c-surface-500);
            border-radius: 4px; font: inherit;
          " />
        </div>
        <div *ngIf="showDemoContent" settings>
          <p style="margin: 0; font: var(--fw-regular) var(--fs-sm)/1.5 var(--font-sans); color: var(--t-body);">
            Slot for the settings form. Toggles, required flags, validation rules, etc.
          </p>
        </div>
      </uw-side-panel>
    </div>
  `,
})
export class SidePanelDemoComponent {
  @Input() title: string = '{Action Name}';
  @Input() subLabel?: string;
  @Input() propertyType?: string = 'Property type';
  @Input() titleHasDropdown: boolean = true;
  @Input() showSave: boolean = true;
  @Input() saveLabel: string = 'Save';
  @Input() showClose: boolean = true;

  @Input() width: string = '320px';
  @Input() height: string = '560px';

  @Input() defineActionLabel: string = 'Define Action';
  @Input() defineActionInfo?: string = 'Configure what this action collects.';
  @Input() defineActionOpen: boolean = false;

  @Input() settingsLabel: string = 'Settings';
  @Input() settingsInfo?: string = 'Validation, visibility, and advanced options.';
  @Input() settingsOpen: boolean = false;

  @Input() showDemoContent: boolean = true;

  // Host container styling (story-only) so we can show the panel sitting inside
  // a parent container of arbitrary size.
  @Input() hostWidth: string = '380px';
  @Input() hostHeight: string = '640px';
  @Input() hostPadding: string = '24px';
  @Input() hostBackground: string = 'var(--c-surface-200)';
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<SidePanelDemoComponent> = {
  title: 'User Workflow/Side Panel',
  component: SidePanelDemoComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SidePanelComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A responsive, container-agnostic side panel for editing a workflow step or action.

**Sizing** — pass any CSS length to \`width\` and \`height\`. The panel never assumes its parent.
**Slots** — two named projection slots: \`[define-action]\` and \`[settings]\`. Each lives inside a collapsible section.
**Variants** — top-level Step panel (no \`subLabel\`) or nested Action panel (\`subLabel="{Step Name}"\`).

\`\`\`html
<uw-side-panel
  title="Pre-trip inspection"
  subLabel="Start Load"
  propertyType="Input"
  [width]="'320px'"
  [height]="'100%'"
  (save)="onSave()"
  (closed)="onClose()"
>
  <div define-action>...your form...</div>
  <div settings>...your settings...</div>
</uw-side-panel>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    title:             { control: 'text' },
    subLabel:          { control: 'text' },
    propertyType:      { control: 'text' },
    titleHasDropdown:  { control: 'boolean' },
    showSave:          { control: 'boolean' },
    saveLabel:         { control: 'text' },
    showClose:         { control: 'boolean' },
    width:             { control: 'text' },
    height:            { control: 'text' },
    defineActionLabel: { control: 'text' },
    defineActionInfo:  { control: 'text' },
    defineActionOpen:  { control: 'boolean' },
    settingsLabel:     { control: 'text' },
    settingsInfo:      { control: 'text' },
    settingsOpen:      { control: 'boolean' },
    showDemoContent:   { control: 'boolean' },
    hostWidth:         { control: 'text' },
    hostHeight:        { control: 'text' },
    hostPadding:       { control: 'text' },
    hostBackground:    { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SidePanelDemoComponent>;

// ─── Stories ─────────────────────────────────────────────────────────────────
export const ActionPanel: Story = {
  args: {
    title: '{Action Name}',
    subLabel: '{Step Name}',
    propertyType: 'Property type',
    showSave: true,
    showClose: true,
    titleHasDropdown: true,
    width: '320px',
    height: '560px',
    defineActionOpen: false,
    settingsOpen: false,
    showDemoContent: false,
  },
  parameters: {
    docs: { description: { story: 'Action panel — sits under a parent Step. Empty state matches the Figma reference.' } },
  },
};

export const StepPanel: Story = {
  args: {
    title: '{Step name}',
    subLabel: undefined,
    propertyType: 'Property type',
    showSave: true,
    showClose: true,
    titleHasDropdown: true,
    width: '320px',
    height: '560px',
    defineActionOpen: false,
    settingsOpen: false,
    showDemoContent: false,
  },
  parameters: {
    docs: { description: { story: 'Top-level Step panel — no parent sub-label, just the step title.' } },
  },
};

export const Populated: Story = {
  args: {
    title: 'Pre-trip inspection',
    subLabel: 'Start Load',
    propertyType: 'Input',
    showSave: true,
    showClose: true,
    width: '340px',
    height: '600px',
    defineActionLabel: 'Define Action',
    defineActionInfo: 'Configure what this action collects from the driver.',
    defineActionOpen: true,
    settingsLabel: 'Settings',
    settingsInfo: 'Validation, visibility, and advanced options.',
    settingsOpen: false,
    showDemoContent: true,
  },
  parameters: {
    docs: { description: { story: 'Realistic content slotted into both sections via `[define-action]` and `[settings]`.' } },
  },
};

export const FillParentHeight: Story = {
  args: {
    title: '{Action Name}',
    subLabel: '{Step Name}',
    propertyType: 'Property type',
    width: '320px',
    height: '100%',          // ← stretches to the parent
    hostWidth:  '360px',
    hostHeight: '780px',
    hostPadding: '20px',
    hostBackground: 'var(--c-surface-200)',
  },
  parameters: {
    docs: { description: { story: '`height: 100%` lets the panel fill any parent container — useful when docked inside a split-pane or drawer.' } },
  },
};

export const NarrowMobile: Story = {
  args: {
    title: '{Action Name}',
    subLabel: '{Step Name}',
    propertyType: 'Property type',
    width: '100%',
    height: '520px',
    hostWidth: '320px',
    hostHeight: '600px',
  },
  parameters: {
    docs: { description: { story: 'Width set to 100 % so the panel fills a narrow parent — verifies responsive behaviour at mobile widths.' } },
  },
};

export const Wide: Story = {
  args: {
    title: 'Pre-trip inspection',
    subLabel: 'Start Load',
    propertyType: 'Input',
    width: '440px',
    height: '560px',
    defineActionOpen: true,
    settingsOpen: true,
    showDemoContent: true,
    hostWidth: '500px',
    hostHeight: '640px',
  },
  parameters: {
    docs: { description: { story: 'Wider variant for desktop-only screens that have more horizontal room.' } },
  },
};
