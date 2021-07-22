<template>
  <b-container fluid class="min-height" v-bind:class="{ 'background-theme': !checkout }">
    <div v-if="!checkout">
      <div class="header-text justify-content-center">
        <p v-if="!(curUser && curUser.hasOwnProperty('subscription'))">Find a premium plan that works best for you!</p>
      </div>
      <b-row class="justify-content-center align-items-center" align-v="center" align-h="center">
        <b-col md="6" xl="3" lg="4" sm="12">
          <div>
            <b-card class="text-center custom-card" @click="basicSelection()">
              <div class="current-plan" v-if="!curUser.subscription">
                <p class=""><b-icon icon="check"></b-icon> Current Plan</p>
              </div>
              <div class="price-card">
                <label class="title mb-4">Basic</label>
                <div class="details">
                  <label class="price">$0</label>
                  <label class="duration">No credit card required</label>
                </div>
                <b-button class="select-btn mb-1" :disabled="!curUser.subscription" @click="basicSelection()">
                  Select
                </b-button>
              </div>
            </b-card>
          </div>
        </b-col>
        <b-col md="6" xl="3" lg="4" sm="12">
          <div>
            <b-card class="text-center custom-card" @click="select('monthly')">
              <div class="current-plan" v-if="isActivePlan('monthly')">
                <p class=""><b-icon icon="check"></b-icon>Current Plan</p>
              </div>
              <div class="price-card">
                <label class="title">Monthly</label><br>
                <small>Subscription</small>
                <p class="expires-text" v-if="currentPeriodEnd('month') !== '' && isActivePlan('monthly')">*Expires {{currentPeriodEnd('month')}}</p>
                <p class="expires-text" v-if="monthPeriodStart() !== ''">*Begins {{monthPeriodStart()}}</p>
                <div class="details">
                  <label class="price">$5</label>
                  <label class="duration">per month</label>
                </div>
                <b-button class="select-btn mb-1" :disabled="isActivePlan('monthly')" v-if="!showMonthlyRenew">
                  Select
                </b-button>
                <b-button class="select-btn mb-1" v-if="showMonthlyRenew">
                  Renew
                </b-button>
              </div>
            </b-card>
          </div>
        </b-col>
        <b-col md="6" xl="3" lg="4" sm="12">
          <div>
            <b-card class="text-center custom-card" @click="select('yearly')">
              <div class="current-plan" v-if="isActivePlan('yearly')">
                <p class=""><b-icon icon="check"></b-icon> Current Plan</p>
              </div>
              <div class="price-card">
                <label class="title">Yearly</label><br>
                <small>Subscription</small>
                <p class="expires-text" v-if="currentPeriodEnd('year') !== '' && isActivePlan('yearly')">*Expires {{currentPeriodEnd('year')}}</p>
                <p class="expires-text" v-if="yearPeriodStart() !== ''">*Begins {{yearPeriodStart()}}</p>
                <div class="details">
                  <label class="price">$45</label>
                  <label class="duration">per month</label>
                </div>
              </div>
              <b-button class="select-btn" :disabled="isActivePlan('yearly')" v-if="!showYearlyRenew">
                Select
              </b-button>
              <b-button class="select-btn" v-if="showYearlyRenew">
                Renew
              </b-button>
            </b-card>
          </div>
        </b-col>
      </b-row>
      <b-row class="justify-content-center footer-text" align-v="center" align-h="center">
        <div class="col-md-12 col-xl-4 col-lg-4 col-sm-12 justify-content-center px-5 py-3">
          <div class="premium-access d-flex">
            <b-img src="/static/assets/img/icon/unlock-small.png"></b-img>
            <p>Premium Access</p>
          </div>
          <div class="premium-description">
            <p>Unlock unlimited, exclusive access to all of the premium questions we have to offer.</p>
          </div>
        </div>
        <div class="col-md-12 col-xl-4 col-lg-4 col-sm-12 justify-content-center px-5 py-3">
          <div class="premium-access d-flex">
            <b-img src="/static/assets/img/icon/interview.png"></b-img>
            <p>Mock Interview</p>
          </div>
          <div class="premium-description">
            <p>Gain real-time experience in a live mock interview with one of our experts.</p>
          </div>
        </div>
      </b-row>
      <b-row class="justify-content-center footer-text mb-5" align-v="center" align-h="center" v-if="curUser && curUser.hasOwnProperty('subscription')">
        <div class="col-md-12 col-xl-4 col-lg-4 col-sm-12 justify-content-center">
          <div>
            <b-button class="payment-history" @click="$router.push('subscriptionHistory')">VIEW PAYMENT HISTORY</b-button>
          </div>
        </div>
        <div class="col-md-12 col-xl-4 col-lg-4 col-sm-12 justify-content-center">
          <div>
            <b-button class="update-credit-card" @click="$router.push('updateCardDetails')">UPDATE CREDIT CARD</b-button>
          </div>
        </div>
      </b-row>
    </div>
    <b-modal v-model="modalShow" hide-footer no-close-on-esc no-close-on-backdrop>
      <template v-slot:modal-title>
        <h4>Enter your card detalis</h4>
        <h6>Your subscription will start now</h6>
      </template>
      <form id="subscription-form" @submit="subscribe">
        <b-row v-if="curUser.paymentMethodId">
          <b-col>Credit Card</b-col>
          <b-col class="text-right">Visa **** 4242</b-col>
        </b-row>
        <div v-if="!curUser.paymentMethodId" id="card-element" class="MyCardElement">
          <!-- Elements will create input elements here -->
        </div>
        <!-- We'll put the error messages in this element -->
        <div id="card-errors" role="alert">{{cardError}}</div>

        <!-- <input type="submit" class="subscribe-btn" value="Subscribe" /> -->
        <b-button type="submit" class="subscribe-btn" :disabled="isLoading">
          <b-spinner v-if="isLoading" style="width: 2rem; height: 2rem;" label="Spinning"></b-spinner>
          <span v-else>Subscribe</span>
        </b-button>
      </form>
    </b-modal>
    <b-modal v-model="success" hide-footer hide-header-close no-close-on-esc no-close-on-backdrop>
      <template v-slot:modal-title>
        <h4>Subscribed!</h4>
      </template>
      <div class="success-message">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
        <p>You have subscribed to premium plan successfully!</p>
        <button @click="redirect()">Ok</button>
      </div>
    </b-modal>
    <div class="checkout-section" v-if="checkout">
      <b-row>
        <b-col sm="12" md="6" lg="6" xl="6" class="vertical-divider">
          <p class="payment-heading">Payment Details</p>
          <div class="mt-5">
            <form @submit="subscribe">
              <b-col sm="12" md="9" lg="4" xl="4" class="mb-5 p-0">
                <label class="same-label">NAME ON CARD</label>
                <b-input v-model="nameOnCard" id="cardName" class="name-input" required></b-input>
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
                  <span v-else>Checkout</span>
                </b-button>
              </div>
            </form>
          </div>
        </b-col>
        <b-col sm="12" md="6" lg="6" xl="6">
            <div>
              <b-form-group label="Premium Plan Upgrade">
                <b-form-radio-group
                  class="custom-radio"
                  v-model="selected"
                  :options="options"
                  plain
                  stacked
                  name="plain-stacked"
                ></b-form-radio-group>
              </b-form-group>
              <div class="d-flex col-lg-4 col-xl-4 justify-content-between align-items-center total-info">
                <label class="total">Total</label>
                <label class="total-price">{{ selected === "monthly" ? "$5.00" : "$45.00" }}</label>
              </div>
            </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import StripeService from "../services/stripeService";
import UserService from "../services/userService";
import { mapGetters } from "vuex";

export default {
  name: 'SubscriptionPage',
  data() {
    return {
      checkout: false,
      stripe: null,
      elements: null,
      cardElement: null,
      modalShow: false,
      cardError: "",
      isValidCard: false,
      prices: {
        monthly: "price_1HSdFUDn6vXg5DP2W1FsulgF",
        yearly: "price_1HSdFUDn6vXg5DP2IPNrDO8g"
        // monthly: "price_1HNdEoBaIbzk17AL5ZJnItV0", // Our
        // yearly: "price_1HP67IBaIbzk17ALbI7N6DUn" // Our
      },
      nameOnCard: "",
      selected: "monthly",
      isLoading: false,
      options: [
        { text: 'Monthly Subscription', value: 'monthly' },
        { text: 'Yearly Subscription', value: 'yearly' }
      ],
      success: false,
      showMonthlyRenew: false,
      showYearlyRenew: false
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: "loggedIn",
      curUser: "getCurrentUser",
    })
  },
  methods: {
    select(type) {
      if (this.curUser.subscription) {
        if (this.curUser.subscription.type !== type) {
          const priceId = this.prices[type];
          this.$modal.show("change-modal", {
            priceId,
            type
          });
        }else if(this.curUser.subscription.type === type && (this.showYearlyRenew || this.showMonthlyRenew)) {
          this.$modal.show("renew-modal");
        }
        return;
      }
      this.selected = type;
      if (!this.loggedIn) {
        this.$modal.show("login", {
          auto_prompt: true,
          show_reason: 'subscription'
        });
      }else {
        this.checkout = true;

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
      }
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
    subscribe(e) {
      e.preventDefault();
        this.isLoading = true;
        this.stripe.createPaymentMethod({
          type: 'card',
          card: this.cardElement,
          billing_details: {
            name: "billingName",
          },
        }).then((result) => {
          // console.log("result", result);
          if (result.error) {
            this.isLoading = false;
            this.showCardError(result);
          }else {
            const updateData = this.generateCardObj(result.paymentMethod);
            this.updatePaymentMethod(updateData);
            const data = {
              customerId: this.curUser.customerId,
              paymentMethodId: result.paymentMethod.id,
              priceId: this.prices[this.selected],
            }
            StripeService.createSubscription(data).then((res) => {
              const subscription = res.data.subscription;
              this.handleSubscription(subscription, data);
            }).catch((err) => {
              this.cardError = err.message;
              this.isLoading = false;
            })
          }
        })
      // }
    },
    handleSubscription(subscription, data) {
      if (subscription && subscription.status === 'active') {
        this.modalShow = false;
        this.updatePaymentMethod({ subscription: { id: subscription.id, type: this.selected, status: subscription.status, current_period_end: subscription.current_period_end } });
        this.success = true;
        this.isLoading = false;
        this.sendEmailNotification();
        return;
      }

      const paymentIntent = subscription.latest_invoice && subscription.latest_invoice.payment_intent ? subscription.latest_invoice.payment_intent : {};
      const { paymentMethodId } = data;
      if(paymentIntent.status === "requires_action") {
        this.stripe.confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        }).then((result) => {
          this.isLoading = false;
          if (result.error) {
            this.showCardError(result);
          }else {
            if (result.paymentIntent.status === "succeeded") {
              this.updatePaymentMethod({ subscription: { id: subscription.id, type: this.selected, status: subscription.status, current_period_end: subscription.current_period_end } });
              this.success = true;
              this.sendEmailNotification();
            }else {
              return alert("failed in confirmCardPayment");
            }
          }
        }).catch((err) => {
          this.cardError = err.message;
          this.isLoading = false;
        });
      }
    },
    sendEmailNotification() {
      const data = {
        sendTo: this.curUser.email,
        type: 'subscribed'
      }
      StripeService.sendEmail(data).then((res) => {
        
      }).catch((err) => {
        console.log("sendEmail err", err.response);
      });
    },
    basicSelection() {
      // Cancel trigger if subscription active and click on basic plan selection
      if (this.curUser && this.curUser.subscription) {
        this.$modal.show('cancel-modal');
      }
    },
    isActivePlan(type) {
      // console.log(this.curUser);
      if(this.curUser.subscription && type === this.curUser.subscription.type && this.curUser.subscription.status === "active") {
        return true
      }
      return false;
    },
    updatePaymentMethod(data) {
      UserService.updateCurrentUser(data, () => {
        this.$store.dispatch('refreshUserState');
      });
    },
    redirect() {
      this.$router.push({ name: 'AllProblems' })
    },
    // currentPeriodEnd() {
    //   if (this.curUser.subscription && this.curUser.subscription.current_period_end && this.curUser.subscription.cancel_at_period_end === true) {
    //     const current_period_end = this.curUser.subscription.current_period_end;
    //     const date = new Date(current_period_end * 1000);
    //     let month = date.getMonth() + 1;
    //     let day = String(date.getDate()).padStart(2, '0');
    //     let year = date.getFullYear();
    //     const output = month  + '/'+ day  + '/' + year;
    //     return output;
    //   }
    //   return "";
    // },
    currentPeriodEnd(type) {
      if(this.curUser.subscription && this.curUser.subscription[type] && this.curUser.subscription[type].cancel_at_period_end === true) {
        const current_period_end = this.curUser.subscription.current_period_end;
        const date = new Date(current_period_end * 1000);
        let month = date.getMonth() + 1;
        let day = String(date.getDate()).padStart(2, '0');
        let year = date.getFullYear();
        const output = month  + '/'+ day  + '/' + year;
        return output;
      } else {
        return ""
      }
    },
    yearPeriodStart() {
      const subscription = this.curUser.subscription;
      if (subscription && subscription.year && subscription.current_period_end && subscription.year.cancel_at_period_end !== true && this.compareDate(subscription.year.current_period_start)) {
        const current_period_start = subscription.year.current_period_start;
        const date = new Date(current_period_start * 1000);
        let month = date.getMonth() + 1;
        let day = String(date.getDate()).padStart(2, '0');
        let year = date.getFullYear();
        const output = month  + '/'+ day  + '/' + year;
        return output;
      }
      return "";
    },
    monthPeriodStart() {
      const subscription = this.curUser.subscription;
      if (subscription && subscription.month && subscription.current_period_end && subscription.month.cancel_at_period_end !== true && this.compareDate(subscription.month.current_period_start)) {
        const current_period_start = subscription.month.current_period_start;
        const date = new Date(current_period_start * 1000);
        let month = date.getMonth() + 1;
        let day = String(date.getDate()).padStart(2, '0');
        let year = date.getFullYear();
        const output = month  + '/'+ day  + '/' + year;
        return output;
      }
      return "";
    },
    compareDate(timestamp) {
      const subscriptionTimeStamp = timestamp * 1000;
      const todayDate = new Date();
      const currentDateTimeStamp = todayDate.getTime();
      if(subscriptionTimeStamp > currentDateTimeStamp) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    curUser: function(curUserNew) {
      if (curUserNew.subscription && curUserNew.subscription.type === 'monthly' && curUserNew.subscription.cancel_at_period_end === true) {
        this.showMonthlyRenew = true;
      }else {
        this.showMonthlyRenew = false;
      }
      if (curUserNew.subscription && curUserNew.subscription.type === 'yearly' && curUserNew.subscription.cancel_at_period_end === true) {
        this.showYearlyRenew = true;
      }else {
        this.showYearlyRenew = false;
      }
    }
  },
  mounted() {
    console.log("this is user", this.curUser);
    this.stripe = StripeService.getStripe();
    this.elements = this.stripe.elements();
  }
}
</script>

<style scoped>
@import '../assets/css/SubscriptionPage.css';
</style>