import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

import { SidePanelComponent } from './side-panel.stories';
import {
  ConfigureBarcodeComponent,
  ParseField,
  ParseMethod,
} from './parse-barcode.stories';

/* ────────────────────────────────────────────────────────────────────────────
 * USER WORKFLOW · BARCODE SCANNER PANEL
 *
 * The full "Barcode scanner" side-panel flow. Combines:
 *   • <uw-side-panel>          — the shell (header, save/close, two collapsible sections)
 *   • Define Action section    — REQUIRED / Visible / Repeatable / Conditional toggles
 *   • Settings section         — helper banner + list of <uw-configure-barcode>
 *                                cards + "Add Barcode" button
 *
 * The list is self-contained: this component owns the barcode array and
 * handles add / delete / move-up / move-down internally.
 *
 * ────────────────────────────────────────────────────────────────────────── */

interface BarcodeConfig {
  id: string;
  label: string;
  expanded: boolean;
  matchPrefix: string;
  parseMethod: ParseMethod;
  fieldDelimiter: string;
  keyValueDelimiter: string;
  fields: ParseField[];
  noneField: ParseField;
}

let uid = 0;
const newBarcode = (): BarcodeConfig => ({
  id: 'bc-' + (++uid) + '-' + Math.floor(performance.now() % 100000),
  label: '',   // empty → the card shows its per-index placeholder ("Configure Barcode 2")
  expanded: true,          // new barcodes open expanded (per confirmed spec)
  matchPrefix: '',
  parseMethod: 'none',
  fieldDelimiter: '|',
  keyValueDelimiter: '=',
  fields: [],
  noneField: { id: 'capture', name: 'Account#', readOnly: true },
});

@Component({
  selector: 'uw-barcode-scanner-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TooltipModule,
    SidePanelComponent, ConfigureBarcodeComponent,
  ],
  template: `
    <uw-side-panel
      title="Barcode scanner"
      [subLabel]="stepName"
      propertyType="Barcode Scanner"
      [titleHasDropdown]="true"
      [width]="width"
      [height]="height"
      [defineActionOpen]="defineActionOpen"
      [settingsOpen]="settingsOpen"
      (save)="onSave()"
      (closed)="onClose()"
    >

      <!-- ── Define Action ── -->
      <div define-action>
        <div class="bsp__row bsp__row--disabled">
          <span class="bsp__row-label bsp__row-label--upper">Required</span>
          <button type="button" class="bsp__toggle"
                  [class.bsp__toggle--on]="required"
                  disabled
                  aria-label="Required (disabled)">
            <span class="bsp__toggle-thumb"></span>
          </button>
        </div>

        <div class="bsp__row">
          <span class="bsp__row-label">Visible</span>
          <button type="button" class="bsp__toggle"
                  [class.bsp__toggle--on]="visible"
                  (click)="visible = !visible"
                  [attr.aria-checked]="visible"
                  role="switch"
                  aria-label="Visible">
            <span class="bsp__toggle-thumb"></span>
          </button>
        </div>

        <div class="bsp__row">
          <span class="bsp__row-label">Repeatable</span>
          <button type="button" class="bsp__toggle"
                  [class.bsp__toggle--on]="repeatable"
                  (click)="repeatable = !repeatable"
                  [attr.aria-checked]="repeatable"
                  role="switch"
                  aria-label="Repeatable">
            <span class="bsp__toggle-thumb"></span>
          </button>
        </div>

        <div class="bsp__row bsp__row--boxed">
          <span class="bsp__row-label">Conditional</span>
          <button type="button" class="bsp__toggle"
                  [class.bsp__toggle--on]="conditional"
                  (click)="conditional = !conditional"
                  [attr.aria-checked]="conditional"
                  role="switch"
                  aria-label="Conditional">
            <span class="bsp__toggle-thumb"></span>
          </button>
        </div>
      </div>

      <!-- ── Settings — barcode list ── -->
      <div settings>
        <div class="bsp__banner">
          <i class="pi pi-info-circle bsp__banner-icon"></i>
          <span>
            When you have more than one barcode, order matters.
            Barcodes without a matching prefix fill fields top to bottom, left to right.
            Arrange them to mirror the label.
          </span>
        </div>

        <div class="bsp__barcodes">
          <uw-configure-barcode
            *ngFor="let bc of barcodes; let i = index; trackBy: trackBarcode"
            [index]="i + 1"
            [label]="bc.label"
            [expanded]="bc.expanded"
            [matchPrefix]="bc.matchPrefix"
            [parseMethod]="bc.parseMethod"
            [fieldDelimiter]="bc.fieldDelimiter"
            [keyValueDelimiter]="bc.keyValueDelimiter"
            [fields]="bc.fields"
            [noneField]="bc.noneField"
            [canMoveUp]="i > 0"
            [canMoveDown]="i < barcodes.length - 1"
            (expandedChange)="bc.expanded = $event"
            (labelChange)="bc.label = $event"
            (matchPrefixChange)="bc.matchPrefix = $event"
            (parseMethodChange)="bc.parseMethod = $event"
            (fieldDelimiterChange)="bc.fieldDelimiter = $event"
            (keyValueDelimiterChange)="bc.keyValueDelimiter = $event"
            (fieldsChange)="bc.fields = $event"
            (moveUp)="moveUp(i)"
            (moveDown)="moveDown(i)"
            (deleteRequested)="deleteAt(i)"
          ></uw-configure-barcode>
        </div>

        <button type="button" class="bsp__add" (click)="addBarcode()">
          <i class="pi pi-barcode"></i>
          <span>Add Barcode</span>
        </button>
      </div>

    </uw-side-panel>
  `,
  styles: [`
    /* Full-height so height: 100% on the inner side panel tracks a
       viewport-sized parent (100vh / 100%). Resolves to auto when the
       parent is unsized, so fixed-height embedding still works. */
    :host { display: block; height: 100%; }

    /* ── Define Action rows ─────────────────────────────────────────────── */
    .bsp__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      gap: 12px;
    }
    .bsp__row--boxed {
      margin-top: 6px;
      padding: 8px 12px;
      background: var(--c-surface-100);
      border: 1px solid var(--c-surface-400);
      border-radius: 6px;
    }
    .bsp__row--disabled {
      opacity: 0.5;
    }
    .bsp__row--disabled .bsp__row-label {
      color: var(--t-muted);
    }
    .bsp__row-label {
      font: var(--fw-regular) var(--fs-sm)/1.35 var(--font-sans);
      color: var(--t-heading);
    }
    .bsp__row-label--upper {
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: var(--fw-semibold);
      font-size: var(--fs-xs);
    }

    /* Toggle */
    .bsp__toggle {
      display: inline-flex;
      align-items: center;
      width: 36px;
      height: 20px;
      background: var(--c-surface-500);
      border: none;
      border-radius: 999px;
      cursor: pointer;
      padding: 2px;
      transition: background 0.18s;
    }
    .bsp__toggle:disabled { cursor: not-allowed; }
    .bsp__toggle--on {
      background: var(--c-cyan-500);
    }
    .bsp__toggle-thumb {
      width: 16px;
      height: 16px;
      background: var(--c-surface-0);
      border-radius: 50%;
      transition: transform 0.18s;
      box-shadow: 0 1px 2px rgba(0,0,0,0.20);
    }
    .bsp__toggle--on .bsp__toggle-thumb { transform: translateX(16px); }

    /* ── Settings ───────────────────────────────────────────────────────── */
    .bsp__banner {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: var(--c-blue-50);
      border-left: 3px solid var(--c-blue-500);
      border-radius: 4px;
      font: var(--fw-regular) var(--fs-xs)/1.5 var(--font-sans);
      color: var(--t-body);
      margin-bottom: 12px;
    }
    .bsp__banner-icon {
      color: var(--c-blue-500);
      font-size: 13px;
      margin-top: 1px;
      flex-shrink: 0;
    }

    .bsp__barcodes {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    .bsp__add {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 11px 14px;
      background: var(--c-blue-500);
      color: var(--c-surface-0);
      border: none;
      border-radius: 6px;
      font: var(--fw-semibold) var(--fs-sm)/1.2 var(--font-sans);
      cursor: pointer;
      transition: background 0.12s;
    }
    .bsp__add:hover  { background: var(--c-blue-600); }
    .bsp__add:active { background: var(--c-blue-700); }
    .bsp__add i { font-size: 15px; }
  `],
})
export class BarcodeScannerPanelComponent {
  // ─── Shell inputs ──────────────────────────────────────────────────────────
  @Input() width: string = '380px';
  /** Any CSS length. `100%` fills the parent, `100vh` fills the viewport,
   * or pass a fixed pixel value. The panel contains its scroll internally
   * so anything larger than this height overflows within the panel. */
  @Input() height: string = '100%';
  @Input() stepName: string = '{Step Name}';
  @Input() defineActionOpen: boolean = true;
  @Input() settingsOpen: boolean = true;

  // ─── Define Action state ───────────────────────────────────────────────────
  @Input() required: boolean = false;   // rendered disabled to match the Figma
  @Input() visible: boolean = true;
  @Input() repeatable: boolean = true;
  @Input() conditional: boolean = false;

  // ─── Barcodes list (self-contained) ────────────────────────────────────────
  @Input() barcodes: BarcodeConfig[] = [newBarcode()];

  trackBarcode = (_: number, b: BarcodeConfig) => b.id;

  addBarcode() {
    this.barcodes = [...this.barcodes, newBarcode()];
  }

  deleteAt(i: number) {
    this.barcodes = this.barcodes.filter((_, idx) => idx !== i);
    // Keep at least one barcode so the panel isn't empty (users can still
    // reset with matchPrefix / parseMethod = 'none').
    if (!this.barcodes.length) this.addBarcode();
  }

  moveUp(i: number) {
    if (i <= 0) return;
    const next = [...this.barcodes];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    this.barcodes = next;
  }

  moveDown(i: number) {
    if (i >= this.barcodes.length - 1) return;
    const next = [...this.barcodes];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    this.barcodes = next;
  }

  onSave()  { /* hook for parents / stories */ }
  onClose() { /* hook for parents / stories */ }
}

// ─── Story-only host so the panel sits inside a sized parent ─────────────────
@Component({
  selector: 'uw-barcode-scanner-panel-host',
  standalone: true,
  imports: [CommonModule, BarcodeScannerPanelComponent],
  template: `
    <div [style.width]="hostWidth" [style.height]="hostHeight"
         [style.padding]="hostPadding" [style.background]="hostBackground"
         style="box-sizing:border-box;">
      <uw-barcode-scanner-panel
        [width]="width"
        [height]="height"
        [stepName]="stepName"
        [required]="required"
        [visible]="visible"
        [repeatable]="repeatable"
        [conditional]="conditional"
        [barcodes]="barcodes"
      ></uw-barcode-scanner-panel>
    </div>
  `,
})
export class BarcodeScannerPanelHostComponent {
  /** Story-only container that stands in for the parent viewport region.
   * `100vh` matches how the panel behaves in production when docked into
   * a page that fills the viewport. Change to a fixed value to test
   * arbitrary parent heights. */
  @Input() hostWidth: string = '440px';
  @Input() hostHeight: string = '100vh';
  @Input() hostPadding: string = '20px';
  @Input() hostBackground: string = 'var(--c-surface-200)';

  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() stepName: string = '{Step Name}';

  @Input() required: boolean = false;
  @Input() visible: boolean = true;
  @Input() repeatable: boolean = true;
  @Input() conditional: boolean = false;

  @Input() barcodes: BarcodeConfig[] = [];
}

// ─── Preset barcode configurations for stories ───────────────────────────────
const SINGLE: BarcodeConfig[] = [{
  id: 'bc-single',
  label: '',
  expanded: false,
  matchPrefix: '',
  parseMethod: 'none',
  fieldDelimiter: '|',
  keyValueDelimiter: '=',
  fields: [],
  noneField: { id: 'capture', name: 'Account#', readOnly: true },
}];

const TWO_COLLAPSED: BarcodeConfig[] = [
  {
    id: 'bc-1', label: 'Account label',
    expanded: false,
    matchPrefix: '',
    parseMethod: 'none',
    fieldDelimiter: '|', keyValueDelimiter: '=',
    fields: [],
    noneField: { id: 'capture', name: 'Account#', readOnly: true },
  },
  {
    id: 'bc-2', label: 'Shipment label',
    expanded: false,
    matchPrefix: '',
    parseMethod: 'none',
    fieldDelimiter: '|', keyValueDelimiter: '=',
    fields: [],
    noneField: { id: 'capture', name: 'Account#', readOnly: true },
  },
];

const MIXED: BarcodeConfig[] = [
  {
    id: 'bc-1', label: 'Simple capture',
    expanded: false,
    matchPrefix: '',
    parseMethod: 'none',
    fieldDelimiter: '|', keyValueDelimiter: '=',
    fields: [],
    noneField: { id: 'capture', name: 'Account#', readOnly: true },
  },
  {
    id: 'bc-2', label: 'Account label (delimited)',
    expanded: true,
    matchPrefix: 'ACCT',
    parseMethod: 'delimiter',
    fieldDelimiter: '|', keyValueDelimiter: '=',
    fields: [
      { id: 'f-1', name: 'Account#',  readOnly: true },
      { id: 'f-2', name: 'Store#',    readOnly: true },
      { id: 'f-3', name: 'Quantity',  readOnly: true },
    ],
    noneField: { id: 'capture', name: 'Value', readOnly: true },
  },
];

const FIXED_LENGTH_EXPANDED: BarcodeConfig[] = [
  {
    id: 'bc-1', label: 'Simple capture',
    expanded: false,
    matchPrefix: '',
    parseMethod: 'none',
    fieldDelimiter: '|', keyValueDelimiter: '=',
    fields: [],
    noneField: { id: 'capture', name: 'Account#', readOnly: true },
  },
  {
    id: 'bc-2', label: 'Shipping label (fixed)',
    expanded: true,
    matchPrefix: '',
    parseMethod: 'fixed-length',
    fieldDelimiter: '|', keyValueDelimiter: '=',
    fields: [
      { id: 'f-1', name: 'Account',  readOnly: true, start: 1,  end: 6  },
      { id: 'f-2', name: 'Store',    readOnly: true, start: 7,  end: 11 },
      { id: 'f-3', name: 'Quantity', readOnly: true, start: 12, end: 16 },
    ],
    noneField: { id: 'capture', name: 'Value', readOnly: true },
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<BarcodeScannerPanelHostComponent> = {
  title: 'User Workflow/Barcode Scanner Panel',
  component: BarcodeScannerPanelHostComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BarcodeScannerPanelComponent] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The complete **Barcode scanner** side-panel flow. Combines the shared \`<uw-side-panel>\` shell with the \`<uw-configure-barcode>\` component to let integrators stack, reorder, and remove multiple barcode configurations.

**What lives inside**
- **Define Action** — REQUIRED (disabled), Visible, Repeatable, Conditional toggles.
- **Settings** — a helper banner explaining ordering, a stackable list of Configure Barcode cards (numbered 1, 2, 3…), and an **Add Barcode** button.

**Interactions**
- ➕ **Add Barcode** — appends a new configuration (expanded by default).
- 🗑 **Delete** — removes the item from the list.
- ⬆ / ⬇ **Move** — reorders; the arrows disable automatically at the edges.
- Each card can be expanded/collapsed independently via its chevron.
`,
      },
    },
  },
  argTypes: {
    stepName:       { control: 'text' },
    required:       { control: 'boolean' },
    visible:        { control: 'boolean' },
    repeatable:     { control: 'boolean' },
    conditional:    { control: 'boolean' },
    width:          { control: 'text' },
    height:         { control: 'text' },
    hostWidth:      { control: 'text' },
    hostHeight:     { control: 'text' },
    hostBackground: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<BarcodeScannerPanelHostComponent>;

// ─── Stories ─────────────────────────────────────────────────────────────────
export const SingleBarcode: Story = {
  args: {
    stepName: '{Step Name}',
    barcodes: [...SINGLE],
    visible: true,
    repeatable: true,
    conditional: false,
    hostWidth:  '440px',
    hostHeight: '100vh',
    hostPadding: '20px',
    hostBackground: 'var(--c-surface-200)',
  },
};

export const TwoBarcodesCollapsed: Story = {
  args: {
    stepName: '{Step Name}',
    barcodes: TWO_COLLAPSED.map(b => ({ ...b })),
    hostWidth:  '440px',
    hostHeight: '100vh',
    hostPadding: '20px',
    hostBackground: 'var(--c-surface-200)',
  },
  parameters: {
    docs: { description: { story: 'Two barcode configurations, both collapsed. Notice the ⬆ arrow on the first item and ⬇ arrow on the last item are disabled.' } },
  },
};

export const DelimiterMixed: Story = {
  args: {
    stepName: '{Step Name}',
    barcodes: MIXED.map(b => ({ ...b, fields: [...b.fields] })),
    hostWidth:  '460px',
    hostHeight: '100vh',
    hostPadding: '20px',
    hostBackground: 'var(--c-surface-200)',
  },
  parameters: {
    docs: { description: { story: 'One collapsed barcode + one expanded configuration in Delimiter mode with key/value fields.' } },
  },
};

export const ManyBarcodesScrolling: Story = {
  args: {
    stepName: '{Step Name}',
    barcodes: Array.from({ length: 8 }, (_, i) => ({
      id: 'bc-' + i,
      label: ['Simple capture', 'Account label', 'Shipping label', 'Route slip',
              'Trailer seal', 'Dock stamp', 'Manifest', 'Return tag'][i] ?? 'Configure Barcode',
      expanded: false,
      matchPrefix: '',
      parseMethod: 'none' as const,
      fieldDelimiter: '|', keyValueDelimiter: '=',
      fields: [],
      noneField: { id: 'capture', name: 'Value', readOnly: true },
    })),
    hostWidth:  '440px',
    hostHeight: '100vh',
    hostPadding: '20px',
    hostBackground: 'var(--c-surface-200)',
  },
  parameters: {
    docs: { description: { story: 'Eight barcode configurations — content exceeds the viewport height so the entire panel (header + define action + settings) scrolls as one unit inside the panel bounds.' } },
  },
};

export const FixedLengthExpanded: Story = {
  args: {
    stepName: '{Step Name}',
    barcodes: FIXED_LENGTH_EXPANDED.map(b => ({ ...b, fields: [...b.fields] })),
    hostWidth:  '460px',
    hostHeight: '100vh',
    hostPadding: '20px',
    hostBackground: 'var(--c-surface-200)',
  },
  parameters: {
    docs: { description: { story: 'One collapsed barcode + one expanded Fixed-length configuration with three sliced fields.' } },
  },
};
