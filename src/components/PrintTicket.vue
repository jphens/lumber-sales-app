<template>
    <div class="print-ticket">
      <div class="print-controls d-print-none">
        <button @click="goBack" class="btn btn-secondary">Back</button>
        <button @click="print" class="btn btn-primary ml-2">Print</button>
      </div>
      
      <div class="ticket-container">
        <div class="company-header">
          <h1>Lumber Sales Receipt</h1>
          <p>Your Company Name</p>
          <p>123 Wood Lane, Timber City</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        
        <div class="ticket-details">
          <div class="row">
            <div class="col-md-6">
              <strong>Customer:</strong> {{ ticket.customerName }}<br>
              <strong>Phone:</strong> {{ ticket.customerPhone }}
            </div>
            <div class="col-md-6 text-right">
              <strong>Ticket #:</strong> {{ ticket.id }}<br>
              <strong>Date:</strong> {{ formatDate(ticket.date) }}
            </div>
          </div>
        </div>
        
        <div class="lumber-items mt-4">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Qty</th>
                <th>Dimensions (inches)</th>
                <th>Length (ft)</th>
                <th>Board Feet</th>
                <th>Price/BF</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in ticket.items" :key="index">
                <td>{{ item.quantity }}</td>
                <td>{{ item.width }} × {{ item.height }}</td>
                <td>{{ item.length }}</td>
                <td>{{ calculateBoardFeet(item).toFixed(2) }}</td>
                <td>${{ item.pricePerBF.toFixed(2) }}</td>
                <td>${{ item.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="totals mt-4">
          <div class="row">
            <div class="col-md-6 offset-md-6">
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th>Subtotal:</th>
                    <td>${{ calculateSubtotal().toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <th>Tax (0%):</th>
                    <td>$0.00</td>
                  </tr>
                  <tr>
                    <th>Total:</th>
                    <td>${{ ticket.total.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="footer mt-5">
          <p><em>Thank you for your business!</em></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PrintTicket',
    props: {
      id: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        ticket: {
          id: '',
          customerName: '',
          customerPhone: '',
          date: '',
          items: [],
          total: 0
        }
      };
    },
    methods: {
      loadTicket() {
        const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        const ticket = tickets.find(t => t.id.toString() === this.id.toString());
        
        if (ticket) {
          this.ticket = ticket;
        } else {
          alert('Ticket not found!');
          this.$router.push('/list');
        }
      },
      calculateBoardFeet(item) {
        return (item.width * item.height * item.length) / 12;
      },
      calculateSubtotal() {
        return this.ticket.total;
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
      print() {
        window.print();
      },
      goBack() {
        this.$router.push('/list');
      }
    },
    created() {
      this.loadTicket();
    }
  };
  </script>
  
  <style>
  .print-ticket {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .print-controls {
    margin-bottom: 20px;
  }
  
  .company-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .company-header p {
    margin: 0;
  }
  
  .ticket-details {
    margin-bottom: 20px;
  }
  
  .footer {
    text-align: center;
  }
  
  @media print {
    .print-controls {
      display: none;
    }
    
    body {
      font-size: 12pt;
    }
    
    .print-ticket {
      padding: 0;
    }
  }
  </style>