<template>
  <div>
    <modal name="username" height="auto" :scrollable="true" @before-open="beforeOpen">
      <div class="card no-padding">
        <div class="card-body">

      <div class="flex-content" v-if="auto_prompt">
          <h6>Please register a username before you can login</h6>
      </div>
      <div>
        <div class="margin-20">
          <div>
          <form class="input-line">
              <div class="">
                <div v-if="emailAlreadyAssociated">
                <p class="text-danger text-center"> There's already an account associated with that email.
                </p>
              </div>
                <div class="form-group">
                    <input  class="form-control" type="text" placeholder="Username" v-model="username">
                </div>
              </div>

              <div class="flex-content margin-bottom">
              <button class="btn btn-primary" @click.prevent="registerUsername()">Register</button>
            </div>


            </form>
          </div>



        </div>

      </div>



      </div>
    </div>
    </modal>
  </div>
</template>

<script>
import sha256 from 'sha256'
import { mapGetters } from 'vuex'
import UserService from '../services/userService.js'
export default {
  name: 'LoginRegisterModal',
  data () {
    return {
      username: '',
      emailAlreadyAssociated: false,
      minWidth: '50%',
      minHeight: '50%',
      auto_prompt: false
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn'
    }),
    passwordLengthIssue () {
      if (this.userPassword.length > 0 && this.userPassword.length < 8) return true
      return false
    },
    passwordVerifyIssue () {
      if (this.userPassword !== this.verifyPassword && this.userPassword.length > 0 && this.verifyPassword.length > 0) return true
      return false
    }
  },
  methods: {
    resetPassword () {
      console.log('password is reset')
    },
    beforeOpen (event) {
      this.auto_prompt = event.params.auto_prompt
    },
    registerUsername() {
      let self = this
      UserService.updateCurrentUser({username:self.username},self.hideModal)
    },
    hideModal(){
      this.$modal.hide('username');
    }
  }
}

</script>

<style scoped>
.ask-color{
  background-color: #FF420E;
  color: white;
}

.bordered-div{
  border-style: solid;
  border-color: #C8C8C8;
}

.bordered-right{
  border-style:solid;
  border-left:0px;
  border-bottom:0px;
  border-top:0px;
  border-color: #C8C8C8;
}

.flex-content{
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-row{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
.float-right{
  float:right;
}

.grey-background{
  background-color: #C8C8C8 !important;
}
.hand-hover:hover{
  cursor: pointer;
}
hr{
height: 1px;
color: #123455;
background-color: #123455;
border: none;

}
.img-restricted{
  height: 200px;
  width: 200px;
}
.inline{
  display: inline;
}
.left-margin{
  margin-left: 5%;
}
.left-margin-shrunk{
  margin-left: 1%;
}
.login-button{
  width: 200px;
  height:50px;
}
.margin-top{
  margin-top: 5%;
}
.margin-bottom{
  margin-bottom: 5%;
}
.margin-bottom-login-button{
  margin-bottom: 2.5%;
}
.margin-20{
  margin-left:20%;
  margin-right: 20%;
}
.no-left-margin{
  margin-left: 0 !important;
}

.no-left-padding{
  padding-left: 0 !important;
}
.cursor-pointer{
  cursor: pointer;
}

@media (max-width:400px){
  .center-mobile{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 767px) {
  .bordered-div {
    max-width: 300px;
    margin: 0 auto 100px;
  }

  .bordered-right {
    padding: 15px 15px 5px;
    border-right: none;
  }

  .grey-background {
    padding: 15px;
  }
}

.right-margin{
  margin-right: 5%;
}
.top-margin{
  margin-top: 2.5%;
}

.top-margin-5{
  margin-top: 5%;
}

a {
    color: blue !important;
    text-decoration: none !important;
    border-bottom: 1px solid blue !important;
}

input{
  outline: 1px #D3D3D3 solid;
}

input:focus{
  outline: 2px orange solid;
}

.no-margin-top{
  margin-top: 0;
}

.no-padding{
  padding: 0 0 0 0;
}

::-webkit-input-placeholder {
   text-align: center;
}

:-moz-placeholder { /* Firefox 18- */
   text-align: center;
}

::-moz-placeholder {  /* Firefox 19+ */
   text-align: center;
}

:-ms-input-placeholder {
   text-align: center;
}

</style>
