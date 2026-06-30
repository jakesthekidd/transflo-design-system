import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

/* ────────────────────────────────────────────────────────────────────────────
 * USER WORKFLOW · PARSE BARCODE INTO FIELDS
 *
 * A self-contained configuration block that lives inside the User Workflow
 * side panel. Lets an integrator turn a single barcode scan into several
 * structured fields without writing code.
 *
 * STATES
 *   • Off          — toggle off, only the title row is visible.
 *   • On (empty)   — toggle on, no fields configured yet, split method picker
 *                    + ADD Field button visible.
 *   • Fixed length — split by character position (start → end).
 *   • Delimiter    — split by a separator character (|, comma, tab, etc.).
 *
 * ────────────────────────────────────────────────────────────────────────── */

export type SplitMethod = 'fixed-length' | 'delimiter';

export interface ParseField {
  id: string;
  name: string;
  readOnly: boolean;
  /** For fixed-length: 1-based start position (inclusive). */
  start?: number;
  /** For fixed-length: 1-based end position (inclusive). */
  end?: number;
}

@Component({
  selector: 'uw-parse-barcode',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipModule],
  template: `
    <section class="pb" [class.pb--enabled]="enabled">

      <!-- Header row: title + toggle -->
      <header class="pb__head">
        <span class="pb__title">Parse barcode into fields</span>
        <button
          type="button"
          class="pb__toggle"
          [class.pb__toggle--on]="enabled"
          role="switch"
          [attr.aria-checked]="enabled"
          (click)="setEnabled(!enabled)"
        >
          <span class="pb__toggle-thumb"></span>
        </button>
      </header>

      <!-- Body visible only when enabled -->
      <div class="pb__body" *ngIf="enabled">

        <!-- Split method row -->
        <div class="pb__row">
          <label class="pb__label">Split method</label>
          <div class="pb__select-wrap">
            <select
              class="pb__select"
              [ngModel]="splitMethod"
              (ngModelChange)="setSplitMethod($event)"
            >
              <option value="fixed-length">Fixed length</option>
              <option value="delimiter">Delimiter</option>
            </select>
            <i class="pi pi-chevron-down pb__select-chevron"></i>
          </div>
        </div>

        <!-- Separator (only for delimiter mode) -->
        <div class="pb__row" *ngIf="splitMethod === 'delimiter'">
          <label class="pb__label">Separator</label>
          <input
            class="pb__input pb__input--separator"
            type="text"
            maxlength="3"
            [ngModel]="separator"
            (ngModelChange)="setSeparator($event)"
            placeholder="|"
          />
        </div>

        <!-- Fields section -->
        <div class="pb__fields-label">Fields (in scan order)</div>

        <div *ngIf="fields.length" class="pb__fields">
          <div
            *ngFor="let field of fields; let i = index; trackBy: trackById"
            class="pb__field"
            [class.pb__field--dragging]="draggedIndex === i"
            [class.pb__field--drop-target]="dropTargetIndex === i && draggedIndex !== i"
            draggable="true"
            (dragstart)="onDragStart($event, i)"
            (dragover)="onDragOver($event, i)"
            (dragleave)="onDragLeave(i)"
            (drop)="onDrop($event, i)"
            (dragend)="onDragEnd()"
          >
            <i class="pi pi-th-large pb__field-grip"
               pTooltip="Drag to reorder" tooltipPosition="top"
               aria-hidden="true"></i>

            <input
              type="text"
              class="pb__field-name"
              [ngModel]="field.name"
              (ngModelChange)="renameField(field, $event)"
              [attr.aria-label]="'Rename ' + field.name"
            />

            <span *ngIf="splitMethod === 'fixed-length'" class="pb__field-range">
              <input
                type="number"
                class="pb__field-pos"
                min="1"
                [ngModel]="field.start"
                (ngModelChange)="updateStart(field, $event)"
              />
              <i class="pi pi-arrow-right"></i>
              <input
                type="number"
                class="pb__field-pos"
                min="1"
                [ngModel]="field.end"
                (ngModelChange)="updateEnd(field, $event)"
              />
            </span>

            <button
              type="button"
              class="pb__field-lock"
              [class.pb__field-lock--editable]="!field.readOnly"
              (click)="toggleReadOnly(field)"
              [pTooltip]="field.readOnly ? 'Read only — click to make editable' : 'Editable — click to lock'"
              tooltipPosition="top"
            >
              <i class="pi" [ngClass]="field.readOnly ? 'pi-lock' : 'pi-pencil'"></i>
              <span>{{ field.readOnly ? 'Read Only' : 'Editable' }}</span>
            </button>

            <button
              type="button"
              class="pb__field-remove"
              (click)="removeField(field)"
              pTooltip="Remove"
              tooltipPosition="top"
              [attr.aria-label]="'Remove ' + field.name"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>

        <!-- ADD Field button -->
        <button type="button" class="pb__add" (click)="addField()">
          <i class="pi pi-plus-circle"></i>
          <span>ADD Field</span>
        </button>

        <!-- Sample scan preview -->
        <div *ngIf="showPreview && fields.length" class="pb__preview">
          <div class="pb__preview-label">Sample scan preview</div>

          <div class="pb__preview-scan">
            <span
              *ngFor="let seg of previewSegments(); let i = index"
              class="pb__preview-seg"
              [class.pb__preview-seg--empty]="!seg"
              [style.background]="seg ? segmentColor(i, 'bg') : null"
              [style.color]="seg ? segmentColor(i, 'fg') : null"
            >{{ seg || '—' }}</span>
          </div>

          <div class="pb__preview-interp">
            <ng-container *ngFor="let pair of previewInterpolated(); let i = index; let last = last">
              <span
                class="pb__preview-key"
                [style.color]="pair.empty ? null : segmentColor(i, 'fg')"
              >{{ pair.label }}</span>
              <span class="pb__preview-value"
                    [class.pb__preview-value--empty]="pair.empty">
                {{ pair.empty ? '—' : pair.value }}
              </span>
              <span *ngIf="!last" class="pb__preview-sep">·</span>
            </ng-container>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .pb {
      width: 100%;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-400);
      border-radius: 8px;
      font-family: var(--font-sans);
      color: var(--t-body);
      overflow: hidden;
      box-sizing: border-box;
    }

    /* ── Header row ───────────────────────────────────────────────────────── */
    .pb__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
    }
    .pb--enabled .pb__head {
      border-bottom: 1px solid var(--c-surface-300);
    }

    .pb__title {
      font: var(--fw-semibold) var(--fs-base)/1.35 var(--font-sans);
      color: var(--t-heading);
    }

    /* Toggle switch */
    .pb__toggle {
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
    .pb__toggle--on { background: var(--c-blue-500); }
    .pb__toggle-thumb {
      width: 16px;
      height: 16px;
      background: var(--c-surface-0);
      border-radius: 50%;
      transition: transform 0.18s;
      box-shadow: 0 1px 2px rgba(0,0,0,0.20);
    }
    .pb__toggle--on .pb__toggle-thumb { transform: translateX(16px); }

    /* ── Body ─────────────────────────────────────────────────────────────── */
    .pb__body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .pb__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .pb__label {
      font: var(--fw-semibold) var(--fs-sm)/1.35 var(--font-sans);
      color: var(--t-heading);
    }

    .pb__select-wrap {
      position: relative;
      width: 160px;
    }
    .pb__select {
      width: 100%;
      padding: 8px 30px 8px 12px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-500);
      border-radius: 6px;
      font: var(--fw-regular) var(--fs-sm)/1.35 var(--font-sans);
      color: var(--t-body);
      cursor: pointer;
      appearance: none;
    }
    .pb__select:focus {
      outline: none;
      border-color: var(--c-blue-500);
      box-shadow: 0 0 0 3px rgba(36,116,187,0.18);
    }
    .pb__select-chevron {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      font-size: 11px;
      color: var(--t-muted);
    }

    /* Separator input */
    .pb__input--separator {
      width: 56px;
      padding: 8px 10px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-500);
      border-radius: 6px;
      text-align: center;
      font-family: var(--font-mono);
      font-size: var(--fs-base);
      color: var(--t-heading);
    }
    .pb__input--separator:focus {
      outline: none;
      border-color: var(--c-blue-500);
      box-shadow: 0 0 0 3px rgba(36,116,187,0.18);
    }

    /* ── Fields list ──────────────────────────────────────────────────────── */
    .pb__fields-label {
      font: var(--fw-regular) var(--fs-xs)/1.35 var(--font-sans);
      color: var(--t-muted);
      margin-top: 2px;
    }

    .pb__fields {
      display: flex;
      flex-direction: column;
      background: var(--c-surface-100);
      border: 1px solid var(--c-surface-400);
      border-radius: 8px;
      overflow: hidden;
    }

    .pb__field {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-bottom: 1px solid var(--c-surface-300);
      background: var(--c-surface-100);
      transition: background 0.12s, transform 0.08s;
      cursor: grab;
    }
    .pb__field:active { cursor: grabbing; }
    .pb__field:last-child { border-bottom: 0; }
    .pb__field--dragging {
      opacity: 0.4;
      transform: scale(0.99);
    }
    .pb__field--drop-target {
      background: var(--c-blue-50);
      box-shadow: inset 0 2px 0 var(--c-blue-500);
    }

    .pb__field-grip {
      font-size: 11px;
      color: var(--c-surface-600);
      flex-shrink: 0;
    }

    .pb__field-name {
      flex: 1 1 0;
      min-width: 0;
      width: 0;
      padding: 4px 6px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      font: var(--fw-regular) var(--fs-base)/1.3 var(--font-sans);
      color: var(--t-heading);
      cursor: text;
      text-overflow: ellipsis;
    }
    .pb__field-name:hover {
      border-color: var(--c-surface-400);
      background: var(--c-surface-0);
    }
    .pb__field-name:focus {
      outline: none;
      border-color: var(--c-blue-500);
      background: var(--c-surface-0);
      box-shadow: 0 0 0 3px rgba(36,116,187,0.15);
    }

    .pb__field-lock {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 6px;
      background: transparent;
      border: none;
      border-radius: 4px;
      font: var(--fw-regular) var(--fs-xs)/1 var(--font-sans);
      color: var(--t-muted);
      cursor: pointer;
      flex-shrink: 0;
    }
    .pb__field-lock:hover { background: var(--c-surface-200); }
    .pb__field-lock--editable { color: var(--c-blue-700); }
    .pb__field-lock i { font-size: 11px; }

    .pb__field-range {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: var(--fw-regular) var(--fs-sm)/1 var(--font-sans);
      color: var(--t-muted);
      flex-shrink: 0;
    }
    .pb__field-range i { font-size: 10px; }

    .pb__field-pos {
      width: 38px;
      padding: 3px 4px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-400);
      border-radius: 3px;
      text-align: center;
      font-family: var(--font-mono);
      font-size: var(--fs-xs);
      color: var(--t-heading);
      -moz-appearance: textfield;
    }
    .pb__field-pos::-webkit-outer-spin-button,
    .pb__field-pos::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .pb__field-pos:focus {
      outline: none;
      border-color: var(--c-blue-500);
      box-shadow: 0 0 0 2px rgba(36,116,187,0.18);
    }

    .pb__field-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: var(--t-muted);
      cursor: pointer;
      font-size: 12px;
      flex-shrink: 0;
    }
    .pb__field-remove:hover {
      background: var(--c-red-100);
      color: var(--c-red-700);
    }

    /* ── ADD Field button ─────────────────────────────────────────────────── */
    .pb__add {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 10px 14px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-blue-500);
      border-radius: 6px;
      color: var(--c-blue-500);
      font: var(--fw-semibold) var(--fs-sm)/1.2 var(--font-sans);
      cursor: pointer;
      transition: background 0.12s, color 0.12s;
    }
    .pb__add:hover {
      background: var(--c-blue-50);
      color: var(--c-blue-700);
    }
    .pb__add i { font-size: 14px; }

    /* ── Sample scan preview ──────────────────────────────────────────────── */
    .pb__preview {
      padding: 12px 14px;
      background: var(--c-blue-50);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pb__preview-label {
      font: var(--fw-semibold) var(--fs-sm)/1.35 var(--font-sans);
      color: var(--t-heading);
    }
    .pb__preview-scan {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      font-family: var(--font-mono);
      font-size: var(--fs-sm);
    }
    .pb__preview-seg {
      padding: 2px 6px;
      border-radius: 3px;
    }
    .pb__preview-seg--empty {
      background: var(--c-surface-200);
      color: var(--t-muted);
      border: 1px dashed var(--c-surface-500);
    }
    .pb__preview-value--empty {
      color: var(--t-muted);
      font-family: var(--font-sans);
      font-style: italic;
    }
    .pb__preview-interp .pb__preview-key { color: var(--t-muted); }
    .pb__preview-interp {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
      font: var(--fw-regular) var(--fs-sm)/1.4 var(--font-sans);
      color: var(--t-body);
    }
    .pb__preview-key {
      font-weight: var(--fw-semibold);
    }
    .pb__preview-value {
      font-family: var(--font-mono);
      color: var(--t-heading);
    }
    .pb__preview-sep { color: var(--t-muted); }
  `],
})
export class ParseBarcodeComponent {
  // ─── Inputs ─────────────────────────────────────────────────────────────────
  @Input() enabled: boolean = false;
  @Input() splitMethod: SplitMethod = 'fixed-length';
  @Input() separator: string = '|';
  @Input() fields: ParseField[] = [];
  /** Sample scanned barcode to demo the preview (e.g. "0048210093 0150"). */
  @Input() sampleScan: string = '004821 0093 0150';
  @Input() showPreview: boolean = true;

  // ─── Outputs ────────────────────────────────────────────────────────────────
  @Output() enabledChange     = new EventEmitter<boolean>();
  @Output() splitMethodChange = new EventEmitter<SplitMethod>();
  @Output() separatorChange   = new EventEmitter<string>();
  @Output() fieldsChange      = new EventEmitter<ParseField[]>();
  @Output() addRequested      = new EventEmitter<void>();

  trackById = (_: number, f: ParseField) => f.id;

  // ─── Mutators ───────────────────────────────────────────────────────────────
  setEnabled(v: boolean)        { this.enabled = v; this.enabledChange.emit(v); }
  setSplitMethod(v: SplitMethod) { this.splitMethod = v; this.splitMethodChange.emit(v); }
  setSeparator(v: string)        { this.separator = v || '|'; this.separatorChange.emit(this.separator); }

  toggleReadOnly(f: ParseField) {
    f.readOnly = !f.readOnly;
    this.fieldsChange.emit(this.fields);
  }

  renameField(f: ParseField, name: string) {
    f.name = name;
    this.fieldsChange.emit(this.fields);
  }

  updateStart(f: ParseField, v: number) {
    f.start = Math.max(1, +v || 1);
    this.fieldsChange.emit(this.fields);
  }
  updateEnd(f: ParseField, v: number) {
    f.end = Math.max(f.start ?? 1, +v || 1);
    this.fieldsChange.emit(this.fields);
  }

  removeField(f: ParseField) {
    this.fields = this.fields.filter(x => x.id !== f.id);
    this.fieldsChange.emit(this.fields);
  }

  addField() {
    const idx = this.fields.length + 1;
    // For fixed-length, suggest a 4-char slice starting right after the last
    // field, clamped to a reasonable distance from the sample length so the
    // user can see where the new field would land in the preview.
    const sampleLen = this.sampleScan.replace(/\s+/g, '').length;
    const lastEnd  = this.fields.reduce((m, f) => Math.max(m, f.end ?? 0), 0);
    const start    = lastEnd > 0 ? lastEnd + 1 : 1;
    const end      = Math.max(start, Math.min(start + 3, sampleLen || start + 3));
    const newField: ParseField = {
      id: 'f-' + idx + '-' + Math.floor(performance.now() % 100000),
      name: 'Field ' + idx,
      readOnly: true,
      start: this.splitMethod === 'fixed-length' ? start : undefined,
      end:   this.splitMethod === 'fixed-length' ? end   : undefined,
    };
    this.fields = [...this.fields, newField];
    this.fieldsChange.emit(this.fields);
    this.addRequested.emit();
  }

  // ─── Drag-and-drop reordering ───────────────────────────────────────────────
  draggedIndex: number = -1;
  dropTargetIndex: number = -1;

  onDragStart(e: DragEvent, i: number) {
    this.draggedIndex = i;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(i));
    }
  }
  onDragOver(e: DragEvent, i: number) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    this.dropTargetIndex = i;
  }
  onDragLeave(i: number) {
    if (this.dropTargetIndex === i) this.dropTargetIndex = -1;
  }
  onDrop(e: DragEvent, dropIndex: number) {
    e.preventDefault();
    const from = this.draggedIndex;
    if (from === -1 || from === dropIndex) { this.onDragEnd(); return; }
    const next = [...this.fields];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    this.fields = next;
    this.fieldsChange.emit(this.fields);
    this.onDragEnd();
  }
  onDragEnd() {
    this.draggedIndex = -1;
    this.dropTargetIndex = -1;
  }

  // ─── Preview computation ────────────────────────────────────────────────────
  previewSegments(): string[] {
    if (this.splitMethod === 'delimiter') {
      const sep = this.separator || '|';
      const parts = this.sampleScan.split(sep);
      // Always emit one entry per field (empty string when sample has fewer
      // segments than fields) so the preview matches the field list 1:1.
      return this.fields.map((_, i) => parts[i] ?? '');
    }
    // Fixed-length: slice the sample (ignoring whitespace) by start/end indices.
    const raw = this.sampleScan.replace(/\s+/g, '');
    return this.fields.map(f => {
      if (f.start == null || f.end == null) return '';
      if (f.start - 1 >= raw.length) return '';
      return raw.slice(f.start - 1, f.end);
    });
  }

  previewInterpolated(): { label: string; value: string; empty: boolean }[] {
    const segs = this.previewSegments();
    return this.fields.map((f, i) => ({
      label: f.name + ' #',
      value: segs[i] ?? '',
      empty: !segs[i],
    }));
  }

  /** Pastel background + matching foreground for each segment, by index. */
  segmentColor(i: number, kind: 'bg' | 'fg'): string {
    const palette = [
      { bg: 'var(--c-green-100)',  fg: 'var(--c-green-800)'  },
      { bg: 'var(--c-yellow-100)', fg: 'var(--c-orange-800)' },
      { bg: 'var(--c-red-100)',    fg: 'var(--c-red-700)'    },
      { bg: 'var(--c-purple-100)', fg: 'var(--c-purple-800)' },
      { bg: 'var(--c-cyan-100)',   fg: 'var(--c-cyan-800)'   },
      { bg: 'var(--c-pink-100)',   fg: 'var(--c-pink-700)'   },
    ];
    return palette[i % palette.length][kind];
  }
}

// ─── Story wrapper — locks the panel to a fixed parent width so adding fields,
// editing names, or collapsing the toggle never resizes the component itself.
// In a real app the parent (a side panel, a drawer, etc.) provides this width.
// ─────────────────────────────────────────────────────────────────────────────
@Component({
  selector: 'uw-parse-barcode-host',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipModule, ParseBarcodeComponent],
  template: `
    <div [style.width]="hostWidth" [style.padding]="hostPadding">
      <uw-parse-barcode
        [enabled]="enabled"
        [splitMethod]="splitMethod"
        [separator]="separator"
        [fields]="fields"
        [sampleScan]="sampleScan"
        [showPreview]="showPreview"
      ></uw-parse-barcode>
    </div>
  `,
})
export class ParseBarcodeHostComponent {
  @Input() enabled: boolean = false;
  @Input() splitMethod: SplitMethod = 'fixed-length';
  @Input() separator: string = '|';
  @Input() fields: ParseField[] = [];
  @Input() sampleScan: string = '004821 0093 0150';
  @Input() showPreview: boolean = true;
  /** Story-only — the parent container the panel sits inside. */
  @Input() hostWidth: string = '420px';
  @Input() hostPadding: string = '0';
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const FIXED_LENGTH_FIELDS: ParseField[] = [
  { id: 'f-account',  name: 'Account',  readOnly: true,  start: 1,  end: 6  },
  { id: 'f-store',    name: 'Store',    readOnly: true,  start: 7,  end: 10 },
  { id: 'f-quantity', name: 'Quantity', readOnly: true,  start: 11, end: 14 },
];

const DELIMITER_FIELDS: ParseField[] = [
  { id: 'f-account',  name: 'Account',  readOnly: true  },
  { id: 'f-store',    name: 'Store',    readOnly: false },
  { id: 'f-quantity', name: 'Quantity', readOnly: true  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<ParseBarcodeHostComponent> = {
  title: 'User Workflow/Parse Barcode',
  component: ParseBarcodeHostComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, TooltipModule, ParseBarcodeComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Configures how a raw barcode scan is split into structured fields without writing code.

**States**
- Toggle off — only the title row is visible (one-line collapsed control).
- Toggle on, no fields — split method picker + ADD Field call-to-action.
- Toggle on with fields — Fixed-length or Delimiter mode plus a live preview that colour-codes each parsed segment.

**Two split methods**
- \`fixed-length\` — slice the scan by 1-based character positions (\`start\` → \`end\`).
- \`delimiter\` — split by a separator character (defaults to \`|\`).

**Field locking** — each field is either *Read Only* (driver sees it but can't edit) or *Editable* (driver can override at scan time). Click the lock chip to toggle.
`,
      },
    },
  },
  argTypes: {
    enabled:     { control: 'boolean' },
    splitMethod: { control: 'inline-radio', options: ['fixed-length', 'delimiter'] },
    separator:   { control: 'text' },
    sampleScan:  { control: 'text' },
    showPreview: { control: 'boolean' },
    fields:      { control: 'object' },
    hostWidth:   { control: 'text' },
    hostPadding: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ParseBarcodeHostComponent>;

// ─── Stories ─────────────────────────────────────────────────────────────────
const DEFAULT_WIDTH = '420px';

export const Off: Story = {
  args: {
    enabled: false,
    splitMethod: 'fixed-length',
    separator: '|',
    fields: [],
    sampleScan: '004821 0093 0150',
    showPreview: true,
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Disabled state — only the title row + toggle is visible. Width stays locked to the parent.' } },
  },
};

export const OnEmpty: Story = {
  args: {
    enabled: true,
    splitMethod: 'fixed-length',
    separator: '|',
    fields: [],
    sampleScan: '004821 0093 0150',
    showPreview: true,
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Toggle on, no fields yet — split-method picker + ADD Field is the entry point.' } },
  },
};

export const FixedLength: Story = {
  args: {
    enabled: true,
    splitMethod: 'fixed-length',
    separator: '|',
    fields: [...FIXED_LENGTH_FIELDS],
    sampleScan: '0048210093 0150',
    showPreview: true,
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Fixed-length parsing: 14-char scan split into Account (1-6), Store (7-10), Quantity (11-14). The preview colour-codes each slice and the interpolated line below.' } },
  },
};

export const Delimiter: Story = {
  args: {
    enabled: true,
    splitMethod: 'delimiter',
    separator: '|',
    fields: [...DELIMITER_FIELDS],
    sampleScan: '004821|0093|0150',
    showPreview: true,
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Delimiter parsing using `|` as the separator. The middle field is marked Editable so the driver can override at scan time.' } },
  },
};

export const NoPreview: Story = {
  args: {
    enabled: true,
    splitMethod: 'fixed-length',
    separator: '|',
    fields: [...FIXED_LENGTH_FIELDS],
    showPreview: false,
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Configuration view without the sample scan preview — when the parent panel has limited vertical space.' } },
  },
};
