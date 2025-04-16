<template>
  <div class="ticket-list">
    <h2>Saved Tickets</h2>
    
    <div v-if="loading" class="loading">
      Loading tickets...
    </div>
    
    <div v-else-if="error" class="error">
      Error loading tickets: {{ error }}
    </div>
    
    <template v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>{{ formatDate(ticket.date) }}</td>
            <td>{{ ticket.customerName }}</td>
            <td>${{ Number(ticket.total).toFixed(2) }}</td>
            <td>
              <button @click="editTicket(ticket.id)" class="btn btn-primary btn-sm">Edit</button>
              <button @click="printTicket(ticket.id)" class="btn btn-info btn-sm">Print</button>
              <button @click="deleteTicket(ticket.id)" class="btn btn-danger btn-sm">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="tickets.length === 0" class="no-tickets">
        No tickets saved yet.
      </div>
    </template>
  </div>
</template>

<script>
import TicketService from '../services/api';

export default {
  data() {
    return {
      tickets: [],
      loading: true,
      error: null
    };
  },
  methods: {
    async loadTickets() {
      this.loading = true;
      this.error = null;
      
      try {
        this.tickets = await TicketService.getAllTickets();
      } catch (error) {
        this.error = error.message;
        console.error('Error loading tickets:', error);
      } finally {
        this.loading = false;
      }
    },
    editTicket(id) {
      this.$router.push(`/edit/${id}`);
    },
    printTicket(id) {
      this.$router.push(`/print/${id}`);
    },
    async deleteTicket(id) {
      if (confirm('Are you sure you want to delete this ticket?')) {
        try {
          await TicketService.deleteTicket(id);
          // Reload the tickets after deletion
          this.loadTickets();
        } catch (error) {
          alert(`Failed to delete ticket: ${error.message}`);
        }
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  },
  created() {
    this.loadTickets();
  }
};
</script>

<style>
.ticket-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.no-tickets {
  text-align: center;
  margin-top: 20px;
  color: #666;
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
</style>