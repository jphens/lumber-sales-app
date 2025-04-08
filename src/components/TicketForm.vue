<template>
    <div class="ticket-form">
      <h2>New Lumber Sales Ticket</h2>
      
      <div class="customer-info">
        <div class="form-group">
          <label>Customer Name</label>
          <input v-model="ticket.customerName" class="form-control" />
        </div>
        <div class="form-group">
          <label>Customer Phone</label>
          <input v-model="ticket.customerPhone" class="form-control" />
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" v-model="ticket.date" class="form-control" />
        </div>
      </div>
      
      <h3>Lumber Items</h3>
      <div class="lumber-items">
        <table class="table">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Width (inches)</th>
              <th>Height (inches)</th>
              <th>Length (feet)</th>
              <th>Price/MBF</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in ticket.items" :key="index">
              <td>
                <input type="number" v-model.number="item.quantity" class="form-control" @change="calculateItemTotal(index)" />
              </td>
              <td>
                <input type="number" v-model.number="item.width" class="form-control" @change="calculateItemTotal(index)" />
              </td>
              <td>
                <input type="number" v-model.number="item.height" class="form-control" @change="calculateItemTotal(index)" />
              </td>
              <td>
                <input type="number" v-model.number="item.length" class="form-control" @change="calculateItemTotal(index)" />
              </td>
              <td>
                <input type="number" v-model.number="item.pricePerBF" class="form-control" @change="calculateItemTotal(index)" />
              </td>
              <td>${{ item.total.toFixed(2) }}</td>
              <td>
                <button @click="removeItem(index)" class="btn btn-danger btn-sm">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="addItem" class="btn btn-primary">Add Item</button>
      </div>
      
      <div class="totals">
        <h3>Total: ${{ calculateTotal().toFixed(2) }}</h3>
      </div>
      
      <div class="actions">
        <button @click="saveTicket" class="btn btn-success">Save Ticket</button>
        <button @click="printTicket" class="btn btn-info">Print Ticket</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        ticket: {
          id: Date.now(),
          customerName: '',
          customerPhone: '',
          date: new Date().toISOString().substr(0, 10),
          items: [],
          total: 0
        }
      };
    },
    methods: {
      addItem() {
        this.ticket.items.push({
          quantity: 1,
          width: 2,
          height: 4,
          length: 8,
          pricePerBF: 1.00,
          total: 0
        });
        this.calculateItemTotal(this.ticket.items.length - 1);
      },
      removeItem(index) {
        this.ticket.items.splice(index, 1);
        this.calculateTotal();
      },
      calculateItemTotal(index) {
        const item = this.ticket.items[index];
        // Board Feet calculation: (Width × Height × Length) / 12
        const boardFeet = (item.width * item.height * item.length) / 12;
        item.total = boardFeet * (item.pricePerBF)/1000 * item.quantity;
        this.calculateTotal();
      },
      calculateTotal() {
        let total = 0;
        this.ticket.items.forEach(item => {
          total += item.total;
        });
        this.ticket.total = total;
        return total;
      },
      saveTicket() {
        // Basic implementation - save to localStorage
        const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        tickets.push(this.ticket);
        localStorage.setItem('tickets', JSON.stringify(tickets));
        alert('Ticket saved!');
        this.resetForm();
      },
      printTicket() {
        window.print();
      },
      resetForm() {
        this.ticket = {
          id: Date.now(),
          customerName: '',
          customerPhone: '',
          date: new Date().toISOString().substr(0, 10),
          items: [],
          total: 0
        };
      }
    },
    created() {
      // Start with one empty item
      this.addItem();
    }
  };
  </script>
  
  <style>
  .ticket-form {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }
  .customer-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }
  .actions {
    margin-top: 20px;
  }
  .actions button {
    margin-right: 10px;
  }
  @media print {
    .actions, button {
      display: none;
    }
  }
  </style>