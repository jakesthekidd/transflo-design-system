import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

// ─── Editor Wrapper Component ─────────────────────────────────────────────────
@Component({
  selector: 'sb-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
  template: `
    <div class="editor-wrap">
      <label *ngIf="label" class="editor-wrap__label">{{ label }}</label>

      <p-editor
        [(ngModel)]="value"
        [readonly]="readonly"
        [style]="{ height: height }"
        [placeholder]="placeholder"
      >
        <ng-template *ngIf="toolbarVariant === 'basic'" #header>
          <span class="ql-formats">
            <button type="button" class="ql-bold" aria-label="Bold"></button>
            <button type="button" class="ql-italic" aria-label="Italic"></button>
            <button type="button" class="ql-underline" aria-label="Underline"></button>
          </span>
        </ng-template>

        <ng-template *ngIf="toolbarVariant === 'minimal'" #header>
          <span class="ql-formats">
            <button type="button" class="ql-bold" aria-label="Bold"></button>
            <button type="button" class="ql-italic" aria-label="Italic"></button>
          </span>
          <span class="ql-formats">
            <button type="button" class="ql-list" value="ordered" aria-label="Ordered List"></button>
            <button type="button" class="ql-list" value="bullet" aria-label="Bullet List"></button>
          </span>
          <span class="ql-formats">
            <button type="button" class="ql-link" aria-label="Insert Link"></button>
          </span>
        </ng-template>

        <ng-template *ngIf="toolbarVariant === 'standard'" #header>
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
        </ng-template>
      </p-editor>

      <div *ngIf="showOutput" class="editor-wrap__output">
        <div class="editor-wrap__output-label">Output (HTML):</div>
        <pre>{{ value || '(empty)' }}</pre>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .editor-wrap {
      max-width: 720px;
      font-family: sans-serif;
    }
    .editor-wrap__label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
    }
    .editor-wrap__output {
      margin-top: 12px;
      padding: 10px 12px;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      font-size: 12px;
      color: #374151;
    }
    .editor-wrap__output-label {
      font-weight: 600;
      margin-bottom: 4px;
      color: #6B7280;
    }
    .editor-wrap__output pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
  `],
})
export class EditorStoryComponent {
  @Input() label = 'Description';
  @Input() value = '';
  @Input() placeholder = 'Type something...';
  @Input() height = '220px';
  @Input() readonly = false;
  @Input() showOutput = false;
  @Input() toolbarVariant: 'full' | 'standard' | 'basic' | 'minimal' = 'full';
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<EditorStoryComponent> = {
  title: 'Forms/Editor',
  component: EditorStoryComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FormsModule, EditorModule],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'PrimeNG Editor based on Quill.js. Rich text editor for formatting paragraph input — supports bold, italic, lists, links, headings, and more. Binds to `ngModel` with HTML output.',
      },
    },
  },
  argTypes: {
    label:          { control: 'text' },
    value:          { control: 'text' },
    placeholder:    { control: 'text' },
    height:         { control: 'text' },
    readonly:       { control: 'boolean' },
    showOutput:     { control: 'boolean' },
    toolbarVariant: { control: 'inline-radio', options: ['full', 'standard', 'basic', 'minimal'] },
  },
};

export default meta;
type Story = StoryObj<EditorStoryComponent>;

export const Default: Story = {
  args: {
    label: 'Description',
    value: '',
    placeholder: 'Type something...',
    height: '220px',
    readonly: false,
    showOutput: false,
    toolbarVariant: 'full',
  },
  parameters: {
    docs: { description: { story: 'Default editor with the full PrimeNG/Quill toolbar.' } },
  },
};

export const WithContent: Story = {
  args: {
    label: 'Description',
    value:
      '<h2>Welcome to the editor</h2><p>You can <strong>bold</strong>, <em>italicize</em>, and <u>underline</u> text. Create lists:</p><ul><li>Item one</li><li>Item two</li></ul>',
    height: '260px',
    showOutput: true,
    toolbarVariant: 'full',
  },
  parameters: {
    docs: { description: { story: 'Editor preloaded with formatted HTML content. The output panel shows the underlying HTML.' } },
  },
};

export const StandardToolbar: Story = {
  args: {
    label: 'Description',
    value: '',
    placeholder: 'Type your description...',
    height: '240px',
    toolbarVariant: 'standard',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Practical toolbar with headings, text formatting, color, lists, indent, align, link, blockquote, and clear formatting. Omits Image, Code block, and Font family picker for a cleaner editing experience.',
      },
    },
  },
};

export const BasicToolbar: Story = {
  args: {
    label: 'Comment',
    value: '',
    placeholder: 'Add a quick comment...',
    height: '160px',
    toolbarVariant: 'basic',
  },
  parameters: {
    docs: { description: { story: 'Trimmed toolbar with only bold, italic, and underline — useful for simple comment fields.' } },
  },
};

export const MinimalToolbar: Story = {
  args: {
    label: 'Notes',
    value: '',
    placeholder: 'Jot down notes...',
    height: '180px',
    toolbarVariant: 'minimal',
  },
  parameters: {
    docs: { description: { story: 'Curated toolbar: text formatting + lists + links only.' } },
  },
};

export const Readonly: Story = {
  args: {
    label: 'Posted by John',
    value:
      '<p>This is a <strong>read-only</strong> view of formatted content. Useful for displaying user-generated rich text without allowing edits.</p>',
    height: '160px',
    readonly: true,
    toolbarVariant: 'full',
  },
  parameters: {
    docs: { description: { story: 'Readonly mode — toolbar is hidden and content cannot be edited.' } },
  },
};

export const TallEditor: Story = {
  args: {
    label: 'Article body',
    value: '',
    placeholder: 'Write your article...',
    height: '400px',
    showOutput: false,
    toolbarVariant: 'full',
  },
  parameters: {
    docs: { description: { story: 'Tall editor for long-form content like articles or detailed notes.' } },
  },
};
