<template>
  <div>
    <div v-if="showSpinner" class="top-margin-5">
      <div class="flex-content">
        <semipolar-spinner
          :animation-duration="2000"
          :size="65"
          color="black"
  />
      </div>
      <h4 class="text-center"> Loading... </h4>
    </div>
    <div v-if="!showSpinner">
    <div class="margin-20">
      <form class="input-line">
        <div class="flex-content">
          <h2>Account Information </h2>
        </div>

        <div class = "flex-content">
          <div class= "">
            <img :src="userProfileImgSrc" alt="..." class="rounded-circle img-restricted">
          </div>
        </div>

          <div class="row">
            <div class="form-group col-md-6">
                <label>First Name</label>
                <input  class="form-control" type="text" placeholder="First Name" v-model="userFirstName">
            </div>
            <div class="form-group col-md-6">
                <label>Last Name</label>
                <input  class="form-control" type="text" placeholder="Last Name" v-model="userLastName">
            </div>
          </div>

          <div class="form-group ">
              <label>Headline</label>
              <input class="form-control" type="text" placeholder="Headline" v-model="userHeadline">
          </div>

          <div class="form-group required ">
              <label class="control-label">Location</label>
              <p>City, Region, etc (ex: San Francisco Bay Area) </p>
              <input class="form-control" type="text" placeholder="Location" v-model="userLocation" v-on:focus="toggleNotValid()">
          </div>

          <div class="form-group required ">
              <label class="control-label">Email</label>
              <input class="form-control" type="text" placeholder="Email" v-model="userEmail" v-on:focus="toggleNotValid()">
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
              <input class="form-control" type="text" placeholder="Phone Number" v-model="phone_number">
          </div>

          <div>
            <div class="form-group required">
              <label class="control-label">A Quick Intro About You</label>
              <p class="black">Things you like to do in free time, types of startups you typically invest in, etc. </p>
              <textarea class="form-control" rows="4" placeholder="Tell us more" v-model="other_things_me" v-on:focus="toggleNoAboutUser()">></textarea>
            </div>
          </div>

          <div v-if="updatedProfile" class="flex-content">
          <h4 class="text-success"> Successfully Updated Profile! </h4>
          </div>
          <div class="flex-content">
          <button class="btn btn-primary" @click.prevent.prevent="updateAccount()">Update Profile</button>

        </div>

        </form>

    </div>
  </div>

  </div>

</template>

<script>
import UserService from '../../../services/userService.js'
import { SemipolarSpinner } from 'epic-spinners'
export default {
  name: 'AccountSettingsMain',
  components: {
    SemipolarSpinner
  },
  data () {
    return {
      curUser: {},
      userFirstName: '',
      userLastName: '',
      userProfileImgSrc: '',
      userHeadline: '',
      userLocation: '',
      linkedinLink: '',
      other_things_me: '',
      phone_number: '',
      angelListLink: '',
      userEmail: '',
      showSpinner: true,
      updatedProfile: false
    }
  },
  methods: {
    updateAccount () {
      let update = {}
      update.first_name = this.userFirstName
      update.last_name = this.userLastName
      update.profile_img_add = this.userProfileImgSrc
      update.headline = this.userHeadline
      update.location = this.userLocation
      update.linkedinLink = this.linkedinLink
      update.email = this.userEmail
      update.other_things_me = this.other_things_me
      update.angelListLink = this.angelListLink
      update.phone_number = this.phone_number
      let result = this.getFormatedUpdateData(update)
      let curUserId = UserService.getCurrentUserId()
      UserService.updateInvestor(curUserId, result, this.profileUpdated)
    },
    getFormatedUpdateData (update) {
      let result = {
        first_name: update.first_name,
        last_name: update.last_name,
        profile_img_add: update.profile_img_add,
        headline: update.headline,
        email: update.email,
        linkedinLink: update.linkedinLink,
        other_things_me: update.other_things_me,
        angelListLink: update.angelListLink,
        phone_number: update.phone_number,
        location: update.location
      }
      console.log('result for update', result)
      return result
    },
    addExperience () {
      this.experiences.push({title: '', company: '', description: '', start: '', end: ''})
    },
    deleteExperience (index) {
      this.experiences.splice(index, 1)
    },
    invalidLink (link) {
      if (link == '') return false
      let checkHttp = link.substring(0, 7)
      console.log('http', link.substring(0, 7))
      if (checkHttp == 'http://') return false
      let checkHttps = link.substring(0, 8)
      if (checkHttps == 'https://') return false
      console.log('https', link.substring(0, 8))
      return true
    },
    profileUpdated () {
      this.updatedProfile = true
    }
  },
  mounted () {
    let curUserId = UserService.getCurrentUserId()
    let self = this
    UserService.getUserIsInvestor(curUserId).then(function (investor) {
      self.showSpinner = false
      self.curUser = investor

      self.userFirstName = self.curUser.first_name

      self.userLastName = self.curUser.last_name

      self.userProfileImgSrc = self.curUser.profile_img_add

      self.userHeadline = self.curUser.headline

      self.userEmail = self.curUser.email
      self.userLocation = self.curUser.location

      self.linkedinLink = self.curUser.linkedinLink
      self.angelListLink = self.curUser.angelListLink
      self.phone_number = self.curUser.phone_number
      self.other_things_me = self.curUser.other_things_me
    })
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
.img-restricted{
  height: 200px;
  width: 200px;
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
.top-margin-5{
  margin-top: 5%
}

</style>
