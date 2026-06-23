import { Meta, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

// ─── Side Nav Component ───────────────────────────────────────────────────────
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    <nav class="side-nav">

      <!-- Logo -->
      <div class="side-nav__logo">
        <div class="side-nav__logo-mark">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="var(--c-blue-500)"/>
            <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
              font-family="Arial, sans-serif" font-weight="800" font-size="18" fill="white">T</text>
          </svg>
        </div>
      </div>

      <!-- Primary Nav Items -->
      <div class="side-nav__items">
        <button
          *ngFor="let item of navItems"
          class="side-nav__item"
          [class.side-nav__item--active]="activeItem === item.id"
          [pTooltip]="item.label"
          tooltipPosition="right"
          (click)="activeItem = item.id"
        >
          <i [class]="item.icon"></i>
        </button>
      </div>

      <!-- Bottom Utilities -->
      <div class="side-nav__bottom">
        <button class="side-nav__item" pTooltip="Settings" tooltipPosition="right">
          <i class="pi pi-cog"></i>
        </button>
        <div class="side-nav__avatar">
          <span>JS</span>
        </div>
      </div>

    </nav>
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .side-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 66px;
      height: 100%;
      background: var(--c-surface-0);
      border-right: 1px solid var(--c-surface-400);
      padding: 12px 0;
      box-sizing: border-box;
    }

    .side-nav__logo {
      margin-bottom: 24px;
    }

    .side-nav__logo-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }

    .side-nav__items {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
      width: 100%;
      padding: 0 8px;
      box-sizing: border-box;
    }

    .side-nav__item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--c-surface-800);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      font-size: 18px;
    }

    .side-nav__item:hover {
      background: var(--c-surface-200);
      color: var(--c-bluegray-700);
    }

    .side-nav__item--active {
      background: var(--c-blue-50);
      color: var(--c-blue-500);
    }

    .side-nav__item--active:hover {
      background: var(--c-blue-100);
      color: var(--c-blue-700);
    }

    .side-nav__bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      width: 100%;
      box-sizing: border-box;
    }

    .side-nav__avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--c-bluegray-700);
      color: var(--c-surface-0);
      font-size: 11px;
      font-weight: 700;
      font-family: sans-serif;
      cursor: pointer;
      letter-spacing: 0.5px;
    }
  `],
})
export class SideNavComponent {
  @Input() activeItem = 'workflows';

  navItems = [
    { id: 'loads',     icon: 'pi pi-truck',      label: 'Loads'     },
    { id: 'workflows', icon: 'pi pi-share-alt',   label: 'Workflows' },
    { id: 'reports',   icon: 'pi pi-chart-bar',   label: 'Reports'   },
    { id: 'documents', icon: 'pi pi-file',        label: 'Documents' },
  ];
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<SideNavComponent> = {
  title: 'App Shell/Side Nav',
  component: SideNavComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  decorators: [],
};

export default meta;
type Story = StoryObj<SideNavComponent>;

export const Default: Story = {
  args: { activeItem: 'workflows' },
  parameters: {
    docs: { description: { story: 'Default side nav with Workflows active.' } },
  },
};

export const LoadsActive: Story = {
  args: { activeItem: 'loads' },
  parameters: {
    docs: { description: { story: 'Side nav with Loads active.' } },
  },
};

export const ReportsActive: Story = {
  args: { activeItem: 'reports' },
  parameters: {
    docs: { description: { story: 'Side nav with Reports active.' } },
  },
};
