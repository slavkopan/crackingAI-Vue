<template>
  <modal
    name="upgrade"
    height="auto"
    width="555"
    :clickToClose="true"
    class="upgrade-modal"
  >
    <div class="card-body">
      <div class="card-closeicon">
          <span aria-hidden="true" class="btn icon-close" @click="hideModal">&times;</span>
      </div>
      <div class="modal-title">
        <p>Upgrade your plan to unlock this question</p>
      </div>
      <div class="btn-buttons d-flex justify-content-center">
        <button type="button" class="btn btn-upgrade mr-2" @click="upgrade">UPGRADE</button>
        <button type="button" class="btn btn-notnow ml-2" @click="hideModal">NOT NOW</button>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: 'UpgradeModal',
  data() {
    return {
      
    };
  },
  methods: {
    upgrade() {
      this.$router.push({ name: 'SubscriptionPage' });
      this.$modal.hide('upgrade');
    },
    hideModal(){
      this.$modal.hide('upgrade');
    }
  }
};
</script>

<style scoped>
.btn:focus {
  outline: 0 !important;
  box-shadow: none !important;
}

.upgrade-modal {
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

.btn-notnow:hover {
  color: #3C7299 !important;
  background-color: transparent !important;
  border: 1px solid #3C7299 !important;
}

.btn-notnow {
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
</style>