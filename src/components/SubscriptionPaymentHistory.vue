<template>
  <b-container fluid>
    <div>
      <h1 class="title">Billing History</h1>
    </div>
    <div class="mt-5">
      <b-row>
        <b-col sm="6" md="4" lg="4" xl="4">
          <h4>Date</h4>
        </b-col>
        <b-col sm="6" md="4" lg="4" xl="4">
          <h4>Amount</h4>
        </b-col>
      </b-row>
      <template v-if="userTransactionList.length > 0">
        <b-row class="mt-3" v-for="(transaction, index) of userTransactionList" :key="index">
        <b-col sm="6" md="4" lg="4" xl="4">
          <p>{{formatDate(transaction.created)}}</p>
        </b-col>
        <b-col sm="1" md="1" lg="1" xl="1">
          <p>${{transaction.amount_paid/100}}</p>
        </b-col>
        <b-col sm="1" md="1" lg="1" xl="1">
          <p class="transaction-status">Paid</p>
        </b-col>
      </b-row>
      </template>
    </div>
  </b-container>
</template>

<script>
import StripeService from "../services/stripeService";
import { mapGetters } from "vuex";

export default {
  name: 'SubscriptionPaymentHistory',
  data() {
    return {
      userTransactionList: []
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: "loggedIn",
      curUser: "getCurrentUser",
    })
  },
  mounted() {
    if(this.curUser.customerId) {
      this.getCustomerTransactionList();
    }
  },
  methods: {
    async getCustomerTransactionList() {
      try {
        const response = await StripeService.getCustomerTranscationList(this.curUser.customerId);
        if(!response.data.error) {
          this.userTransactionList = [...response.data.transactionList]; 
        }
      } catch(e) {
        console.log('this is error', e);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      let month = date.getMonth() + 1;
      let monthName = date.toLocaleString('default', { month: 'long' });
      let day = String(date.getDate()).padStart(2, '0');
      let year = date.getFullYear();
      const output = `${monthName} ${day}, ${year}`;
      return output
    }
  }
}
</script>

<style scoped>
  .title {
    font-family: 'Nokora', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    line-height: 40px;
    color: #333333;
  }
  .transaction-status {
    background: #25d425;
    border-radius: 30px;
    text-align: center;
    width: 60px;
  }
</style>