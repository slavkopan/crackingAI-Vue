<template>
  <div>
    <div class="margin-20">

      <form class="input-line">
        <div class="flex-content">
          <h2>Almost Finished </h2>
        </div>

        <label> Link to Linkedin Profile</label>
        <div>
          <div class="form-group input-group w-100">
                    <input type="text" class="form-control" placeholder="Linkedin Link" v-model="linkedinLink">
          </div>
        </div>

        <label> Link to AngelList Profile</label>
        <div>
          <div class="form-group input-group w-100">
                    <input type="text" class="form-control" placeholder="AngelList Link" v-model="angelListLink">
          </div>
        </div>

        <div class="form-group">
            <label>Phone Number</label>
            <p class="black"> Only used to notify you if someone messages you on the platform. </p>
            <input class="form-control" type="text" placeholder="Phone Number" v-model="phoneNumber">
        </div>

        <div>
          <div class="form-group required">
            <label class="control-label">A Quick Intro About You</label>
            <p class="black">Things you like to do in free time, types of startups you typically invest in, etc. </p>
            <p class="text-danger" v-if="invalidAboutUser">Must Fill Out This Field</p>
            <textarea class="form-control" rows="4" placeholder="Tell us more" v-model="other_things_me" v-on:focus="toggleNoAboutUser()">></textarea>
          </div>
        </div>

        <div>
          <div class="form-group required">
                <label class="control-label">How Do You Hope to Use Student Garage?</label>
                <select class="form-control" v-model="userReason">
                  <option v-for="(reason, key) in reasonsToUse">{{reason.title}}</option>
                </select>
              </div>
        </div>

          <div class="flex-content">
          <button type="submit" class="btn btn-primary" @click.prevent="finishOnboarding()">Finish</button>

        </div>

        </form>

    </div>

  </div>

</template>

<script>
import OnboardingService from '../../../services/onboardingService.js'
let firmReasonsToUse = [{title: 'Network With Students'}, {title: 'Find Talent for Existing Portfolio Companies'},
  {title: 'Improve Deal Flow'}, {title: 'All of the Above'}]
export default {
  name: 'InvestorOnboardingScreenTwo',
  data () {
    return {
      reasonsToUse: firmReasonsToUse,
      linkedinLink: '',
      angelListLink: '',
      invalidAboutUser: false,
      other_things_me: '',
      userReason: firmReasonsToUse[0].title,
      phoneNumber: ''
    }
  },
  computed: {
    aboutUserIsValid () {
      return this.other_things_me.length > 0
    }
  },
  methods: {
    finishOnboarding () {
      let result = {}
      result.reasonsToUse = this.userReason
      result.linkedinLink = this.linkedinLink
      result.angelListLink = this.angelListLink
      result.other_things_me = this.other_things_me
      result.phone_number = this.getPhoneNumber(this.phoneNumber)
      result.onboarded = true
      if (this.aboutUserIsValid) {
        this.$store.dispatch('finishInvestorOnboarding', result)
      } else {
        this.invalidAboutUser = true
      }
    },
    checkForNull (field) {
      if (!field) return ''
      else return field
    },
    getPhoneNumber (string) {
      let newString = string.match(/[0-9]{0,14}/g)

      if (newString === null) {
        return ''
      }

      // Join parts returned from RegEx match
      newString = newString.join('')

      // Start number with "+"
      return newString
    },
    toggleNoAboutUser () {
      this.invalidAboutUser = false
    }
  },
  mounted () {
    let linkedinData = OnboardingService.getLinkedinOnboardingData()
    this.linkedinLink = this.checkForNull(linkedinData.publicProfileUrl)
  }
}

</script>

<style scoped>
.ask-color{
  background-color: #FF420E;
  color: white;
}

.flex-content{
  display: flex;
  justify-content: center;
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
.margin-top{
  margin-top: 5%;
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

.right-margin{
  margin-right: 5%;
}
.top-margin{
  margin-top: 2.5%;
}

.form-group.required .control-label:after {
  content:"*";
  color:red;
}

</style>
