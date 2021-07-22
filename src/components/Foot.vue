<template>
  <footer>
    <div class="container-fluid">
      <div class="row gap-y align-items-center justify-content-end">
        <div class="col-lg-12">
          <div class="nav nav-bold nav-uppercase nav-trim justify-content-end align-items-center">
            <a class="nav-link" href="#" v-bind:style="{color: navBarColor}">Faq</a> <span v-bind:style="{color: navBarColor}">|</span>
            <a class="nav-link" href="#" v-bind:style="{color: navBarColor}">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Foot',
  data () {
    return {
      msg: 'This is Footer'
    }
  },
  computed: {
      navBarColor() {
         if (this.$route.path === "/") {
            return "#E5E5E5 !important";
         }
         return "#3C7299 !important";
      }
   }
}
</script>

<style scoped>
  footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
    padding: 1.25rem 0;
    text-transform: uppercase;
    max-width: 320px;
    margin: 0 0 0 auto;
  }
  .nav-link, .nav-link:hover{
    font-family: 'Nokora' sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 24px;

  }
  
  @media (max-width: 991.98px) {
  footer{
    display: none;
  }
}
</style>
