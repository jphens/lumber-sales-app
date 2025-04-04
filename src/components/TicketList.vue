<template>
    <div class="ticket-list">
      <h2>Saved Tickets</h2>
      
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
            <td>{{ ticket.date }}</td>
            <td>{{ ticket.customerName }}</td>
            <td>${{ ticket.total.toFixed(2) }}</td>
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
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tickets: []
      };
    },
    methods: {
      loadTickets() {
        this.tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      },
      editTicket(id) {
        this.$router.push(`/edit/${id}`);
      },
      printTicket(id) {
        this.$router.push(`/print/${id}`);
      },
      deleteTicket(id) {
        if (confirm('Are you sure you want to delete this ticket?')) {
          const tickets = this.tickets.filter(ticket => ticket.id !== id);
          localStorage.setItem('tickets', JSON.stringify(tickets));
          this.loadTickets();
        }
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
  </style>