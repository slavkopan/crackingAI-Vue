<template>
  <!-- <div>
    <div class="margin-20 margin-below-2-5">
      <form class="input-line">
        <div class="flex-content">
          <h2> {{apostrophize()}} Profile </h2>
        </div>

        <div>
          <div class="flex-content">
            <img :src="userProfileImgSrc" alt="..." class="rounded-circle img-restricted">
          </div>
          <div class="flex-content">
            <button type="button" class="btn btn-m btn-primary margin-top-2-5 margin-below-2-5"
              @click.prevent="onBrowsePhotos()">Change Profile Picture</button>
            <input type="file" class="display-none" ref="uploader" accept="image/*" @change="onProfileImageChosen">
          </div>
        </div>

        <div v-if="notAllFieldsValid">
          <p class="text-danger"> All Fields Must Be Filled In </p>
        </div>

        <div class="row">
          <div class="form-group required col-md-6">
            <label class="">First Name</label>
            <input class="form-control" type="text" placeholder="First Name" v-model="userFirstName"
              v-on:focus="toggleNotValid()">
          </div>
          <div class="form-group col-md-6 required">
            <label class="">Last Name</label>
            <input class="form-control" type="text" placeholder="Last Name" v-model="userLastName"
              v-on:focus="toggleNotValid()">
          </div>
        </div>

        <div class="flex-content">
          <button class="btn btn-primary btn-xl" @click.prevent="updateInformation()">Update Information</button>
        </div>

      </form>

    </div>

  </div> -->
  <b-container fluid>
    <div class="my-2">
      <p class="myprofile-text">My Profile</p>
    </div>
    <b-row align-h="center" align-v="center">
      <b-col sm="12" md="6" lg="4" xl="3" class="d-flex justify-content-center">
        <div class="col edit-profile px-xl-5">
          <b-form>
            <div class="d-flex justify-content-center profile-picture mb-5">
              <div>
                <div class="avatar-container" @click.prevent="onBrowsePhotos()">
                  <img :src="userProfileImgSrc" alt="profile picture" class="rounded-circle img-restricted">
                  <div class="overlay">Edit Photo</div>
                </div>
                <div>
                  <input type="file" class="display-none" ref="uploader" accept="image/*"
                    @change="onProfileImageChosen">
                </div>
              </div>
            </div>
            <b-form-group class="mb-0">
              <label>Name</label>
              <div class="input-with-icon">
                <b-input type="text" placeholder="Enter name" :disabled="nameDisabled" required id="name" v-model="name" ref="name"></b-input>
                <!-- <b-icon class="edit-icon" v-if="mode" icon="pencil" @click="editProfile()"></b-icon> -->
                <b-icon class="check-icon" v-if="!nameDisabled"  icon="check" @click="editName()"></b-icon>
                <b-icon class="edit-icon" v-if="nameDisabled" icon="pencil" @click="editName()"></b-icon>
                <b-icon class="cancel-icon" v-if="!nameDisabled" icon="X" @click="cancelNameEdit()"></b-icon>
              </div>
            </b-form-group>
            <b-form-group class="mb-0">
              <label>Email</label>
              <b-input type="email" placeholder="ashhtai@stanford.edu" readonly :value="userEmail"></b-input>
            </b-form-group>
            <b-form-group>
              <label>Username</label>
              <div class="input-with-icon">
                <b-input type="text" placeholder="Enter username" :disabled="userNameDisabled" required id="userName" :value="userName" v-model="userName" ref="username"></b-input>
                <!-- <b-icon class="edit-icon" v-if="mode" icon="pencil" @click="editProfile()"></b-icon> -->
                <b-icon class="check-icon" v-if="!userNameDisabled" icon="check" @click="editUserName()"></b-icon>
                <b-icon class="edit-icon" v-if="userNameDisabled" icon="pencil" @click="editUserName()"></b-icon>
                <b-icon class="cancel-icon" v-if="!userNameDisabled" icon="X" @click="cancelUserNameEdit()"></b-icon>
              </div>
            </b-form-group>
            <b-form-group class="mb-0">
              <label>Account</label>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="account-type" v-if="!curUser.subscription">Basic</span>
                <span class="account-type" v-if="curUser.subscription">Premium</span>
                <!-- <a href="#">Upgrade to Premium</a> -->
                <router-link :to="{ name: 'SubscriptionPage'}" v-if="!curUser.subscription">Upgrade to Premium</router-link>
                <router-link :to="{ name: 'SubscriptionPage'}" v-if="curUser.subscription">Manage Account</router-link>
              </div>
            </b-form-group>
          </b-form>
        </div>
      </b-col>
    </b-row>
    <b-modal ref="my-modal" ok-only hide-header no-close-on-backdrop @ok="onModalClose()">User name is already taken, Please use another</b-modal>
  </b-container>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  // import OnboardingService from '../../../services/onboardingService.js'
  import UserService from '../services/userService.js'
  export default {
    name: 'StudentMainOnboarding',
    data() {
      return {
        userFirstName: '',
        userLastName: '',
        userHeadline: '',
        userProfileImgSrc: 'http://walyou.com/wp-content/uploads//2010/12/facebook-profile-picture-no-pic-avatar.jpg',
        userLocation: '',
        userEmail: '',
        chosenImage: null,
        chosenImageUrl: '',
        stanfordEmail: '',
        notAllFieldsValid: false,
        // readonly: true,
        // mode: true,
        nameDisabled: true,
        userNameDisabled: true,
        userName: '',
        name: ''
      }
    },
    computed: {
      ...mapGetters({
        loggedIn: "loggedIn",
        curUser: "getCurrentUser",
      })
    },
    mounted() {
      let user = this.curUser;
      if(user) {
        this.userFirstName = user.first_name;
        this.userLastName = user.last_name;
        this.userProfileImgSrc = user.img_add;
        this.userName = user.username;
        this.userEmail = user.email;
        this.name = user.name ? user.name : '';
      }
    },
    methods: {

      apostrophize() {
        let apostrophe = "'";
        let result;
        if (this.userFirstName) {
          if (this.userFirstName[this.userFirstName.length - 1].toLowerCase() == 's') {
            result = this.userFirstName + apostrophe;
          } else {
            result = this.userFirstName + apostrophe + 's';
          }
          return result;
        }
      },
      toSecondScreen() {
        let userData = {}
        if (!this.chosenImage) {
          this.pushToSecond(null)
        } else {
          this.userChangedImage()
        }
      },
      userChangedImage() {
        let self = this
        let curUserId = UserService.getCurrentUserId()
        UserService.getProfileImageURL(curUserId, this.chosenImage.name, this.chosenImage).then(function (url) {
          self.pushToSecond(url)
        })
      },
      pushToSecond(url) {
        let userData = {}
        userData.first_name = this.userFirstName
        userData.last_name = this.userLastName
        console.log(userData)
        /*
          if(!url){
            userData.profile_img_add = this.userProfileImgSrc;
          } else{
            userData.profile_img_add = url;
          }
          if(this.valid(userData.email)){
            //this.$store.dispatch('onboarding',userData);
            //this.$router.push('/student-onboarding/2');
          } */
      },
      checkForNull(field) {
        if (!field) return ''
        else return field
      },
      checkImageForNull(src) {
        console.log(src)
        if (src) return src.values[0]
        else {
          return 'http://walyou.com/wp-content/uploads//2010/12/facebook-profile-picture-no-pic-avatar.jpg'
        }
      },
      checkLocationForNull(field) {
        if (!field) return ''
        else return field.name
      },
      async onProfileImageChosen(event) {
        try {
          const file = event.target.files[0]
          let self = this
          let fileName = file.name
          if (fileName.lastIndexOf('.') <= 0) return alert('Please valid files only')
          const extension = file.type.split('/')[1];
          const imageUrl = await UserService.updateUserProfileImage(file);
          const data = { img_add: imageUrl };
          UserService.updateCurrentUser(data, () => {
            this.$store.dispatch('refreshUserState');
          });
          this.userProfileImgSrc = imageUrl;
        } catch(error) {
          console.log("this is error", error);
        }
      },
      onBrowsePhotos() {
        this.$refs.uploader.click()
      },
      addGetProfileURLToData() {
        let curUserId = UserService.getCurrentUserId()
        UserService.getProfileImageURL(curUserId, this.chosenImage.name, this.chosenImage).then(function (url) {

        })
      },
      valid(field) {
        if (field) return true
        this.notAllFieldsValid = true
        return false
      },
      toggleNotValid() {
        if (this.notAllFieldsValid == true) this.notAllFieldsValid = false
      },
      updateInformation() {
        let self = this
        let curUserId = UserService.getCurrentUserId()
        if (this.chosenImage) {
          UserService.getProfileImageURL(curUserId, this.chosenImage.name, this.chosenImage).then(function (url) {
            UserService.updateUser({
              userFirstName: self.userFirstName,
              userLastName: self.userLastName,
              img_add: url
            })
          })
        } else {
          UserService.updateUser({
            userFirstName: self.userFirstName,
            userLastName: self.userLastName,
            img_add: ''
          })
        }
      },
      editName() {
        setTimeout(() => this.$refs.name.focus(), 1);
        if(!this.nameDisabled && this.name) {
          const data = { name: this.name };
          UserService.updateCurrentUser(data, () => {
            this.$store.dispatch('refreshUserState');
          });
        }
        this.nameDisabled = !this.nameDisabled
      },
      async editUserName() {
        setTimeout(() => this.$refs.username.focus(), 1);
        if(!this.userNameDisabled && this.userName) {
          const data = { username: this.userName };
          const isUserNameExists = await UserService.userNameExists(this.userName);
          if(isUserNameExists) {
            this.$refs['my-modal'].show();
          } else {
            UserService.updateCurrentUser(data, () => {
              this.$store.dispatch('refreshUserState');
            });
          }
          // UserService.updateCurrentUser(data, () => {
          //   this.$store.dispatch('refreshUserState');
          // });
        }
        this.userNameDisabled = !this.userNameDisabled
      },
      cancelNameEdit() {
        this.name = this.curUser.name;
        this.nameDisabled = !this.nameDisabled;
      },
      cancelUserNameEdit() {
        this.userName = this.curUser.username;
        this.userNameDisabled = !this.userNameDisabled
      },
      onModalClose() {
        this.userName = this.curUser.username;
      }
    },
    watch: {
      curUser: function(curUser) {
        this.userName = curUser.username;
        this.name = curUser.name;
        this.userEmail = curUser.email;
        this.userProfileImgSrc = curUser.img_add;
      }
    }
  }

</script>

<style scoped>
  .myprofile-text {
    font-family: 'Nokora', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    line-height: 40px;
    color: #333333;
  }

  .edit-profile label {

    font-family: 'Nokora', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 10px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #999999;
    text-transform: uppercase;

  }

  .account-type {
    font-family: 'Nokora', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 10px;
    color: #000000;
  }

  .input-with-icon {
    position: relative;
    display: block;
  }

  input[type="text"],
  input[type="email"],
  input:focus {
    background-color: transparent;
    padding: 0;
    box-shadow: none;
    border: none;
    color: #000000 !important;
    font-size: 16px;
    line-height: 10px;
  }

  ::placeholder {
    color: #000000;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: #000000;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* .edit-icon {
    position: absolute;
    right: 0;
    top: 7px;
    cursor: pointer;
  } */
  .check-icon {
    position: absolute;
    right: 22px;
    top: 7px;
    cursor: pointer;
    color: green;
    font-size: 20px;
  }
  .edit-icon {
    position: absolute;
    right: 16px;
    top: 7px;
    cursor: pointer;
  }
  .cancel-icon {
    position: absolute;
    right: 0;
    top: 7px;
    cursor: pointer;
    color: red;
    font-size: 20px;
  }
  ::placeholder {
    color: grey;
  }
  /* Image Upload */

  .avatar-container {
    width: 120px;
    height: 120px;
    border-radius: 75px;
    background-size: cover;
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }

  .overlay {
    position: absolute;
    top: 100%;
    left: 0;
    padding-top: 10px;
    text-align: center;
    width: 100%;
    height: 100%;
    background: rgba(229, 229, 229, 0.90);
    transition: top 0.5s;
    border-radius: unset;
    color: #000000;
  }

  .avatar-container .overlay {
    top: 60%;
  }

  .display-none {
    display: none;
  }

  .img-restricted {
    height: 120px;
    width: 120px;

  }
</style>
