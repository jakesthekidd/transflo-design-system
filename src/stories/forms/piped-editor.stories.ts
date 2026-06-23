import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { DomSanitizer } from '@angular/platform-browser';
import Quill from 'quill';

import {
  DataSourceSelectorComponent,
  WorkflowData,
  GeotabItem,
  JsonNode,
  SelectedValue,
} from './data-source-selector.stories';

/* ────────────────────────────────────────────────────────────────────────────
 * PIPED EDITOR — combines a rich-text editor with a variable picker so users
 * can mix static text with template variables drawn from Workflow / JSON /
 * Geotab data sources.
 *
 * QUICK START (in your Angular app):
 *
 *   <app-piped-editor
 *     [workflow]="workflowData"
 *     [geotab]="geotabItems"
 *     [json]="jsonPayload"
 *     [enableWorkflow]="true"
 *     [enableJson]="true"
 *     [enableGeotab]="true"
 *     [initialHtml]="savedHtml"
 *     (htmlChange)="onHtml($event)"
 *     (tokenChange)="onTokens($event)"
 *     (structuredChange)="onStructured($event)"
 *   />
 *
 * USER EXPERIENCE
 *   • Type freely to compose static text.
 *   • Press `/` (forward slash) OR click the toolbar's "Insert Variable" button
 *     to open the data-source picker.
 *   • Pick a value — it's inserted at the cursor as an atomic token:
 *     {{workflow.startLoad.preTrip.temperature}}
 *   • Tokens behave as a single character: one backspace deletes the whole pill.
 *   • You can still format tokens with the toolbar — select a pill and click
 *     Bold, Italic, Underline, change colour, etc.
 *
 * OUTPUT — emits three formats so backends with different rendering pipelines
 * can pick what they need:
 *
 *   1. htmlChange       — raw HTML with <span class="pe-variable">…</span>.
 *                         Good when you re-render with the same WYSIWYG.
 *   2. tokenChange      — same content but variables replaced with
 *                         "{{source.path.id}}" plain-text tokens.
 *                         Good for template engines (Handlebars, Liquid, etc.).
 *   3. structuredChange — JSON array of { type, ... } blocks for direct
 *                         programmatic rendering on the back-end.
 * ────────────────────────────────────────────────────────────────────────── */

// ─── Register custom Quill Inline format once at module load ─────────────────
// Using Inline (not Embed) so other inline formats — bold, italic, color, etc.
// — naturally wrap the variable span and visually apply to the token text.
// Atomicity (single backspace deletes the whole token) is handled by a Quill
// keyboard binding registered when the editor initializes.
const Inline: any = Quill.import('blots/inline');

class VariableBlot extends Inline {
  static blotName  = 'variable';
  static tagName   = 'span';
  static className = 'pe-variable';

  static create(value: SelectedValue): HTMLElement {
    const node: HTMLElement = super.create();
    node.setAttribute('data-source', value.source);
    node.setAttribute('data-id',     value.id);
    node.setAttribute('data-label',  value.label);
    if (value.type)         node.setAttribute('data-type', value.type);
    if (value.path?.length) node.setAttribute('data-path', value.path.join('.'));
    return node;
  }

  static formats(node: HTMLElement): SelectedValue {
    return {
      source: node.getAttribute('data-source') as any,
      id:     node.getAttribute('data-id')     || '',
      label:  node.getAttribute('data-label')  || '',
      type:   node.getAttribute('data-type')   || undefined,
      path:   node.getAttribute('data-path')?.split('.').filter(Boolean) || [],
    };
  }

  /** Re-apply attributes when format is set on the blot. */
  format(name: string, value: any) {
    if (name === VariableBlot.blotName && value) {
      const node = this['domNode'] as HTMLElement;
      node.setAttribute('data-source', value.source);
      node.setAttribute('data-id',     value.id);
      node.setAttribute('data-label',  value.label);
      if (value.type)         node.setAttribute('data-type', value.type);
      if (value.path?.length) node.setAttribute('data-path', value.path.join('.'));
    } else {
      super.format(name, value);
    }
  }
}

// Order matters — variables must allow other inline formats (bold/italic/etc.)
// to wrap THEM, not the other way around. Lower number = inner blot.
(VariableBlot as any).order =
  ['cursor', 'inline', 'underline', 'strike', 'italic', 'bold', 'script', 'variable', 'link', 'code'];

if (!(Quill as any).imports['formats/variable']) {
  Quill.register(VariableBlot as any);
}

/** Build the visible {{...}} text for a variable token. */
function buildTokenText(value: SelectedValue): string {
  const pathPart    = value.path?.length ? value.path.join('.') + '.' : '';
  const arraySuffix = (value.type === 'array' || value.type === 'string-array') ? '[]' : '';
  return `{{${value.source}.${pathPart}${value.id}${arraySuffix}}}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-piped-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule, DataSourceSelectorComponent],
  template: `
    <div class="pe-wrap">

      <label *ngIf="label" class="pe-label">{{ label }}</label>

      <div class="pe-helper" *ngIf="showHelper">
        <strong>Insert:</strong> Type <kbd>/</kbd> or click <strong>Insert Variable</strong>.
        <strong>Format:</strong> Click any variable to select it, then bold/italicize/colour from the toolbar — formatting applies to the whole token.
        <strong>Edit:</strong> Variables can't be edited inline; one backspace deletes the whole token.
        <strong>Arrays:</strong> tokens with a dashed underline expand into a list at render time.
      </div>

      <div class="pe-editor-host" #editorHost>
        <p-editor
          #editor
          [(ngModel)]="html"
          (onInit)="onEditorInit($event)"
          (onTextChange)="onTextChange($event)"
          [style]="{ height: height }"
          [placeholder]="placeholder"
        >
          <ng-template #header>
            <!-- Standard toolbar (no Image / Code / Font) -->
            <span class="ql-formats">
              <select class="ql-header" aria-label="Heading">
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option selected>Normal</option>
              </select>
            </span>
            <span class="ql-formats">
              <button type="button" class="ql-bold" aria-label="Bold"></button>
              <button type="button" class="ql-italic" aria-label="Italic"></button>
              <button type="button" class="ql-underline" aria-label="Underline"></button>
              <button type="button" class="ql-strike" aria-label="Strikethrough"></button>
            </span>
            <span class="ql-formats">
              <select class="ql-color" aria-label="Text Color"></select>
              <select class="ql-background" aria-label="Background Color"></select>
            </span>
            <span class="ql-formats">
              <button type="button" class="ql-list" value="ordered" aria-label="Ordered List"></button>
              <button type="button" class="ql-list" value="bullet" aria-label="Bullet List"></button>
              <button type="button" class="ql-indent" value="-1" aria-label="Decrease Indent"></button>
              <button type="button" class="ql-indent" value="+1" aria-label="Increase Indent"></button>
            </span>
            <span class="ql-formats">
              <select class="ql-align" aria-label="Align"></select>
            </span>
            <span class="ql-formats">
              <button type="button" class="ql-link" aria-label="Insert Link"></button>
              <button type="button" class="ql-blockquote" aria-label="Blockquote"></button>
            </span>
            <span class="ql-formats">
              <button type="button" class="ql-clean" aria-label="Clear Formatting"></button>
            </span>
            <span class="ql-formats pe-toolbar-divider">
              <button type="button" class="pe-insert-btn" (click)="openSelectorFromToolbar()">
                <i class="pi pi-plus-circle"></i> Insert Variable
              </button>
            </span>
          </ng-template>
        </p-editor>

        <!-- Variable picker, anchored at the cursor when open -->
        <div
          *ngIf="selectorOpen"
          class="pe-selector-shell"
          [style.left.px]="selectorPos.left"
          [style.top.px]="selectorPos.top"
          (click)="$event.stopPropagation()"
        >
          <app-data-source-selector
            [embedded]="true"
            [openExternal]="selectorOpen"
            [workflow]="workflow"
            [geotab]="geotab"
            [json]="json"
            [showWorkflow]="enableWorkflow"
            [showJson]="enableJson"
            [showGeotab]="enableGeotab"
            [activeTab]="initialTab"
            (selectionChange)="onVariableSelected($event)"
          />
          <button class="pe-selector-cancel" type="button" (click)="closeSelector(true)">
            Cancel
          </button>
        </div>
      </div>

      <!-- Live preview — shows how the template will look when rendered with sample data.
           Wrapped in .ql-snow .ql-editor so Quill's color/background CSS classes
           (ql-color-*, ql-bg-*) apply to formatted static text. -->
      <div *ngIf="showPreview" class="pe-preview ql-snow">
        <div class="pe-preview__label">
          <i class="pi pi-eye"></i> Preview (rendered with sample values)
        </div>
        <div class="ql-editor pe-preview__content" [innerHTML]="previewHtml"></div>
      </div>

      <!-- Output panels (story only) -->
      <div *ngIf="showOutput" class="pe-output">
        <div class="pe-output__panel">
          <div class="pe-output__label">HTML output</div>
          <pre>{{ html || '(empty)' }}</pre>
        </div>
        <div class="pe-output__panel">
          <div class="pe-output__label">Token output</div>
          <pre>{{ tokenString || '(empty)' }}</pre>
        </div>
        <div class="pe-output__panel">
          <div class="pe-output__label">Structured output (JSON)</div>
          <pre>{{ structuredString || '[]' }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .pe-wrap { font-family: sans-serif; max-width: 820px; }

    .pe-label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--c-bluegray-700);
    }

    .pe-helper {
      margin-bottom: 8px;
      padding: 8px 12px;
      background: var(--c-blue-50);
      border: 1px solid var(--c-blue-200);
      border-radius: 6px;
      font-size: 12px;
      color: var(--c-blue-800);
    }
    .pe-helper kbd {
      display: inline-block;
      padding: 1px 6px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-blue-200);
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      color: var(--c-blue-700);
    }

    .pe-editor-host { position: relative; }

    /* Custom toolbar button */
    :host ::ng-deep .pe-toolbar-divider {
      border-left: 1px solid var(--c-surface-400);
      padding-left: 8px;
      margin-left: 4px;
    }
    :host ::ng-deep .pe-insert-btn {
      display: inline-flex !important;
      align-items: center;
      gap: 6px;
      padding: 4px 10px !important;
      background: var(--c-blue-500);
      color: var(--c-surface-0);
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      width: auto !important;
      height: auto !important;
    }
    :host ::ng-deep .pe-insert-btn:hover { background: var(--c-blue-700); color: var(--c-surface-0); }
    :host ::ng-deep .pe-insert-btn i { font-size: 13px; }

    /* Anchored selector — positioned at cursor by JS */
    .pe-selector-shell {
      position: absolute;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .pe-selector-cancel {
      align-self: flex-end;
      padding: 4px 12px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-500);
      border-radius: 4px;
      color: var(--c-surface-800);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }
    .pe-selector-cancel:hover { background: var(--c-surface-200); color: var(--c-bluegray-700); }

    /* ── Variable tokens — invisible by default ─────────────────────────────
       Variables render as plain text so any user-applied formatting
       (bold/italic/colour) is the only visual treatment. A subtle dotted
       underline + hover wash give a "scannable" hint without competing
       with formatting. Edits inside the {{…}} braces are locked. */
    :host ::ng-deep .pe-variable {
      text-decoration: underline dotted rgba(0, 0, 0, 0.35);
      text-underline-offset: 3px;
      cursor: default;
    }
    :host ::ng-deep .pe-variable:hover {
      background: rgba(36, 116, 187, 0.08);
      border-radius: 2px;
    }
    /* Arrays use a dashed underline so users can still spot list-expansion variables */
    :host ::ng-deep .pe-variable[data-type="array"],
    :host ::ng-deep .pe-variable[data-type="string-array"] {
      text-decoration: underline dashed rgba(147, 51, 234, 0.65);
    }

    /* ── Preview panel ── */
    .pe-preview {
      margin-top: 12px;
      padding: 14px 16px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-400);
      border-radius: 8px;
    }
    .pe-preview__label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: var(--c-surface-800);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .pe-preview__label i { color: var(--c-blue-500); font-size: 13px; }
    .pe-preview__content {
      font-size: 14px;
      color: var(--c-bluegray-900);
      line-height: 1.55;
    }
    .pe-preview__content :host ::ng-deep p,
    .pe-preview__content p { margin: 0 0 8px 0; }
    /* Preview values render as plain text — formatting comes entirely from
       whatever inline format wrappers (bold/italic/colour) the user applied. */
    :host ::ng-deep .pe-preview-var { /* nothing to style */ }

    /* Output panels */
    .pe-output {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: 14px;
    }
    .pe-output__panel {
      background: var(--c-surface-100);
      border: 1px solid var(--c-surface-400);
      border-radius: 6px;
      padding: 10px 12px;
    }
    .pe-output__label {
      font-size: 11px;
      font-weight: 700;
      color: var(--c-surface-800);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .pe-output pre {
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      color: var(--c-bluegray-900);
      white-space: pre-wrap;
      word-break: break-word;
    }
  `],
})
export class PipedEditorComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer) {}

  // ─── Inputs ─────────────────────────────────────────────────────────────────
  @Input() workflow: WorkflowData = { segments: [] };
  @Input() geotab: GeotabItem[]   = [];
  @Input() json: JsonNode[]       = [];

  /** Toggles for which data-source tabs appear in the picker. */
  @Input() enableWorkflow = true;
  @Input() enableJson     = true;
  @Input() enableGeotab   = true;

  @Input() label       = 'Message';
  @Input() placeholder = 'Start typing... press / to insert a variable.';
  @Input() height      = '260px';
  @Input() showHelper  = true;
  @Input() showOutput  = false;
  @Input() showPreview = true;
  /** Optional map of sample values used in the live preview. Keyed by token e.g. "geotab.dutyStatus". */
  @Input() previewValues: Record<string, string> = {};

  /** Pre-populate the editor with HTML (e.g. a previously saved template). */
  @Input() initialHtml = '';
  @Input() initialTab: 'workflow' | 'json' | 'geotab' = 'workflow';

  // ─── Outputs ────────────────────────────────────────────────────────────────
  /** Raw HTML from the editor. */
  @Output() htmlChange       = new EventEmitter<string>();
  /** Plain text with variables collapsed to `{{source.path.id}}` tokens. */
  @Output() tokenChange      = new EventEmitter<string>();
  /** Structured block representation. */
  @Output() structuredChange = new EventEmitter<PipedBlock[]>();

  // ─── State ──────────────────────────────────────────────────────────────────
  @ViewChild('editor') editorRef: any;
  @ViewChild('editorHost') editorHost?: ElementRef<HTMLElement>;
  quill: any;
  html = '';
  selectorOpen = false;
  selectorPos: { left: number; top: number } = { left: 0, top: 0 };
  /** Where the `/` lives in the document when the selector was opened. */
  private slashIndex: number | null = null;

  // Story-only mirrors so the output panels stay in sync
  tokenString = '';
  structuredString = '';
  previewHtml: any = '';

  ngOnInit() {
    this.html = this.initialHtml;
  }

  onEditorInit(event: any) {
    this.quill = event.editor;
    this.recomputeOutputs();

    // Escape closes selector
    this.quill.root.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.selectorOpen) {
        e.preventDefault();
        this.closeSelector(true);
      }
    });

    // Atomic backspace: when the character before the cursor lives inside a
    // .pe-variable span, delete the entire span instead of one character.
    this.quill.keyboard.addBinding({ key: 'Backspace' }, (range: any) => {
      if (!range || range.length > 0) return true;
      const formats = this.quill.getFormat(Math.max(0, range.index - 1), 1);
      if (formats?.variable) {
        const span = this.findVariableSpanAt(range.index - 1);
        if (span) {
          const len = span.textContent?.length ?? 0;
          const start = this.indexOfNode(span);
          if (start !== -1 && len > 0) {
            this.quill.deleteText(start, len, 'user');
            this.quill.setSelection(start, 0, 'user');
            return false;
          }
        }
      }
      return true;
    });

    // Click → select the whole variable so any toolbar action covers it atomically.
    this.quill.root.addEventListener('mousedown', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const span = target.closest?.('.pe-variable') as HTMLElement | null;
      if (!span || !this.quill.root.contains(span)) return;
      const blot = (Quill as any).find(span);
      if (!blot) return;
      const start = this.quill.getIndex(blot);
      const len = span.textContent?.length ?? 0;
      // Defer past Quill's own mousedown so our selection wins.
      setTimeout(() => this.quill.setSelection(start, len, 'user'), 0);
    });

    // Format normalizer — if a user's drag selection partially covers a
    // variable and they apply bold/italic/colour/etc., the format gets
    // expanded to the entire variable so it stays atomic.
    this.quill.on('text-change', (delta: any, _old: any, source: string) => {
      if (source !== 'user') return;
      this.normalizeVariableFormats(delta);
    });

    // Edit lock + format isolation. Two roles:
    //  1. Block typing while the caret sits STRICTLY inside a variable token.
    //  2. At a variable boundary (caret immediately before or after a token)
    //     clear the variable format on the cursor so the newly-typed character
     //    becomes plain static text instead of being absorbed into the token.
    this.quill.root.addEventListener('beforeinput', (e: InputEvent) => {
      const range = this.quill.getSelection();
      if (!range || range.length > 0) return;
      if (!e.inputType?.startsWith('insert')) return;
      const formats     = this.quill.getFormat(range.index, 1);
      const prevFormats = this.quill.getFormat(Math.max(0, range.index - 1), 1);
      const inside   = formats?.variable && prevFormats?.variable;
      const boundary = formats?.variable !== prevFormats?.variable;
      if (inside) {
        e.preventDefault();
      } else if (boundary) {
        this.quill.format('variable', false, 'user');
      }
    });
  }

  /** After a format change, ensure every variable touched is formatted uniformly. */
  private normalizeVariableFormats(delta: any) {
    // Collect [start, end) ranges that received formatting in this delta.
    let cursor = 0;
    const ranges: { start: number; end: number; attrs: Record<string, any> }[] = [];
    for (const op of delta?.ops ?? []) {
      if (op.retain != null && op.attributes && Object.keys(op.attributes).length) {
        ranges.push({ start: cursor, end: cursor + op.retain, attrs: op.attributes });
      }
      if (op.retain != null) cursor += op.retain;
      if (typeof op.insert === 'string') cursor += op.insert.length;
    }
    if (!ranges.length) return;

    this.quill.root.querySelectorAll('.pe-variable').forEach((span: Element) => {
      const blot = (Quill as any).find(span);
      if (!blot) return;
      const start = this.quill.getIndex(blot);
      const len = (span.textContent ?? '').length;
      const end = start + len;
      for (const r of ranges) {
        if (start >= r.end || end <= r.start) continue; // no overlap
        for (const [name, value] of Object.entries(r.attrs)) {
          if (name === 'variable') continue;
          this.quill.formatText(start, len, name, value, 'silent');
        }
      }
    });
  }

  /** Walk DOM to find the .pe-variable span containing the given Quill index. */
  private findVariableSpanAt(index: number): HTMLElement | null {
    const [leaf] = this.quill.getLeaf(index);
    let node: any = leaf?.domNode;
    while (node && node !== this.quill.root) {
      if (node.classList?.contains?.('pe-variable')) return node;
      node = node.parentNode;
    }
    return null;
  }

  /** Map a DOM element back to its Quill index. */
  private indexOfNode(node: Node): number {
    try {
      const blot = (Quill as any).find(node);
      return blot ? this.quill.getIndex(blot) : -1;
    } catch { return -1; }
  }

  onTextChange(event: any) {
    // Detect when the user typed a `/` — open the selector at the cursor.
    const range = this.quill?.getSelection();
    if (range && range.length === 0) {
      const before = this.quill.getText(Math.max(0, range.index - 1), 1);
      const justTypedSlash = event.delta?.ops?.some(
        (op: any) => typeof op.insert === 'string' && op.insert === '/'
      );
      if (before === '/' && justTypedSlash && !this.selectorOpen) {
        const slashAt = range.index - 1;
        this.slashIndex = slashAt;
        this.anchorSelectorAt(slashAt);
        this.selectorOpen = true;
      }
    }
    this.recomputeOutputs();
  }

  openSelectorFromToolbar() {
    if (!this.quill) return;
    const range = this.quill.getSelection(true);
    const insertAt: number = range?.index ?? this.quill.getLength() - 1;
    this.slashIndex = insertAt;
    this.anchorSelectorAt(insertAt);
    this.selectorOpen = true;
  }

  /** Position the picker just below the caret using Quill's bounds. */
  private anchorSelectorAt(index: number) {
    if (!this.quill || !this.editorHost) return;
    const bounds = this.quill.getBounds(index);
    const editorRoot: HTMLElement = this.quill.root; // .ql-editor
    const container = editorRoot.closest('.p-editor-container') as HTMLElement | null;
    const host = this.editorHost.nativeElement;
    if (!container || !host) return;
    const containerRect = container.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    const editorRect = editorRoot.getBoundingClientRect();
    // bounds.left/top are relative to .ql-editor
    const left = (editorRect.left - hostRect.left) + bounds.left;
    const top  = (editorRect.top  - hostRect.top)  + bounds.top + bounds.height + 6;
    // Clamp so the 420px-wide picker doesn't escape the host on the right
    const maxLeft = Math.max(0, containerRect.width - 432);
    this.selectorPos = { left: Math.min(left, maxLeft), top };
  }

  onVariableSelected(value: SelectedValue | SelectedValue[] | null) {
    if (!value || Array.isArray(value)) { this.closeSelector(false); return; }
    if (!this.quill) return;

    // If the user opened via `/`, remove it before inserting the token.
    if (this.slashIndex !== null) {
      const slashChar = this.quill.getText(this.slashIndex, 1);
      if (slashChar === '/') this.quill.deleteText(this.slashIndex, 1, 'user');
    }
    const insertAt = this.slashIndex ?? this.quill.getLength() - 1;
    const isArrayVariable = value.type === 'array' || value.type === 'string-array';
    const tokenText = buildTokenText(value);

    // Insert the token text with the `variable` inline format applied. This
    // produces <span class="pe-variable" data-...>{{...}}</span> — and crucially
    // it nests INSIDE any user-applied inline formats (bold, italic, color), so
    // formatting cascades to the visible variable text.
    this.quill.insertText(insertAt, tokenText, { variable: value }, 'user');

    // Array variables auto-wrap their line in an ordered list so users see
    // they'll expand at render time. They can switch to bullet list via the
    // toolbar afterwards.
    if (isArrayVariable) {
      this.quill.formatLine(insertAt, 1, 'list', 'ordered', 'user');
    }

    this.quill.setSelection(insertAt + tokenText.length, 0, 'user');
    // Strip the variable format from the cursor so the NEXT character the user
    // types is plain static text — Quill otherwise extends inline formats.
    this.quill.format('variable', false, 'user');
    this.closeSelector(false);
  }

  closeSelector(restoreSlash: boolean) {
    // If the user cancelled, the slash they typed stays in place — no-op needed.
    this.selectorOpen = false;
    this.slashIndex = null;
  }

  // ─── Output computation ─────────────────────────────────────────────────────
  private recomputeOutputs() {
    if (!this.quill) return;

    this.html = this.quill.root.innerHTML;
    this.htmlChange.emit(this.html);

    const tokens = this.computeTokenOutput();
    this.tokenString = tokens;
    this.tokenChange.emit(tokens);

    const blocks = this.computeStructuredOutput();
    this.structuredString = JSON.stringify(blocks, null, 2);
    this.structuredChange.emit(blocks);

    this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(this.computePreviewHtml());
  }

  /** Build a rendered preview by replacing variable tokens with their sample values. */
  private computePreviewHtml(): string {
    if (!this.quill?.root) return '';
    const clone = this.quill.root.cloneNode(true) as HTMLElement;

    clone.querySelectorAll('.pe-variable').forEach(el => {
      const source = el.getAttribute('data-source') || '';
      const id     = el.getAttribute('data-id')     || '';
      const label  = el.getAttribute('data-label')  || id;
      const path   = el.getAttribute('data-path')   || '';
      const type   = el.getAttribute('data-type')   || '';
      const tokenKey = `${source}.${path ? path + '.' : ''}${id}`;

      const isArray = type === 'array' || type === 'string-array';
      const sample =
        this.previewValues[tokenKey] ??
        this.previewValues[id] ??
        this.defaultPreviewValue(source, id, label, type);

      const span = document.createElement('span');
      span.className = 'pe-preview-var' + (isArray ? ' pe-preview-var--array' : '');
      if (source) span.setAttribute('data-source', source);
      span.textContent = isArray ? `${sample} (×N)` : sample;
      el.replaceWith(span);
    });

    return clone.innerHTML;
  }

  /** Synthesize a reasonable demo value when none is supplied via `previewValues`. */
  private defaultPreviewValue(source: string, id: string, label: string, type: string): string {
    if (type === 'date-time') return '2026-05-12 09:30';
    if (type === 'numeric')   return '42';
    if (type === 'boolean')   return 'true';
    if (id.toLowerCase().includes('email')) return 'driver@example.com';
    if (id.toLowerCase().includes('phone')) return '555-0142';
    if (id.toLowerCase().includes('city'))  return 'Atlanta';
    return label || id;
  }

  /** Replace each variable's visible {{…}} text with the canonical token string. */
  private computeTokenOutput(): string {
    const ops = this.quill.getContents()?.ops || [];
    return ops
      .map((op: any) => {
        if (typeof op.insert !== 'string') return '';
        const v: SelectedValue | undefined = op.attributes?.variable;
        if (v) return buildTokenText(v);
        return op.insert;
      })
      .join('');
  }

  /** Convert the Quill Delta into a typed block array. */
  private computeStructuredOutput(): PipedBlock[] {
    const ops = this.quill.getContents()?.ops || [];
    return ops.map((op: any): PipedBlock => {
      if (typeof op.insert !== 'string') {
        return { type: 'text', text: '', attributes: {} };
      }
      const { variable, ...otherAttrs } = (op.attributes || {});
      if (variable) {
        return { type: 'variable', value: variable, attributes: otherAttrs };
      }
      return { type: 'text', text: op.insert, attributes: otherAttrs };
    });
  }
}

/** A single chunk of the editor's output — either static text or a variable token. */
export type PipedBlock =
  | { type: 'text';     text: string;          attributes: Record<string, any> }
  | { type: 'variable'; value: SelectedValue;  attributes: Record<string, any> };

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_WORKFLOW: WorkflowData = {
  segments: [
    {
      id: 'start-load', label: 'Start Load', steps: [
        { id: 'pre-trip', label: 'Pre-trip inspection', actions: [
          { id: 'driverName',  label: 'Driver Name',  actionType: 'Input'         },
          { id: 'temperature', label: 'Temperature',  actionType: 'Temperature'   },
          { id: 'odometer',    label: 'Odometer',     actionType: 'Input'         },
          { id: 'inspected',   label: 'Inspected At', actionType: 'Date Time'     },
        ]},
        { id: 'depart', label: 'Depart', actions: [
          { id: 'departTime', label: 'Depart Time', actionType: 'Date Time' },
        ]},
      ],
    },
    {
      id: 'drop-off', label: 'Drop Off', steps: [
        { id: 'arrival', label: 'Arrival', actions: [
          { id: 'arrivalTime', label: 'Arrival Time', actionType: 'Date Time' },
          { id: 'signature',   label: 'Signature',    actionType: 'Input'     },
        ]},
      ],
    },
  ],
};

const MOCK_GEOTAB: GeotabItem[] = [
  { id: 'driveTime',     label: 'Drive Time'      },
  { id: 'dutyStatus',    label: 'Duty Status'     },
  { id: 'hosRuleset',    label: 'HOS Ruleset'     },
  { id: 'remainingDrive',label: 'Remaining drive time' },
];

const MOCK_JSON: JsonNode[] = [
  { key: 'bolNumber',    type: 'numeric'   },
  { key: 'shippingDate', type: 'date-time' },
  {
    key: 'from', type: 'object', children: [
      { key: 'company',  type: 'string' },
      { key: 'address1', type: 'string' },
      { key: 'city',     type: 'string' },
    ],
  },
  {
    key: 'to', type: 'object', children: [
      { key: 'company', type: 'string' },
      { key: 'city',    type: 'string' },
    ],
  },
  // ── Array examples ────────────────────────────────────────────────────────
  { key: 'tags',     type: 'string', isArray: true },                // array of strings
  {
    key: 'stops',    type: 'array', children: [                       // array of objects
      { key: 'order',     type: 'numeric'   },
      { key: 'city',      type: 'string'    },
      { key: 'arrivalAt', type: 'date-time' },
    ],
  },
];

// Pre-populated template — mixes static text + variable tokens.
// The `variable` format wraps the visible text inside <span class="pe-variable">,
// and inline format wrappers (<strong>/<em>) nest OUTSIDE so bold/italic apply
// to the token text the way the user expects.
const PREFILLED_HTML = `<p>Hello <span class="pe-variable" data-source="workflow" data-id="driverName" data-label="Driver Name" data-path="start-load.pre-trip">{{workflow.start-load.pre-trip.driverName}}</span>, your shipment <span class="pe-variable" data-source="json" data-id="bolNumber" data-label="bolNumber">{{json.bolNumber}}</span> is scheduled for <span class="pe-variable" data-source="json" data-id="city" data-label="city" data-path="to">{{json.to.city}}</span>.</p><p>Current duty status: <span class="pe-variable" data-source="geotab" data-id="dutyStatus" data-label="Duty Status">{{geotab.dutyStatus}}</span>. Pre-trip temperature was <strong><span class="pe-variable" data-source="workflow" data-id="temperature" data-label="Temperature" data-path="start-load.pre-trip">{{workflow.start-load.pre-trip.temperature}}</span></strong> (in <em><span class="pe-variable" data-source="workflow" data-id="temperature" data-label="Temperature" data-path="start-load.pre-trip">{{workflow.start-load.pre-trip.temperature}}</span></em>).</p>`;

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<PipedEditorComponent> = {
  title: 'Forms/Piped Editor',
  component: PipedEditorComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, EditorModule, DataSourceSelectorComponent] })],
  parameters: {
    docs: {
      description: {
        component: `
A rich-text editor that lets users combine static text with **template variables** from one of three data sources (Workflow / JSON / Geotab).

### How users interact
- Type freely to compose static text.
- Press <kbd>/</kbd> OR click the **Insert Variable** toolbar button to open the picker.
- Pick a value — it's inserted as an atomic token: \`{{workflow.start-load.pre-trip.temperature}}\`.
- One backspace deletes a whole token (atomic).
- Tokens can be formatted (bold, italic, color, etc.) using the toolbar.

### Outputs
This component emits **three** synchronized output formats so any backend can consume the content:

| Event | Format | Use when |
|---|---|---|
| \`htmlChange\` | Raw HTML with \`<span class="pe-variable">\` tokens | Re-rendering inside the same WYSIWYG |
| \`tokenChange\` | Plain string: \`Hello {{geotab.dutyStatus}}, …\` | Server-side template engines (Handlebars, Liquid, mustache) |
| \`structuredChange\` | \`PipedBlock[]\` typed JSON | Programmatic rendering (PDFs, emails) |

### Required inputs
\`\`\`typescript
@Input() workflow: WorkflowData;
@Input() geotab:   GeotabItem[];
@Input() json:     JsonNode[];
\`\`\`

### Optional toggles
\`\`\`typescript
@Input() enableWorkflow = true;  // show/hide the Workflow tab
@Input() enableJson     = true;  // show/hide the JSON tab
@Input() enableGeotab   = true;  // show/hide the Geotab tab
@Input() initialHtml    = '';    // hydrate from saved content
@Input() initialTab     = 'workflow';
\`\`\`

### Minimal usage
\`\`\`html
<app-piped-editor
  [workflow]="workflowData"
  [geotab]="geotabItems"
  [json]="jsonPayload"
  [initialHtml]="savedHtml"
  (htmlChange)="onHtml($event)"
  (tokenChange)="onTokens($event)"
  (structuredChange)="onStructured($event)"
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    enableWorkflow: { control: 'boolean' },
    enableJson:     { control: 'boolean' },
    enableGeotab:   { control: 'boolean' },
    showHelper:     { control: 'boolean' },
    showOutput:     { control: 'boolean' },
    showPreview:    { control: 'boolean' },
    height:         { control: 'text'    },
    initialTab:     { control: 'inline-radio', options: ['workflow', 'json', 'geotab'] },
  },
};

export default meta;
type Story = StoryObj<PipedEditorComponent>;

// ─── Stories ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    workflow:       MOCK_WORKFLOW,
    geotab:         MOCK_GEOTAB,
    json:           MOCK_JSON,
    enableWorkflow: true,
    enableJson:     true,
    enableGeotab:   true,
    showHelper:     true,
    showOutput:     true,
    initialHtml:    '',
    initialTab:     'workflow',
  },
  parameters: {
    docs: { description: { story: 'Empty editor with all three data sources enabled. Press `/` or click **Insert Variable** to add a token.' } },
  },
};

export const Prefilled: Story = {
  args: {
    workflow:       MOCK_WORKFLOW,
    geotab:         MOCK_GEOTAB,
    json:           MOCK_JSON,
    enableWorkflow: true,
    enableJson:     true,
    enableGeotab:   true,
    showHelper:     true,
    showOutput:     true,
    initialHtml:    PREFILLED_HTML,
    initialTab:     'workflow',
  },
  parameters: {
    docs: { description: { story: 'Demonstrates loading a saved template that already mixes static text with variables from all three data sources — including a **bolded** variable.' } },
  },
};

export const WorkflowOnly: Story = {
  args: {
    workflow:       MOCK_WORKFLOW,
    geotab:         MOCK_GEOTAB,
    json:           MOCK_JSON,
    enableWorkflow: true,
    enableJson:     false,
    enableGeotab:   false,
    showHelper:     true,
    showOutput:     true,
    initialTab:     'workflow',
  },
  parameters: {
    docs: { description: { story: 'JSON and Geotab tabs are hidden — only the Workflow source is offered.' } },
  },
};

export const JsonOnly: Story = {
  args: {
    workflow:       MOCK_WORKFLOW,
    geotab:         MOCK_GEOTAB,
    json:           MOCK_JSON,
    enableWorkflow: false,
    enableJson:     true,
    enableGeotab:   false,
    showHelper:     true,
    showOutput:     true,
    initialTab:     'json',
  },
};

export const GeotabOnly: Story = {
  args: {
    workflow:       MOCK_WORKFLOW,
    geotab:         MOCK_GEOTAB,
    json:           MOCK_JSON,
    enableWorkflow: false,
    enableJson:     false,
    enableGeotab:   true,
    showHelper:     true,
    showOutput:     true,
    initialTab:     'geotab',
  },
};

export const NoHelperNoOutput: Story = {
  args: {
    workflow:       MOCK_WORKFLOW,
    geotab:         MOCK_GEOTAB,
    json:           MOCK_JSON,
    enableWorkflow: true,
    enableJson:     true,
    enableGeotab:   true,
    showHelper:     false,
    showOutput:     false,
    initialHtml:    PREFILLED_HTML,
  },
  parameters: {
    docs: { description: { story: 'Production-style view: no helper banner, no debug output panels — what an end user would see.' } },
  },
};
