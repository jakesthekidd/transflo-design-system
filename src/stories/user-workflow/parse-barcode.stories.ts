import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

/* ────────────────────────────────────────────────────────────────────────────
 * USER WORKFLOW · CONFIGURE BARCODE
 *
 * A single barcode-parsing configuration. Multiple can be stacked on a page
 * (each numbered by its parent list). The parent supplies the `index`, and
 * this component emits `moveUp`, `moveDown`, and `deleteRequested` so the
 * parent stays in control of the list.
 *
 * PARSE METHODS
 *   • fixed-length — slice the scan by 1-based character positions.
 *   • delimiter    — split by a field delimiter, then optionally split each
 *                    pair by a key/value delimiter (e.g. Account=123|Store=456).
 *   • none         — capture the whole scan into a single field, no parsing.
 *
 * FIELD LOCK
 *   Each field is Read Only (driver can't override) or Editable (driver can
 *   correct the parsed value at scan time). Click the lock chip to toggle.
 * ────────────────────────────────────────────────────────────────────────── */

export type ParseMethod = 'fixed-length' | 'delimiter' | 'none';

export type Symbology = 'code128' | 'code39' | 'codabar' | 'pdf417' | 'qr';

/** Symbology options with display labels for the dropdown. */
export const SYMBOLOGY_OPTIONS: { value: Symbology; label: string }[] = [
  { value: 'code128', label: 'Code 128' },
  { value: 'code39',  label: 'Code 39'  },
  { value: 'codabar', label: 'Codabar'  },
  { value: 'pdf417',  label: 'PDF417'   },
  { value: 'qr',      label: 'QR'       },
];

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
  selector: 'uw-configure-barcode',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipModule],
  template: `
    <section class="cb" [class.cb--collapsed]="!expanded">

      <!-- ── Header ── -->
      <header class="cb__head">
        <button
          type="button"
          class="cb__chevron"
          (click)="setExpanded(!expanded)"
          [attr.aria-expanded]="expanded"
          [pTooltip]="expanded ? 'Collapse' : 'Expand'"
          tooltipPosition="bottom"
        >
          <i class="pi" [ngClass]="expanded ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
        </button>

        <span class="cb__title">
          <span class="cb__title-index">{{ index }}</span>
          <input
            type="text"
            class="cb__title-input"
            [ngModel]="label"
            (ngModelChange)="setLabel($event)"
            (click)="$event.stopPropagation()"
            (focus)="selectAll($event)"
            [placeholder]="'Configure Barcode ' + index"
            aria-label="Configuration name"
          />
        </span>

        <button type="button" class="cb__icon"
                [disabled]="!canMoveUp"
                (click)="moveUp.emit()"
                pTooltip="Move up" tooltipPosition="bottom" aria-label="Move up">
          <i class="pi pi-arrow-up"></i>
        </button>
        <button type="button" class="cb__icon"
                [disabled]="!canMoveDown"
                (click)="moveDown.emit()"
                pTooltip="Move down" tooltipPosition="bottom" aria-label="Move down">
          <i class="pi pi-arrow-down"></i>
        </button>
        <button type="button" class="cb__icon cb__icon--danger"
                (click)="deleteRequested.emit()"
                pTooltip="Delete configuration" tooltipPosition="bottom"
                aria-label="Delete configuration">
          <i class="pi pi-trash"></i>
        </button>
      </header>

      <!-- ── Body ── -->
      <div class="cb__body" *ngIf="expanded">

        <!-- Match By Prefix -->
        <div class="cb__group">
          <label class="cb__label">Match By Prefix:</label>
          <input
            type="text"
            class="cb__input"
            placeholder="e.g. ACCT"
            [ngModel]="matchPrefix"
            (ngModelChange)="setMatchPrefix($event)"
          />
          <div class="cb__help">
            Optional. Use a prefix when several barcodes could fill the wrong field.
          </div>
        </div>

        <!-- Symbology -->
        <div class="cb__group">
          <label class="cb__label">Symbology</label>
          <div class="cb__select-wrap">
            <select
              class="cb__select"
              [ngModel]="symbology"
              (ngModelChange)="setSymbology($event)"
            >
              <option *ngFor="let opt of symbologyOptions" [value]="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <i class="pi pi-chevron-down cb__select-chevron"></i>
          </div>
        </div>

        <!-- Parse Method segmented control -->
        <div class="cb__group">
          <label class="cb__label">Parse Method</label>
          <div class="cb__seg" role="tablist">
            <button
              type="button"
              class="cb__seg-btn"
              [class.cb__seg-btn--active]="parseMethod === 'fixed-length'"
              role="tab"
              [attr.aria-selected]="parseMethod === 'fixed-length'"
              (click)="setParseMethod('fixed-length')"
            >Fixed length</button>
            <button
              type="button"
              class="cb__seg-btn"
              [class.cb__seg-btn--active]="parseMethod === 'delimiter'"
              role="tab"
              [attr.aria-selected]="parseMethod === 'delimiter'"
              (click)="setParseMethod('delimiter')"
            >Delimiter</button>
            <button
              type="button"
              class="cb__seg-btn"
              [class.cb__seg-btn--active]="parseMethod === 'none'"
              role="tab"
              [attr.aria-selected]="parseMethod === 'none'"
              (click)="setParseMethod('none')"
            >None</button>
          </div>
        </div>

        <!-- Delimiter-only: two delimiter inputs -->
        <div class="cb__group cb__group--split" *ngIf="parseMethod === 'delimiter'">
          <div class="cb__col">
            <label class="cb__label">Field Delimiter</label>
            <input
              type="text"
              class="cb__input cb__input--mono"
              [ngModel]="fieldDelimiter"
              (ngModelChange)="setFieldDelimiter($event)"
              maxlength="3"
            />
          </div>
          <div class="cb__col">
            <label class="cb__label">Key Value Delimiter</label>
            <input
              type="text"
              class="cb__input cb__input--mono"
              [ngModel]="keyValueDelimiter"
              (ngModelChange)="setKeyValueDelimiter($event)"
              maxlength="3"
            />
          </div>
        </div>

        <!-- Fields section -->
        <div class="cb__group" *ngIf="parseMethod !== 'none'">
          <label class="cb__fields-label">Fields (in scan order)</label>

          <div *ngIf="fields.length" class="cb__fields">
            <div
              *ngFor="let field of fields; let i = index; trackBy: trackById"
              class="cb__field"
              [class.cb__field--dragging]="draggedIndex === i"
              [class.cb__field--drop-target]="dropTargetIndex === i && draggedIndex !== i"
              draggable="true"
              (dragstart)="onDragStart($event, i)"
              (dragover)="onDragOver($event, i)"
              (dragleave)="onDragLeave(i)"
              (drop)="onDrop($event, i)"
              (dragend)="onDragEnd()"
            >
              <i class="pi pi-th-large cb__field-grip"
                 pTooltip="Drag to reorder" tooltipPosition="top"
                 aria-hidden="true"></i>

              <input
                type="text"
                class="cb__field-name"
                [ngModel]="field.name"
                (ngModelChange)="renameField(field, $event)"
                (focus)="selectAll($event)"
                [attr.aria-label]="'Rename ' + field.name"
              />

              <button
                type="button"
                class="cb__field-lock"
                [class.cb__field-lock--editable]="!field.readOnly"
                (click)="toggleReadOnly(field)"
                [pTooltip]="field.readOnly ? 'Read only — click to make editable' : 'Editable — click to lock'"
                tooltipPosition="top"
              >
                <i class="pi" [ngClass]="field.readOnly ? 'pi-lock' : 'pi-pencil'"></i>
                <span>{{ field.readOnly ? 'Read Only' : 'Editable' }}</span>
              </button>

              <span *ngIf="parseMethod === 'fixed-length'" class="cb__field-range">
                <input
                  type="number"
                  class="cb__field-pos"
                  min="1"
                  [ngModel]="field.start"
                  (ngModelChange)="updateStart(field, $event)"
                  (focus)="selectAll($event)"
                />
                <i class="pi pi-arrow-right"></i>
                <input
                  type="number"
                  class="cb__field-pos"
                  min="1"
                  [ngModel]="field.end"
                  (ngModelChange)="updateEnd(field, $event)"
                  (focus)="selectAll($event)"
                />
              </span>

              <button
                type="button"
                class="cb__field-remove"
                (click)="removeField(field)"
                pTooltip="Remove" tooltipPosition="top"
                [attr.aria-label]="'Remove ' + field.name"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>

          <button type="button" class="cb__add" (click)="addField()">
            <i class="pi pi-plus-circle"></i>
            <span>ADD Field</span>
          </button>
        </div>

        <!-- None: single capture field -->
        <div class="cb__group" *ngIf="parseMethod === 'none'">
          <div class="cb__fields">
            <div class="cb__field cb__field--single">
              <i class="pi pi-th-large cb__field-grip" aria-hidden="true"></i>
              <input
                type="text"
                class="cb__field-name"
                [ngModel]="noneField.name"
                (ngModelChange)="noneField.name = $event"
                (focus)="selectAll($event)"
                aria-label="Rename capture field"
              />
              <button
                type="button"
                class="cb__field-lock"
                [class.cb__field-lock--editable]="!noneField.readOnly"
                (click)="noneField.readOnly = !noneField.readOnly"
                [pTooltip]="noneField.readOnly ? 'Read only — click to make editable' : 'Editable — click to lock'"
                tooltipPosition="top"
              >
                <i class="pi" [ngClass]="noneField.readOnly ? 'pi-lock' : 'pi-pencil'"></i>
                <span>{{ noneField.readOnly ? 'Read Only' : 'Editable' }}</span>
              </button>
            </div>
          </div>
          <div class="cb__help cb__help--muted">
            No parsing — the whole scan is captured into this single field.
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .cb {
      width: 100%;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-400);
      border-radius: 8px;
      font-family: var(--font-sans);
      color: var(--t-body);
      overflow: hidden;
      box-sizing: border-box;
    }

    /* ── Header ─────────────────────────────────────────────────────────── */
    .cb__head {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 10px 8px 6px;
      background: var(--c-surface-100);
    }
    .cb--collapsed .cb__head {
      background: var(--c-surface-100);
    }
    .cb__chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: var(--t-body);
      cursor: pointer;
      font-size: 12px;
    }
    .cb__chevron:hover { background: var(--c-surface-200); }

    .cb__title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      flex: 1;
    }
    .cb__title-index {
      font: var(--fw-semibold) var(--fs-base)/1.35 var(--font-sans);
      color: var(--t-heading);
      flex-shrink: 0;
    }
    .cb__title-input {
      flex: 1 1 0;
      min-width: 0;
      width: 0;
      padding: 3px 6px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      font: var(--fw-semibold) var(--fs-base)/1.35 var(--font-sans);
      color: var(--t-heading);
      cursor: text;
      text-overflow: ellipsis;
    }
    .cb__title-input::placeholder {
      color: var(--t-muted);
      font-weight: var(--fw-semibold);
    }
    .cb__title-input:hover {
      border-color: var(--c-surface-400);
      background: var(--c-surface-0);
    }
    .cb__title-input:focus {
      outline: none;
      border-color: var(--c-blue-500);
      background: var(--c-surface-0);
      box-shadow: 0 0 0 3px rgba(36,116,187,0.15);
    }

    .cb__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: var(--t-body);
      cursor: pointer;
      font-size: 12px;
    }
    .cb__icon:hover { background: var(--c-surface-200); color: var(--t-heading); }
    .cb__icon--danger:hover { background: var(--c-red-100); color: var(--c-red-700); }
    .cb__icon:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      background: transparent;
    }

    /* ── Body ────────────────────────────────────────────────────────────── */
    .cb__body {
      padding: 14px 16px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cb__group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cb__group--split {
      flex-direction: row;
      gap: 12px;
    }
    .cb__col { flex: 1; display: flex; flex-direction: column; gap: 6px; }

    .cb__label {
      font: var(--fw-semibold) var(--fs-sm)/1.35 var(--font-sans);
      color: var(--t-heading);
    }

    .cb__input {
      width: 100%;
      padding: 8px 12px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-500);
      border-radius: 6px;
      font: var(--fw-regular) var(--fs-sm)/1.35 var(--font-sans);
      color: var(--t-body);
      box-sizing: border-box;
    }
    .cb__input:focus {
      outline: none;
      border-color: var(--c-blue-500);
      box-shadow: 0 0 0 3px rgba(36,116,187,0.18);
    }

    /* Select (Symbology) */
    .cb__select-wrap { position: relative; width: 100%; }
    .cb__select {
      width: 100%;
      padding: 8px 34px 8px 12px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-500);
      border-radius: 6px;
      font: var(--fw-regular) var(--fs-sm)/1.35 var(--font-sans);
      color: var(--t-body);
      cursor: pointer;
      appearance: none;
      box-sizing: border-box;
    }
    .cb__select:focus {
      outline: none;
      border-color: var(--c-blue-500);
      box-shadow: 0 0 0 3px rgba(36,116,187,0.18);
    }
    .cb__select-chevron {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      font-size: 11px;
      color: var(--t-muted);
    }
    .cb__input--mono {
      font-family: var(--font-mono);
      text-align: center;
    }

    .cb__help {
      font: var(--fw-regular) var(--fs-xs)/1.4 var(--font-sans);
      color: var(--t-muted);
    }
    .cb__help--muted { font-style: italic; }

    /* ── Segmented parse-method control ──────────────────────────────────── */
    .cb__seg {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      background: var(--c-surface-100);
      border: 1px solid var(--c-surface-400);
      border-radius: 6px;
      padding: 3px;
      gap: 2px;
    }
    .cb__seg-btn {
      padding: 7px 10px;
      background: transparent;
      border: none;
      border-radius: 4px;
      font: var(--fw-medium) var(--fs-sm)/1.35 var(--font-sans);
      color: var(--t-body);
      cursor: pointer;
      transition: background 0.12s, color 0.12s;
    }
    .cb__seg-btn:hover { color: var(--t-heading); }
    .cb__seg-btn--active,
    .cb__seg-btn--active:hover {
      background: var(--c-bluegray-900);
      color: var(--c-surface-0);
    }

    /* ── Fields list ─────────────────────────────────────────────────────── */
    .cb__fields-label {
      font: var(--fw-regular) var(--fs-xs)/1.35 var(--font-sans);
      color: var(--t-muted);
    }

    .cb__fields {
      display: flex;
      flex-direction: column;
      background: var(--c-surface-100);
      border: 1px solid var(--c-surface-400);
      border-radius: 8px;
      overflow: hidden;
    }

    .cb__field {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-bottom: 1px solid var(--c-surface-300);
      background: var(--c-surface-100);
      cursor: grab;
      transition: background 0.12s;
    }
    .cb__field:active { cursor: grabbing; }
    .cb__field:last-child { border-bottom: 0; }
    .cb__field--single { cursor: default; }
    .cb__field--dragging { opacity: 0.4; }
    .cb__field--drop-target {
      background: var(--c-blue-50);
      box-shadow: inset 0 2px 0 var(--c-blue-500);
    }

    .cb__field-grip {
      font-size: 11px;
      color: var(--c-surface-600);
      flex-shrink: 0;
    }

    .cb__field-name {
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
    .cb__field-name:hover {
      border-color: var(--c-surface-400);
      background: var(--c-surface-0);
    }
    .cb__field-name:focus {
      outline: none;
      border-color: var(--c-blue-500);
      background: var(--c-surface-0);
      box-shadow: 0 0 0 3px rgba(36,116,187,0.15);
    }

    .cb__field-lock {
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
    .cb__field-lock:hover { background: var(--c-surface-200); }
    .cb__field-lock--editable { color: var(--c-blue-700); }
    .cb__field-lock i { font-size: 11px; }

    .cb__field-range {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
    .cb__field-range i {
      font-size: 10px;
      color: var(--t-muted);
    }
    .cb__field-pos {
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
    .cb__field-pos::-webkit-outer-spin-button,
    .cb__field-pos::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .cb__field-pos:focus {
      outline: none;
      border-color: var(--c-blue-500);
      box-shadow: 0 0 0 2px rgba(36,116,187,0.18);
    }

    .cb__field-remove {
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
    .cb__field-remove:hover {
      background: var(--c-red-100);
      color: var(--c-red-700);
    }

    /* ── ADD Field ───────────────────────────────────────────────────────── */
    .cb__add {
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
      margin-top: 4px;
    }
    .cb__add:hover {
      background: var(--c-blue-50);
      color: var(--c-blue-700);
    }
    .cb__add i { font-size: 14px; }
  `],
})
export class ConfigureBarcodeComponent {
  // ─── Header ────────────────────────────────────────────────────────────────
  /** Display number (usually the item's index in the parent list, 1-based). */
  @Input() index: number = 1;
  @Input() expanded: boolean = true;
  /** Disable the up arrow (e.g. when this is the first item in a parent list). */
  @Input() canMoveUp: boolean = true;
  /** Disable the down arrow (e.g. when this is the last item in a parent list). */
  @Input() canMoveDown: boolean = true;
  /** Editable label rendered next to the index. When empty, the card shows a
   * per-index placeholder ("Configure Barcode 1") so unnamed cards stay distinguishable. */
  @Input() label: string = '';

  // ─── Config inputs ─────────────────────────────────────────────────────────
  @Input() matchPrefix: string = '';
  @Input() symbology: Symbology = 'code128';
  @Input() parseMethod: ParseMethod = 'fixed-length';
  @Input() fieldDelimiter: string = '|';
  @Input() keyValueDelimiter: string = '=';
  @Input() fields: ParseField[] = [];
  /** Displayed when parseMethod === 'none'. Held on the component so toggling
   * away from 'none' and back preserves the user's name/lock choice. */
  @Input() noneField: ParseField = { id: 'capture', name: 'Value', readOnly: true };

  /** Dropdown options — exposed so the template can iterate them. */
  symbologyOptions = SYMBOLOGY_OPTIONS;

  // ─── Outputs ───────────────────────────────────────────────────────────────
  @Output() expandedChange          = new EventEmitter<boolean>();
  @Output() labelChange             = new EventEmitter<string>();
  @Output() matchPrefixChange       = new EventEmitter<string>();
  @Output() symbologyChange         = new EventEmitter<Symbology>();
  @Output() parseMethodChange       = new EventEmitter<ParseMethod>();
  @Output() fieldDelimiterChange    = new EventEmitter<string>();
  @Output() keyValueDelimiterChange = new EventEmitter<string>();
  @Output() fieldsChange            = new EventEmitter<ParseField[]>();
  @Output() moveUp                  = new EventEmitter<void>();
  @Output() moveDown                = new EventEmitter<void>();
  @Output() deleteRequested         = new EventEmitter<void>();

  trackById = (_: number, f: ParseField) => f.id;

  /** Select the input's full contents on focus so typing replaces the value. */
  selectAll(e: FocusEvent) {
    (e.target as HTMLInputElement)?.select?.();
  }

  // ─── Setters ───────────────────────────────────────────────────────────────
  setExpanded(v: boolean)          { this.expanded = v; this.expandedChange.emit(v); }
  setLabel(v: string)              { this.label = v; this.labelChange.emit(v); }
  setMatchPrefix(v: string)        { this.matchPrefix = v; this.matchPrefixChange.emit(v); }
  setSymbology(v: Symbology)        { this.symbology = v; this.symbologyChange.emit(v); }
  setParseMethod(v: ParseMethod)   { this.parseMethod = v; this.parseMethodChange.emit(v); }
  setFieldDelimiter(v: string)     { this.fieldDelimiter = v || '|'; this.fieldDelimiterChange.emit(this.fieldDelimiter); }
  setKeyValueDelimiter(v: string)  { this.keyValueDelimiter = v || '='; this.keyValueDelimiterChange.emit(this.keyValueDelimiter); }

  toggleReadOnly(f: ParseField)     { f.readOnly = !f.readOnly; this.fieldsChange.emit(this.fields); }
  renameField(f: ParseField, n: string)    { f.name = n; this.fieldsChange.emit(this.fields); }
  updateStart(f: ParseField, v: number)    { f.start = Math.max(1, +v || 1); this.fieldsChange.emit(this.fields); }
  updateEnd(f: ParseField, v: number)      { f.end   = Math.max(f.start ?? 1, +v || 1); this.fieldsChange.emit(this.fields); }
  removeField(f: ParseField)               { this.fields = this.fields.filter(x => x.id !== f.id); this.fieldsChange.emit(this.fields); }

  addField() {
    const idx = this.fields.length + 1;
    const lastEnd = this.fields.reduce((m, f) => Math.max(m, f.end ?? 0), 0);
    const start   = lastEnd > 0 ? lastEnd + 1 : 1;
    const newField: ParseField = {
      id: 'f-' + idx + '-' + Math.floor(performance.now() % 100000),
      name: 'Field ' + idx,
      readOnly: true,
      start: this.parseMethod === 'fixed-length' ? start : undefined,
      end:   this.parseMethod === 'fixed-length' ? start + 3 : undefined,
    };
    this.fields = [...this.fields, newField];
    this.fieldsChange.emit(this.fields);
  }

  // ─── Drag-and-drop reordering ──────────────────────────────────────────────
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
  onDragLeave(i: number) { if (this.dropTargetIndex === i) this.dropTargetIndex = -1; }
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
  onDragEnd() { this.draggedIndex = -1; this.dropTargetIndex = -1; }
}

// ─── Story wrapper — locks the panel to a fixed parent width ─────────────────
@Component({
  selector: 'uw-configure-barcode-host',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipModule, ConfigureBarcodeComponent],
  template: `
    <div [style.width]="hostWidth" [style.padding]="hostPadding">
      <uw-configure-barcode
        [index]="index"
        [expanded]="expanded"
        [label]="label"
        [matchPrefix]="matchPrefix"
        [symbology]="symbology"
        [parseMethod]="parseMethod"
        [fieldDelimiter]="fieldDelimiter"
        [keyValueDelimiter]="keyValueDelimiter"
        [fields]="fields"
        [noneField]="noneField"
      ></uw-configure-barcode>
    </div>
  `,
})
export class ConfigureBarcodeHostComponent {
  @Input() index: number = 1;
  @Input() expanded: boolean = true;
  @Input() label: string = '';
  @Input() matchPrefix: string = '';
  @Input() symbology: Symbology = 'code128';
  @Input() parseMethod: ParseMethod = 'fixed-length';
  @Input() fieldDelimiter: string = '|';
  @Input() keyValueDelimiter: string = '=';
  @Input() fields: ParseField[] = [];
  @Input() noneField: ParseField = { id: 'capture', name: 'Value', readOnly: true };
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
  { id: 'f-account',  name: 'Account#',  readOnly: true },
  { id: 'f-store',    name: 'Store#',    readOnly: true },
  { id: 'f-quantity', name: 'Quantity',  readOnly: true },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<ConfigureBarcodeHostComponent> = {
  title: 'User Workflow/Configure Barcode',
  component: ConfigureBarcodeHostComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, TooltipModule, ConfigureBarcodeComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A single **Configure Barcode** block. Multiple can be stacked on a parent page (the parent supplies the \`index\` and handles \`moveUp\`, \`moveDown\`, and \`deleteRequested\`).

**Header** — numbered title, expand/collapse chevron, move up / move down / delete controls.

**Match By Prefix** — optional. When several barcodes could fill the same field, the parser only applies this configuration to scans that begin with the prefix.

**Parse methods**
- \`fixed-length\` — slice the scan by 1-based character positions (\`start\` → \`end\`).
- \`delimiter\` — split by a Field Delimiter, then optionally split each pair by a Key Value Delimiter. Field names act as keys (\`Account=123|Store=456\`).
- \`none\` — no parsing; capture the entire scan into a single field.

**Field lock** — each field is Read Only or Editable. Click the chip to toggle.
`,
      },
    },
  },
  argTypes: {
    index:             { control: 'number' },
    expanded:          { control: 'boolean' },
    matchPrefix:       { control: 'text' },
    symbology:         { control: 'select', options: ['code128', 'code39', 'codabar', 'pdf417', 'qr'] },
    parseMethod:       { control: 'inline-radio', options: ['fixed-length', 'delimiter', 'none'] },
    fieldDelimiter:    { control: 'text' },
    keyValueDelimiter: { control: 'text' },
    fields:            { control: 'object' },
    hostWidth:         { control: 'text' },
    hostPadding:       { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ConfigureBarcodeHostComponent>;

const DEFAULT_WIDTH = '420px';

// ─── Stories ─────────────────────────────────────────────────────────────────
export const Collapsed: Story = {
  args: {
    index: 1,
    expanded: false,
    parseMethod: 'fixed-length',
    fields: [...FIXED_LENGTH_FIELDS],
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Collapsed — only the numbered header row is visible. Click the chevron to expand.' } },
  },
};

export const FixedLength: Story = {
  args: {
    index: 1,
    expanded: true,
    matchPrefix: '',
    parseMethod: 'fixed-length',
    fields: [...FIXED_LENGTH_FIELDS],
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Fixed-length parsing: three fields sliced from the 14-character scan.' } },
  },
};

export const Delimiter: Story = {
  args: {
    index: 1,
    expanded: true,
    matchPrefix: 'ACCT',
    parseMethod: 'delimiter',
    fieldDelimiter: '|',
    keyValueDelimiter: '=',
    fields: [...DELIMITER_FIELDS],
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Delimiter parsing with a key/value inner delimiter. Field names act as keys the parser looks up in each pair (`Account=004821|Store=0093|Quantity=0150`).' } },
  },
};

export const None: Story = {
  args: {
    index: 1,
    expanded: true,
    parseMethod: 'none',
    noneField: { id: 'capture', name: 'Account#', readOnly: true },
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: '`None` — no parsing. The entire scan is captured into a single field.' } },
  },
};

export const NoFields: Story = {
  args: {
    index: 1,
    expanded: true,
    parseMethod: 'fixed-length',
    fields: [],
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Fresh configuration — parse method selected, no fields yet. ADD Field is the entry point.' } },
  },
};

export const SecondInList: Story = {
  args: {
    index: 2,
    expanded: true,
    matchPrefix: 'SHIP',
    parseMethod: 'delimiter',
    fieldDelimiter: '|',
    keyValueDelimiter: '=',
    fields: [
      { id: 'f-bol', name: 'BOL#',   readOnly: true },
      { id: 'f-pro', name: 'PRO#',   readOnly: false },
    ],
    hostWidth: DEFAULT_WIDTH,
  },
  parameters: {
    docs: { description: { story: 'Shows how the header number changes when the parent list places this config at index 2. The middle field is Editable so the driver can override at scan time.' } },
  },
};
