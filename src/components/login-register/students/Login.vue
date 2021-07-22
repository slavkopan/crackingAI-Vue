<template>
  <div>
    <div class="flex-content">
      <h2>Student Login</h2>
    </div>
    <div class="flex-content">
      <p> Need an account? <a class=""> <router-link :to="{ name: 'StudentSignUp' }">Sign Up Here</router-link></a> </p>
    </div>
    <div class="margin-20 row bordered-div">
      <div class = "col-md-6 bordered-right">
      <form class="input-line">
          <div class="">
            <div class="form-group">
                <label>Email</label>
                <input  class="form-control" type="text" placeholder="Email" v-model="userEmail">
            </div>
            <div v-if="passwordIsIssue">
              <p class="text-danger"> Passwords Don't Match </p>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input  class="form-control" type="password" placeholder="Password" v-model="userPassword" v-on:focus="togglePasswordIfTrue()">
            </div>
          </div>

          <div class="flex-content margin-bottom">
          <button class="btn btn-primary" @click.prevent="emailLogin()">Login</button>

        </div>

        </form>
      </div>

        <div class="col-md-6 flex-content grey-background">
          <div>
            <div> <img class="login-button margin-bottom-login-button" src="../../../../static/assets/img/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png" @click="googleLogin()"> </div>
          </div>
        </div>

    </div>

  </div>

</template>

<script>
import sha256 from 'sha256'
import { mapGetters } from 'vuex'
export default {
  name: 'StudentMainOnboarding',
  data () {
    return {
      userEmail: '',
      userPassword: '',
      verifyPassword: '',
      passwordIsIssue: false
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn'
    })
  },
  methods: {
    emailLogin () {
      let login = {}
      login.emailLogin = true
      login.email = this.userEmail
      login.password = sha256(this.userPassword)
      if (this.passwordIsIssue == true) {

      } else {
        this.$store.dispatch('login', login)
      }
    },
    googleLogin () {
      let login = {}
      login.emailLogin = false
      login.google = true
      this.$store.dispatch('login', login)
    },
    invalidPasswordTyping () {
      if (this.userPassword.length > 0 && (this.userPassword.length < 8 || this.userPassword.trim().length == 0)) return true
      return false
    },
    passwordsDontMatchTyping () {
      if (this.verifyPassword.length > 0) {
        return !(this.userPassword === this.verifyPassword)
      }
    },
    passwordIssue () {
      this.passwordIsIssue = (!(this.userPassword === this.verifyPassword))
    },
    togglePasswordIfTrue () {
      if (this.passwordIsIssue == true) this.passwordIsIssue = false
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

</style>
