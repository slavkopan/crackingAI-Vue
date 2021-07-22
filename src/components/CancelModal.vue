<template>
  <modal
    name="cancel-modal"
    height="auto"
    width="555"
    :clickToClose="false"
    class="cancel-modal"
  >
    <div class="card-body">
      <div class="card-closeicon">
          <span aria-hidden="true" class="btn icon-close" @click="hideModal">&times;</span>
      </div>
      <div v-if="!cancelSuccess">
        <div class="modal-title">
          <p>Are you sure you want to cancel your premium subscription?</p>
        </div>
        <p class="error-message" v-if="cancelError">{{cancelError}}</p>
        <div class="btn-buttons d-flex justify-content-center">
          <button type="button" class="btn btn-upgrade mr-2" @click="onYes" :disabled="isCanceling">
            <b-spinner v-if="isCanceling" style="width: 2rem; height: 2rem;" label="Spinning"></b-spinner>
            <span v-else>Yes</span>
          </button>
          <button type="button" class="btn btn-cancel ml-2" @click="hideModal">No</button>
        </div>
      </div>
      <div v-if="cancelSuccess">
        <div class="modal-title">
          <p>Subscription has been canceled, It will be stop at {{currentPeriodEnd()}}.</p>
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
  name: 'CancelModal',
  data() {
    return {
      isCanceling: false,
      cancelSuccess: false,
      cancelError: null
    };
  },
  computed: {
    ...mapGetters({
      curUser: "getCurrentUser",
    })
  },
  methods: {
    onYes() {
      this.cancel();
      // EventBus.$emit('cancel-confirmed');
    },
    hideModal(){
      this.$modal.hide('cancel-modal');
      this.isCanceling = false;
      this.cancelSuccess = false;
      this.cancelError = null;
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
        this.sendEmailNotification();
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
    sendEmailNotification() {
      const data = {
        sendTo: this.curUser.email,
        type: 'canceled'
      }
      StripeService.sendEmail(data).then((res) => {
        
      }).catch((err) => {
        console.log("sendEmail err", err.response);
      });
    },
    async updateUserSubscription(curSubscription) {
      // console.log(curSubscription);
      let subscription = this.curUser.subscription;
      subscription.cancel_at_period_end = true;
      subscription.current_period_end = curSubscription.current_period_end;
      if (curSubscription.plan.interval === "year") {
        subscription.year = {
          cancel_at_period_end: true,
          current_period_end: curSubscription.current_period_end,
          current_period_start: curSubscription.current_period_start,
          status: curSubscription.status
        }
      } else if (curSubscription.plan.interval === "month") {
        subscription.month = {
          cancel_at_period_end: true,
          current_period_end: curSubscription.current_period_end,
          current_period_start: curSubscription.current_period_start,
          status: curSubscription.status
        }
      }
      await this.checkScheduleSubscription(subscription);
      UserService.updateCurrentUser({ subscription }, () => {
        this.$store.dispatch('refreshUserState');
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
    },
    /**
     * @description This function will check status=not_started and remove cancel its schedule subscription 
    */
    async checkScheduleSubscription(subscription) {
      try {
        if(subscription.hasOwnProperty('month') || subscription.hasOwnProperty('year')) {
          if(subscription.month && subscription.month.status === 'not_started') {
            const scheduledId = subscription.month.subscription_schedule_id;
            await StripeService.cancelScheduleSubscription(scheduledId);
            delete subscription['month'];
            return subscription;
          } else if(subscription.year && subscription.year.status === 'not_started') {
            const scheduledId = subscription.year.subscription_schedule_id;
            await StripeService.cancelScheduleSubscription(scheduledId);
            delete subscription['year'];
            return subscription;
          } else {
            return subscription;
          }
        }
      } catch(err) {
        console.log("error", err.response);
        this.isCanceling = false;
        if (err.response && err.response.data) {
          this.cancelError = err.response.data.message;
        } else {
          this.cancelError = err.message;
        }
        return err;
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

.cancel-modal {
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