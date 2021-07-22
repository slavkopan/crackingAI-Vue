<template>
  <b-container fluid class="backhround-theme">
  <b-row align-h="center" align-v="center" class="text-center">
    <b-col sm="12" md="12" lg="12" xl="6">
       <div class="main-div">
      <div class="inner-div">
        <div class="content">
          <p>
            Cracking the AI Interview is the best way to prepare for technical AI interviews.
          </p>
          <router-link class="nav-link" :to="{ name: 'AllProblems'}">
            <b-button class="btn-started">Get Started</b-button>
          </router-link>
        </div>
      </div>
    </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
export default {
    name: 'LandingPage',

}
</script>

<style scoped>
.backhround-theme {
  background-color: #3C7299 !important;
  /* min-height: 91vh; */
  /* height: calc(100vh - 780px); */
  min-height: calc(100vh - 74px);

}

.main-div {
  position: relative;
  background-image: url('/static/assets/img/bg/landing-background.png');
  background-repeat: no-repeat;
  /* background-attachment: fixed; */
  background-position: center;
  min-height: 700px;
  background-size: auto;
}

.inner-div {
  position: absolute;
  top: 35%;
  left: 0;
  /* transform: translate(50%, 50%); */

}

.content {
  width: 60%;
  text-align: center;
  margin: auto;
}

.content p {
  font-family: 'Nokora', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 42px;
  text-align: center;
  color: #E5E5E5;
}

.btn-started {
  width: 192px;
  height: 50px;
  background: #E5E5E5 !important;
  border-radius: 10px;
  font-family: 'Nokora', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #333333;
  border: none;
}

.btn-started:hover,
.btn-started:active {
  border: none;
  background: #E5E5E5 !important;
}

/* Media Queries */

@media (min-width: 320px) and (max-width: 480px) {
  
  .main-div{
     background-size: 450px 500px;
    min-height: 580px;
  }
  .content{
    width: 90%;
  }
  .content p {
    font-size: 28px;
  }
  .brand-logo{
    font-size: 25px;
  }
}

@media (min-width: 768px) and (max-width: 990px) {
  .main-div{
     background-size: 600px 550px;
    min-height: 580px;
  }
  
}
@media (min-width: 991px) and (max-width: 1024px) {
  .main-div {
    background-size: 600px 550px;
    min-height: 580px;
  }

  .content {
    width: 46%;
  }

}



/* Test Media  Queries */
/* @media (min-width: 320px) and (max-width: 480px) {
  .main-div {
    background-size: 500px;
    min-height: 530px;
  }

  .content {
    width: 90%;
  }

  .content p {
    font-size: 28px;
  }

}

@media (min-width: 481px) and (max-width: 768px) {
  .main-div {
    background-size: 530px 500px;
    min-height: 560px;
  }

  .content {
    max-width: 50%;
    width: 50%;
  }

  .content p {
    font-size: 25px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .main-div {
        background-size: 600px 600px;
    min-height: 565px;

  }
  .content{
    max-width: 47%;
  }
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .main-div{
    min-height: 565px;
    background-size: 600px 600px;
  }
  .content{
    max-width: 46%;
  }
}

@media (min-width: 1201px) and (max-width: 1440px)  {
  .main-div{
    background-size: 600px;
    min-height: 750px;
  }
  .content{
    max-width: 65%;
    width: auto;
  }
} */

</style>