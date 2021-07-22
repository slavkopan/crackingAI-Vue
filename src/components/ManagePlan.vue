<template>
  <div>
    <b-container fluid>
      <div class="mb-5">
        <p class="manage-plan-text">Manage Plan</p>
      </div>
      <b-row align-h="center">
        <b-col cols="8" class="mt-5" v-if="curUser.subscription">
            <div>
                <p class="active-text">Active</p>
                <p class="sub-type">{{curUser.subscription ? curUser.subscription.type : ""}} Premium</p>
            </div>
            <div class="cancel-section">
              <b-button variant="danger" :disabled="isCanceling" @click="cancel" v-if="isActive && curUser.subscription && curUser.subscription.cancel_at_period_end !== true">
                <b-spinner v-if="isCanceling" small label="Spinning"></b-spinner>
                <span v-else>Cancel Subscription</span>
              </b-button>
              <p
                class="cancel-message" 
                v-if="cancelSuccess || (curUser.subscription && curUser.subscription.cancel_at_period_end == true)"
              >
                Subscription has been canceled, It will be stop at {{currentPeriodEnd()}}.
              </p>
              <p class="error-message" v-if="cancelError">{{cancelError}}</p>
            </div>
            <div>
            </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import StripeService from "../services/stripeService";
import UserService from "../services/userService";
import { mapGetters } from "vuex";
export default {
  name: 'ManagePlan',
  data() {
    return {
      isCanceling: false,
      cancelSuccess: false,
      cancelError: null
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: "loggedIn",
      curUser: "getCurrentUser",
    })
  },
  methods: {
    isActive() {
      return (this.curUser.subscription && this.curUser.subscription.status === "active");
    },
    ifSubscription() {
      return this.curUser && this.curUser.subscription
    },
    cancel() {
      this.isCanceling = true;
      const data = {
        subscriptionId: this.curUser.subscription.id
      }
      StripeService.cancelSubscription(data).then((res) => {
        const subscription = res.data.subscription;
        this.isCanceling = false;
        this.cancelSuccess = true;
        this.updateUserSubscription(subscription);
      }).catch((err) => {
        console.log("Err", err.response);
        this.isCanceling = false;
        if (err.response && err.response.data) {
          this.cancelError = err.response.data.message;
        }else {
          this.cancelError = err.message;
        }
      });
    },
    updateUserSubscription(curSubscription) {
      let subscription = this.curUser.subscription;
      subscription.cancel_at_period_end = true;
      subscription.current_period_end = curSubscription.current_period_end;
      UserService.updateCurrentUser({ subscription }, () => {
        
      });
    },
    currentPeriodEnd() {
      if (this.curUser.subscription && this.curUser.subscription.current_period_end) {
        const current_period_end = this.curUser.subscription.current_period_end;
        const date = new Date(current_period_end * 1000);
        let month = date.getMonth() + 1;
        let day = String(date.getDate()).padStart(2, '0');
        let year = date.getFullYear();
        const output = month  + '/'+ day  + '/' + year;
        return output;
      }
      return "";
    }
  }
}
</script>

<style scoped>
@import '../assets/css/ManagePlan.css';
</style>