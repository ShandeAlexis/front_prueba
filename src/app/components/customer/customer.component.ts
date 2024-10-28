import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
interface Customer {
  id?: number;
  name: string;
  email: string;
}
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  newCustomer: Customer = { name: '', email: '' };
  editingCustomer: Customer | null = null; 

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }

  addCustomer(): void {
    this.customerService.addCustomer(this.newCustomer).subscribe((customer) => {
      this.customers.push(customer);
      this.newCustomer = { name: '', email: '' };
    });
  }

  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id).subscribe(() => {
      this.customers = this.customers.filter((c) => c.id !== id);
    });
  }


  editCustomer(customer: Customer): void {
    this.editingCustomer = { ...customer }; 
    this.newCustomer = { name: customer.name, email: customer.email }; 
  }


  updateCustomer(): void {
    if (this.editingCustomer) {
      this.customerService.updateCustomer(this.editingCustomer.id!, this.newCustomer).subscribe((updatedCustomer) => {
        const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
          this.customers[index] = updatedCustomer; 
        }
        this.cancelEdit(); 
      });
    }
  }

  cancelEdit(): void {
    this.editingCustomer = null;
    this.newCustomer = { name: '', email: '' };
  }
}