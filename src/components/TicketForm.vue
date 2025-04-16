<template>
  <div class="ticket-form">
    <h2>{{ isEditMode ? 'Edit' : 'New' }} Lumber Sales Ticket</h2>
    
    <div v-if="loading" class="loading">
      Loading ticket data...
    </div>
    
    <div v-else-if="error" class="error">
      Error: {{ error }}
    </div>
    
    <template v-else>
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
              <th>Price/TBF</th>
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
        <button @click="saveTicket" class="btn btn-success" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Ticket' }}
        </button>
        <button @click="printTicket" class="btn btn-info">Print Ticket</button>
        <button @click="cancel" class="btn btn-secondary">Cancel</button>
      </div>
    </template>
  </div>
</template>

<script>
import TicketService from '../services/api';

export default {
  props: {
    id: {
      type: [String, Number],
      required: false
    }
  },
  data() {
    return {
      ticket: {
        id: this.generateId(),
        customerName: '',
        customerPhone: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
        total: 0
      },
      isEditMode: false,
      loading: false,
      saving: false,
      error: null
    };
  },
  methods: {
    generateId() {
      return 'T' + Date.now().toString();
    },
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
      item.total = boardFeet * (item.pricePerBF) / 1000 * item.quantity;
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
    async saveTicket() {
      this.saving = true;
      try {
        if (this.isEditMode) {
          // Update existing ticket
          await TicketService.updateTicket(this.id, {
            customerName: this.ticket.customerName,
            customerPhone: this.ticket.customerPhone,
            date: this.ticket.date,
            total: this.ticket.total,
            items: this.ticket.items
          });
          alert('Ticket updated!');
        } else {
          // Create new ticket
          await TicketService.createTicket(this.ticket);
          alert('Ticket saved!');
          this.resetForm();
        }
        this.$router.push('/list');
      } catch (error) {
        alert(`Failed to save ticket: ${error.message}`);
      } finally {
        this.saving = false;
      }
    },
    printTicket() {
      if (this.isEditMode) {
        this.$router.push(`/print/${this.id}`);
      } else {
        window.print();
      }
    },
    cancel() {
      this.$router.push('/list');
    },
    resetForm() {
      this.ticket = {
        id: this.generateId(),
        customerName: '',
        customerPhone: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
        total: 0
      };
      this.addItem();
    },
    async loadTicket() {
      if (!this.id) return;
      
      this.isEditMode = true;
      this.loading = true;
      
      try {
        const ticket = await TicketService.getTicket(this.id);
        this.ticket = ticket;
      } catch (error) {
        this.error = `Failed to load ticket: ${error.message}`;
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    // Start with one empty item if not in edit mode
    if (!this.id) {
      this.addItem();
    } else {
      this.loadTicket();
    }
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
.loading, .error {
  text-align: center;
  margin: 20px 0;
  padding: 10px;
}
.error {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
@media print {
  .actions, button {
    display: none;
  }
}
</style>