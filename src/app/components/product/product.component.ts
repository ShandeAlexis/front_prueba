import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

interface Product {
  id?: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { name: '', price: 0 };
  editingProduct: Product | null = null; 

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe((product) => {
      this.products.push(product);
      this.newProduct = { name: '', price: 0 };
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter((p) => p.id !== id);
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product }; 
    this.newProduct = { name: product.name, price: product.price }; 
  }

 
  updateProduct(): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id!, this.newProduct).subscribe((updatedProduct) => {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct; 
        }
        this.cancelEdit(); 
      });
    }
  }

 
  cancelEdit(): void {
    this.editingProduct = null;
    this.newProduct = { name: '', price: 0 };
  }
}