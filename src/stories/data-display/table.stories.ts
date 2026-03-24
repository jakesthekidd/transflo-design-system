import type { Meta, StoryObj } from '@storybook/angular';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Table',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const products = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299, status: 'In Stock' },
  { id: 2, name: 'Wireless Mouse', category: 'Accessories', price: 29, status: 'In Stock' },
  { id: 3, name: 'USB-C Hub', category: 'Accessories', price: 49, status: 'Low Stock' },
  { id: 4, name: '4K Monitor', category: 'Electronics', price: 599, status: 'Out of Stock' },
  { id: 5, name: 'Mechanical Keyboard', category: 'Accessories', price: 149, status: 'In Stock' },
];

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { products },
    template: `
      <p-table [value]="products" [tableStyle]="{'min-width': '50rem'}">
        <ng-template #header>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </ng-template>
        <ng-template #body let-product>
          <tr>
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price | currency }}</td>
            <td>{{ product.status }}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
  }),
};

export const Striped: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { products },
    template: `
      <p-table [value]="products" [tableStyle]="{'min-width': '50rem'}" styleClass="p-datatable-striped">
        <ng-template #header>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </ng-template>
        <ng-template #body let-product>
          <tr>
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price | currency }}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
  }),
};

export const WithPagination: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: { products },
    template: `
      <p-table [value]="products" [paginator]="true" [rows]="3" [tableStyle]="{'min-width': '50rem'}">
        <ng-template #header>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </ng-template>
        <ng-template #body let-product>
          <tr>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price | currency }}</td>
          </tr>
        </ng-template>
      </p-table>
    `,
  }),
};

export const WithTagStatus: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableModule, TagModule] },
    applicationConfig: { providers: [provideAnimationsAsync()] },
    props: {
      products,
      getSeverity: (status: string) => {
        switch (status) {
          case 'In Stock': return 'success';
          case 'Low Stock': return 'warn';
          case 'Out of Stock': return 'danger';
          default: return null;
        }
      },
    },
    template: `
      <p-table [value]="products" [tableStyle]="{'min-width': '50rem'}">
        <ng-template #header>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </ng-template>
        <ng-template #body let-product>
          <tr>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price | currency }}</td>
            <td>
              <p-tag [value]="product.status" [severity]="getSeverity(product.status)" />
            </td>
          </tr>
        </ng-template>
      </p-table>
    `,
  }),
};
