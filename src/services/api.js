// API service for communicating with the backend
import config from '../config';

// Base URL for API requests
const API_URL = config.apiUrl;

/**
 * API service for ticket operations
 */
const TicketService = {
  /**
   * Get all tickets
   * @returns {Promise<Array>} Array of ticket objects
   */
  async getAllTickets() {
    try {
      const response = await fetch(`${API_URL}/tickets`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      throw error;
    }
  },

  /**
   * Get a ticket by ID
   * @param {string} id - Ticket ID
   * @returns {Promise<Object>} Ticket object
   */
  async getTicket(id) {
    try {
      const response = await fetch(`${API_URL}/tickets/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ticket ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new ticket
   * @param {Object} ticket - Ticket data
   * @returns {Promise<Object>} Created ticket
   */
  async createTicket(ticket) {
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  },

  /**
   * Update an existing ticket
   * @param {string} id - Ticket ID
   * @param {Object} ticket - Updated ticket data
   * @returns {Promise<Object>} Updated ticket
   */
  async updateTicket(id, ticket) {
    try {
      const response = await fetch(`${API_URL}/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to update ticket ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a ticket
   * @param {string} id - Ticket ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTicket(id) {
    try {
      const response = await fetch(`${API_URL}/tickets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(`Failed to delete ticket ${id}:`, error);
      throw error;
    }
  }
};

export default TicketService;