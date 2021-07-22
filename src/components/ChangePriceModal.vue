<template>
  <modal
    name="change-modal"
    height="auto"
    width="555"
    :clickToClose="false"
    class="change-modal"
    @before-open="beforeOpen"
  >
    <div class="card-body">
      <div class="card-closeicon">
          <span aria-hidden="true" class="btn icon-close" @click="hideModal">&times;</span>
      </div>
      <div v-if="!updateSuccess">
        <div class="modal-title">
          <p>Please confirm your account change.</p>
          <p v-if="type === 'yearly' && this.curUser.subscription && (!this.curUser.subscription.cancel_at_period_end)">Your card will be charged $40</p>
          <p v-if="showDateOnModal() !== ''">Your subscription will change to {{type}} on {{showDateOnModal()}}</p>
        </div>
        <p class="error-message" v-if="updateError">{{updateError}}</p>
        <div class="btn-buttons d-flex justify-content-center">
          <button type="button" class="btn btn-upgrade mr-2" @click="onYes" :disabled="isUpdating">
            <b-spinner v-if="isUpdating" style="width: 2rem; height: 2rem;" label="Spinning"></b-spinner>
            <span v-else>Confirm</span>
          </button>
          <button type="button" class="btn btn-cancel ml-2" @click="hideModal">Cancel</button>
        </div>
      </div>
      <div v-if="updateSuccess">
        <div class="modal-title">
          <p>Subscription has been updated</p>
        </div>
        <div class="btn-buttons d-flex justify-content-center">
          <button type="button" class="btn btn-cancel ml-2" @click="hideModal">Ok</button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import StripeService from "../services/stripeService";
import UserService from "../services/userService";
import { mapGetters } from "vuex";
export default {
  name: 'ChangePriceModal',
  data() {
    return {
      isUpdating: false,
      updateSuccess: false,
      updateError: null,
      priceId: '',
      type: ''
    };
  },
  computed: {
    ...mapGetters({
      curUser: "getCurrentUser",
    })
  },
  methods: {
    beforeOpen(event) {
      this.priceId = event.params.priceId;
      this.type = event.params.type;
    },
    onYes() {
      // console.log(this.priceId);
      this.changePrice();
    },
    hideModal(){
      this.$modal.hide('change-modal');
      this.isUpdating = false;
      this.updateSuccess = false;
      this.updateError = null;
    },
    async changePrice() {
      this.isUpdating = true;
      const data = {
        subscriptionId: this.curUser.subscription.id,
        priceId: this.priceId
      }
      if(this.curUser.subscription && this.curUser.subscription.current_period_end && this.curUser.subscription.cancel_at_period_end === true) {
        this.subscriptionSchedule(this.curUser.subscription.current_period_end);
      } else {
        if(this.curUser.subscription && this.curUser.subscription.type === 'yearly') {
          this.startFutureSubscriptionForMonth();
        } else {
          StripeService.updateSubscription(data).then((res) => {
            const subscription = res.data.subscription;
            this.isUpdating = false;
            this.updateSuccess = true;
            this.updateUserSubscription(subscription);
          }).catch((err) => {
            console.log("Err", err.response);
            this.isUpdating = false;
            if (err.response && err.response.data) {
              this.updateError = err.response.data.message;
            } else {
              this.updateError = err.message;
            }
          });
        }
      }
    },
    updateUserSubscription(curSubscription) {
      let subscription = this.curUser.subscription;
      // if (this.curUser.subscription && this.curUser.subscription.current_period_end && this.curUser.subscription.cancel_at_period_end === true) {
      //   if (curSubscription.plan.interval === "year") {
      //     subscription.year = {
      //       current_period_end: curSubscription.current_period_end,
      //       current_period_start: curSubscription.current_period_start,
      //       status: curSubscription.status
      //     }
      //   } else if (curSubscription.plan.interval === "month") {
      //     subscription.month = {
      //       current_period_end: curSubscription.current_period_end,
      //       current_period_start: curSubscription.current_period_start,
      //       status: curSubscription.status
      //     }
      //   }
      // }
      delete subscription['cancel_at_period_end'];
      subscription.type = this.type;
      subscription.current_period_end = curSubscription.current_period_end;
      UserService.updateCurrentUser({ subscription }, () => {
        this.$store.dispatch('refreshUserState');
      });
    },
    /**
     * @description This function will schedule subscription for future. 
    */
    async subscriptionSchedule(timeStamp) {
      const { startTimeStamp, endTimeStamp } = this.calculateStartAndEndTimeStamp(timeStamp);
      const subscription = this.curUser.subscription;
      const data = {
        startDate: startTimeStamp,
        customerId: this.curUser.customerId,
        priceId: this.priceId
      }
      try {
        const response = await StripeService.createScheduleSubscription(data);
        const scheduleSubscription = response.data.subscriptionScheduled;
        if (this.type === "yearly") {
          subscription.year = {
            current_period_end: endTimeStamp,
            current_period_start: startTimeStamp,
            status: scheduleSubscription.status,
            subscription_schedule_id: scheduleSubscription.id
          }
        } else if (this.type === "monthly") {
          subscription.month = {
            current_period_end: endTimeStamp,
            current_period_start: startTimeStamp,
            status: scheduleSubscription.status,
            subscription_schedule_id: scheduleSubscription.id
          }
        }
        this.isUpdating = false;
        this.updateSuccess = true;
        delete subscription['cancel_at_period_end'];
        UserService.updateCurrentUser({ subscription }, () => {
          this.$store.dispatch('refreshUserState');
        });
      } catch(err) {
        console.log("Something went wrong", err);
        this.isUpdating = false;
        if (err.response && err.response.data) {
          this.updateError = err.response.data.message;
        } else {
          this.updateError = err.message;
        }
      }
    },
    /**
     * This function will calculate start and end timestamp for plan that are scheduled for future. 
    */
    calculateStartAndEndTimeStamp(timeStamp) {
      const lastplanDate = new Date(timeStamp * 1000);
      lastplanDate.setDate(lastplanDate.getDate() + 1);
      const startTimeStamp = Math.floor(lastplanDate.getTime() / 1000);
      this.type === "yearly" ? lastplanDate.setFullYear(lastplanDate.getFullYear() + 1) : lastplanDate.setMonth(lastplanDate.getMonth() + 1);
      const endTimeStamp = Math.floor(lastplanDate.getTime() / 1000);
      return { startTimeStamp, endTimeStamp };
    },
    showDateOnModal() {
      if(this.curUser.subscription && this.curUser.subscription.current_period_end && this.curUser.subscription.cancel_at_period_end === true) {
        const timeStamp = this.curUser.subscription.current_period_end;
        const date = new Date(timeStamp * 1000);
        date.setDate(date.getDate() + 1);
        let month = date.getMonth() + 1;
        let day = String(date.getDate()).padStart(2, '0');
        let year = date.getFullYear();
        const output = month  + '/'+ day + '/' + year;
        return output;
      } else if(this.curUser.subscription && this.curUser.subscription.current_period_end && this.type === 'monthly') {
        const timeStamp = this.curUser.subscription.current_period_end;
        const date = new Date(timeStamp * 1000);
        date.setDate(date.getDate() + 1);
        let month = date.getMonth() + 1;
        let day = String(date.getDate()).padStart(2, '0');
        let year = date.getFullYear();
        const output = month  + '/'+ day + '/' + year;
        return output;
      } else {
        return "";
      }
    },
    /**
     * @description This function will ends yearly subscription and Schedule future subscription for month.
    */
    async startFutureSubscriptionForMonth() {
      try {
          const data = {
            subscriptionId: this.curUser.subscription.id
          };
          // cancels yearly subscription
          const res = await StripeService.cancelSubscription(data);
          const currentSubscription = res.data.subscription;
          const subscription = this.curUser.subscription;
          subscription.cancel_at_period_end = true;
          subscription.current_period_end = currentSubscription.current_period_end;
          subscription.year = {
            cancel_at_period_end: true,
            current_period_end: currentSubscription.current_period_end,
            current_period_start: currentSubscription.current_period_start,
            status: currentSubscription.status
          }
          const lastplanDate = new Date(currentSubscription.current_period_end * 1000);
          lastplanDate.setDate(lastplanDate.getDate() + 1);
          const startTimeStamp = Math.floor(lastplanDate.getTime() / 1000);
          lastplanDate.setMonth(lastplanDate.getMonth() + 1);
          const endTimeStamp = Math.floor(lastplanDate.getTime() / 1000);
          const scheduleSubscriptionData = {
            startDate: startTimeStamp,
            customerId: this.curUser.customerId,
            priceId: this.priceId
          }
          // create future schedule for monthly subscription
          const response = await StripeService.createScheduleSubscription(scheduleSubscriptionData);
          const scheduleSubscription = response.data.subscriptionScheduled;
          subscription.month = {
            current_period_end: endTimeStamp,
            current_period_start: startTimeStamp,
            status: scheduleSubscription.status,
            subscription_schedule_id: scheduleSubscription.id
          };
          this.isUpdating = false;
          this.updateSuccess = true;
          UserService.updateCurrentUser({ subscription }, () => {
            this.$store.dispatch('refreshUserState');
          });
      } catch(err) {
        this.isUpdating = false;
        if (err.response && err.response.data) {
          this.updateError = err.response.data.message;
        } else {
          this.updateError = err.message;
        }
      }
    }
  }
};
</script>

<style scoped>
.btn:focus {
  outline: 0 !important;
  box-shadow: none !important;
}

.change-modal {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}

.card-closeicon {
  display: flex;
}

.modal-title {
  margin-top: 34px;
  margin-bottom: 47px;

}

.modal-title p {
  font-family: 'Nokora', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 26px;
  color: #000000;
  text-align: center;
}

.btn-buttons {
  margin-bottom: 50px;
}

.btn-upgrade {
  width: 167px;
  height: 45px;
  left: 543px;
  background: #A6CEE3 !important;
  border-radius: 10px;
  font-family: 'Nokora', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #FFFFFF !important;
}

.btn-upgrade:hover {
  background-color: #3C7299 !important;
}

.btn-cancel:hover {
  color: #3C7299 !important;
  background-color: transparent !important;
  border: 1px solid #3C7299 !important;
}

.btn-cancel {
  width: 167px;
  height: 45px;
  left: 730px;
  border: 1px solid #A6CEE3;
  box-sizing: border-box;
  border-radius: 10px;
  font-family: 'Nokora', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #A6CEE3 !important;
}

.icon-close {
  font-size: 20px !important;
  line-height: 26px !important;
  color: #000000 !important;
}

.icon-close:hover {
  background: transparent !important;
  color: #000000 !important;
}

.card-body .error-message {
  color: red;
  text-align: center;
}
</style>