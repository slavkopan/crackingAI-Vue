<template>
  <b-container fluid>
    <div>
      <b-row>
        <b-col sm="12" md="6" lg="6" xl="6">
          <h1 class="update-card-header">Update Credit Card</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12" md="6" lg="6" xl="6" class="mt-5">
         <h2 class="current-card-header">Current Card</h2>
         <p>Current card on file is a {{curUser.card.brand}} ending in the digits {{curUser.card.last4}}.</p>
        </b-col>
      </b-row>
      <b-row class="mt-5 ml-0">
        <b-col sm="12" md="6" lg="6" xl="6">
          <p class="card-details-title">Please enter in the new card information below</p>
          <div>
            <form @submit="updateCard">
              <b-col sm="12" md="9" lg="4" xl="4" class="mb-5 p-0">
                <label class="same-label">NAME ON CARD</label>
                <b-input id="cardName" class="name-input" required></b-input>
              </b-col>
              <div class="d-flex mb-5">
                <b-col sm="10" md="8" lg="6" xl="6" class="p-0">
                  <label class="same-label">CREDIT CARD NUMBER</label>
                  <label class="fieldset">
                    <div id="card-number-element" class="field"></div>
                    <span class="brand">
                      <b-img src="/static/assets/img/icon/card-icon.png"></b-img>
                    </span>
                  </label>
                </b-col>
                <b-col sm="2" md="3" lg="2" xl="2" >
                  <!-- <label class="same-label">CVC</label>
                  <b-input id="cardCvv" class="card-cvc cvc-input" placeholder="CVC" required></b-input> -->
                  <label class="same-label">CVC</label>
                  <label class="fieldset">
                    <div id="card-cvc-element" class="field"></div>
                  </label>
                </b-col>
              </div>
              <div class="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-5 p-0">
                <label class="same-label">EXPIRATION</label>
                <label class="fieldset">
                  <div id="card-expiry-element" class="field"></div>
                </label>
              </div>
              <div id="card-errors" role="alert">{{cardError}}</div>
              <div class="justify-content-end d-flex mb-5">
                <!-- <b-button class="btn-checkout">Checkout
                </b-button> -->
                <b-button type="submit" class="btn-checkout" :disabled="isLoading">
                  <b-spinner v-if="isLoading" style="width: 2rem; height: 2rem;" label="Spinning"></b-spinner>
                  <span v-else>Update Card</span>
                </b-button>
              </div>
            </form>
          </div>
        </b-col>
      </b-row>
    </div>
    <b-modal ref="update-card-modal" ok-only hide-header no-close-on-backdrop @ok="onModalClose()">Card details updated successfully</b-modal>
  </b-container>
</template>

<script>
import StripeService from "../services/stripeService";
import UserService from '../services/userService.js'
import { mapGetters } from "vuex";

export default {
  name: 'UpdateCardDetails',
  data() {
    return {
      cardError: "",
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: "loggedIn",
      curUser: "getCurrentUser",
    })
  },
  methods: {
    createStripeElement() {
      const elementStyles = {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          lineHeight: '40px',
          fontWeight: 300,
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '15px',

          '::placeholder': {
            color: '#686868',
          },
        },
      };

      setTimeout(() => {
        this.cardElement = this.elements.create('cardNumber', {
          style: elementStyles
        });
        this.cardElement.mount('#card-number-element');

        const cardCvc = this.elements.create('cardCvc', {
          style: elementStyles
        });
        cardCvc.mount('#card-cvc-element');

        const cardExpiry = this.elements.create('cardExpiry', {
          style: elementStyles
        });
        cardExpiry.mount('#card-expiry-element');

        this.cardElement.on('change', this.showCardError);
      })
    },
    showCardError(event) {
      if (event.error) {
        this.cardError = event.error.message;
      } else {
        this.cardError = "";
      }
    },
    generateCardObj(paymentMethod){
      const card = paymentMethod.card;
      return {
        paymentMethodId: paymentMethod.id,
        card: {
          brand: card.brand,
          country: card.country,
          last4: card.last4
        }
      }
    },
    async updateCard(e) {
      e.preventDefault();
      this.isLoading = true;
      try {
        const result = await this.stripe.createPaymentMethod({
          type: 'card',
          card: this.cardElement,
          billing_details: {
            name: "billingName",
          },
        });
        if (result.error) {
          this.isLoading = false;
          this.showCardError(result);
        } else {
          const updateData = this.generateCardObj(result.paymentMethod);
          const data = {
            customerId: this.curUser.customerId,
            paymentMethodId: result.paymentMethod.id
          };
          const response = await StripeService.updateCard(data);
          if(response.data.error) {
            // if error occured when updating card details
            this.isLoading = false;
            this.cardError = response.data.error.message;
          } else {
            const updateUserData = {
              card: {...updateData.card},
              paymentMethodId: updateData.paymentMethodId
            }
            UserService.updateCurrentUser(updateUserData, () => {
              this.$store.dispatch('refreshUserState');
              this.isLoading = false;
              this.$refs['update-card-modal'].show();
            });
          }
        }
      } catch(error) {
        this.isLoading = false;
        this.cardError = error;
      }
    },
    onModalClose() {
      this.$router.push('allproblems');
    }
  },
  mounted() {
    this.stripe = StripeService.getStripe();
    this.elements = this.stripe.elements();
    this.createStripeElement();
  },
}
</script>

<style scoped>
@import '../assets/css/UpdateCardDetails.css';
</style>