<template>
  <div>
    <div class="margin-20 margin-below-2-5">
      <form class="input-line">
        <div class="flex-content">
          <h2>Basic Information </h2>
        </div>

        <div class = "row">
          <div class= "">
            <img :src="userProfileImgSrc" alt="..." class="rounded-circle img-restricted">
          </div>
          <div class="">
            <button type="button" class="btn btn-xl black-button" @click.prevent="onBrowsePhotos()">Change Profile Image</button>
            <input type ="file" class="display-none"
              ref="uploader"
              accept="image/*"
              @change="onProfileImageChosen">
          </div>
        </div>

        <div v-if="notAllFieldsValid">
          <p class="text-danger"> All Fields Must Be Filled In </p>
        </div>

          <div class="row">
            <div class="form-group required col-md-6">
                <label class="control-label">First Name</label>
                <input  class="form-control" type="text" required="required" placeholder="First Name" v-model="userFirstName" v-on:focus="toggleNotValid()">
            </div>
            <div class="form-group col-md-6 required">
                <label class="control-label">Last Name</label>
                <input  class="form-control" type="text" placeholder="Last Name" v-model="userLastName" v-on:focus="toggleNotValid()">
            </div>
          </div>

          <div class="form-group required">
              <label class="control-label">Headline</label>
              <input class="form-control" type="text" placeholder="Headline" v-model="userHeadline" v-on:focus="toggleNotValid()">
          </div>

          <div class="form-group required ">
              <label class="control-label">Location</label>
              <p>City, Region, etc (ex: San Francisco Bay Area) </p>
              <input class="form-control" type="text" placeholder="Location" v-model="userLocation" v-on:focus="toggleNotValid()">
          </div>

          <div class="flex-content">
          <button class="btn btn-primary" @click.prevent="toSecondScreen()">Next Screen</button>
        </div>

        </form>

    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import OnboardingService from '../../../services/onboardingService.js'
import UserService from '../../../services/userService.js'
export default {
  name: 'StudentMainOnboarding',
  data () {
    return {
      userFirstName: '',
      userLastName: '',
      userHeadline: '',
      userProfileImgSrc: '',
      userLocation: '',
      chosenImage: null,
      chosenImageUrl: '',
      notAllFieldsValid: false
    }
  },
  mounted () {
    let linkedinData = OnboardingService.getLinkedinOnboardingData()
    this.userFirstName = this.checkForNull(linkedinData.firstName)
    this.userLastName = this.checkForNull(linkedinData.lastName)
    this.userHeadline = this.checkForNull(linkedinData.headline)
    this.userLocation = this.checkLocationForNull(linkedinData.location)
    this.userProfileImgSrc = this.checkImageForNull(linkedinData.pictureUrls)
  },
  computed: {
    ...mapGetters({
      linkedinInfo: 'getLinkedinInfo'
    })
  },
  methods: {
    toSecondScreen () {
      let userData = {}
      if (!this.chosenImage) {
        this.pushToSecond(null)
      } else {
        this.userChangedImage()
      }
    },
    userChangedImage () {
      let self = this
      let curUserId = UserService.getCurrentUserId()
      UserService.getProfileImageURL(curUserId, this.chosenImage.name, this.chosenImage).then(function (url) {
        self.pushToSecond(url)
      })
    },
    pushToSecond (url) {
      let userData = {}
      userData.first_name = this.userFirstName
      userData.last_name = this.userLastName
      userData.headline = this.userHeadline
      userData.location = this.userLocation
      if (!url) {
        userData.profile_img_add = this.userProfileImgSrc
      } else {
        userData.profile_img_add = url
      }
      if (this.valid(userData.first_name, userData.last_name, userData.headline, userData.location)) {
        this.$store.dispatch('onboarding', userData)
        this.$router.push('/investor-onboarding/2')
      }
    },
    checkForNull (field) {
      if (!field) return ''
      else return field
    },
    checkImageForNull (src) {
      console.log(src)
      if (src) return src.values[0]
      else {
        return 'http://walyou.com/wp-content/uploads//2010/12/facebook-profile-picture-no-pic-avatar.jpg'
      }
    },
    checkLocationForNull (field) {
      if (!field) return ''
      else return field.name
    },
    onProfileImageChosen (event) {
      const file = event.target.files[0]
      let self = this
      let fileName = file.name
      if (fileName.lastIndexOf('.') <= 0) return alert('Please valid files only')
      const fileReader = new FileReader()
      let imageUrl
      fileReader.addEventListener('load', () => {
        imageUrl = fileReader.result
        self.chosenImageUrl = imageUrl
        self.userProfileImgSrc = imageUrl
      })
      fileReader.readAsDataURL(file)
      self.chosenImage = file
    },
    onBrowsePhotos () {
      this.$refs.uploader.click()
    },
    addGetProfileURLToData () {
      let curUserId = UserService.getCurrentUserId()
      UserService.getProfileImageURL(curUserId, this.chosenImage.name, this.chosenImage).then(function (url) {

      })
    },
    valid (field1, field2, field3, field4) {
      if (field1 && field2 && field3 && field4) return true
      this.notAllFieldsValid = true
      return false
    },
    toggleNotValid () {
      if (this.notAllFieldsValid == true) this.notAllFieldsValid = false
    }
  }
}

</script>

<style scoped>
.ask-color{
  background-color: #FF420E;
  color: white;
}

.display-none{
  display: none;
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
.margin-below-2-5{
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
