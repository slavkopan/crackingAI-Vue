<template>
  <modal
    name="renew-modal"
    height="auto"
    width="555"
    :clickToClose="false"
    class="renew-modal"
  >
    <div class="card-body">
      <div class="card-closeicon">
          <span aria-hidden="true" class="btn icon-close" @click="hideModal">&times;</span>
      </div>
      <div v-if="!updateSuccess">
        <div class="modal-title">
          <p>Please confirm you want renew this subscription?</p>
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
          <p>Subscription has been resumed</p>
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
  name: 'RenewModal',
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
    onYes() {
      this.resumeSubscription();
    },
    hideModal(){
      this.$modal.hide('renew-modal');
      this.isUpdating = false;
      this.updateSuccess = false;
      this.updateError = null;
    },
    resumeSubscription() {
      this.isUpdating = true;
      const data = {
        subscriptionId: this.curUser.subscription.id
      }
      StripeService.resumeSubscription(data).then((res) => {
        const subscription = res.data.subscription;
        this.isUpdating = false;
        this.updateSuccess = true;
        this.updateUserSubscription(subscription);
      }).catch((err) => {
        console.log("Err in resumeSubscription", err.response);
        this.isUpdating = false;
        if (err.response && err.response.data) {
          this.updateError = err.response.data.message;
        }else {
          this.updateError = err.message;
        }
      });
    },
    updateUserSubscription(curSubscription) {
      let subscription = this.curUser.subscription;
      delete subscription['cancel_at_period_end'];
      subscription.current_period_end = curSubscription.current_period_end;
      UserService.updateCurrentUser({ subscription }, () => {
        this.$store.dispatch('refreshUserState');
      });
    },
  }
};
</script>

<style scoped>
.btn:focus {
  outline: 0 !important;
  box-shadow: none !important;
}

.renew-modal {
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