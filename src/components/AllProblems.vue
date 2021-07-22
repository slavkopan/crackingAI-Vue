<template>
  <b-container fluid>
    <b-row>
      <b-col sm="" md="8" lg="10" xl="10">
        <div class="problems-page">
          <b-row>
            <b-col sm="12" lg="5" md="6" class="mb-4">
              <div class="d-md-flex align-items-center">
                <label class="problem-heading mb-0">Problems</label>
                <div class="d-md-flex col-sm-12">
                  <div class="search-box">
                    <b-input id="searchProblem" placeholder="Search Problem" v-model="searchString" @update="onSearch">
                    </b-input>
                    <span class="search-icon">
                      <b-icon icon="search"></b-icon>
                    </span>
                  </div>
                  <div class="filter-dropdown">
                    <button class="btn btn-filter dropdown-toggle" type="button" id="dropdownMenu1"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Filter
                    </button>
                    <ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                      <li class="dropdown-submenu">
                        <a class="dropdown-item" tabindex="-1" href="#">Difficulty</a>
                        <ul class="dropdown-menu" @click.stop="">
                          <li v-for="option in options" :key="option.value" class="ml-2">
                            <input type="checkbox" v-model="selected" :value="option.value" :id="option.text" />
                            <label :for="option.text" class="ml-1">{{ option.text }}</label>
                          </li>
                        </ul>
                      </li>
                      <li class="dropdown-submenu">
                        <a class="dropdown-item" tabindex="-1" href="#">Category</a>
                        <ul class="dropdown-menu category-submenu" @click.stop="">
                          <li v-for="category in categories" :key="category" class="ml-2">
                            <input type="checkbox" v-model="selected" :value="category" :id="category" />
                            <label :for="category" class="ml-1">{{ category }}</label>
                          </li>
                        </ul>
                      </li>
                      <li class="dropdown-submenu">
                        <a class="dropdown-item" tabindex="-1" href="#">Status</a>
                        <ul class="dropdown-menu" @click.stop="">
                          <li v-for="status in statusOptions" :key="status" class="ml-2">
                            <input type="checkbox" v-model="selected" :value="status" :id="status" />
                            <label :for="status" class="ml-1">{{ status }}</label>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
          <sortable-table8 :rows="filterdQuestions" :columns="columns" :config="config" :classes="classes"
            @on-select-row="chooseQuestion">
            <template slot="sort-asc-icon">
              <b-icon icon="chevron-up"></b-icon>
            </template>
            <template slot="sort-desc-icon">
              <b-icon icon="chevron-down"></b-icon>
            </template>
            <template slot="no-sort-icon">
              <div :classes="classes">
                <b-icon icon="chevron-expand"></b-icon>
              </div>
            </template>

            <!-- Problem Status -->
            <template slot="problem_status" slot-scope="props">
              <b-img src="/static/assets/img/icon/not-started.png" v-if="props.cell_value === 'Incomplete'"
                icon="dash-circle" font-scale="1.5"></b-img>
              <b-img src="/static/assets/img/icon/completed.png" v-if="props.cell_value === 'Complete'"
                icon="check-circle" font-scale="1.5" variant="success"></b-img>
            </template>

            <!-- Difficulty -->
            <template slot="difficulty" slot-scope="props">
              <label class="common-font mb-0" v-if="props.cell_value === 'Easy'">
                <b-icon icon="circle-fill" font-scale="1" variant="success"></b-icon> Easy
              </label>
              <label class="common-font mb-0" v-if="props.cell_value === 'Medium'">
                <b-icon icon="circle-fill" font-scale="1" variant="warning"></b-icon> Medium
              </label>
              <label class="common-font mb-0" v-if="props.cell_value === 'Hard'">
                <b-icon icon="circle-fill" font-scale="1" variant="danger"></b-icon> Hard
              </label>
            </template>

            <!-- Frequency -->
            <template slot="frequency" slot-scope="props">
              <div class="frequency-slot">
                {{props.cell_value}}
                <b-img v-if="!props.row.free && !ifActive()" src="/static/assets/img/icon/lock.png"></b-img>
              </div>
            </template>
          </sortable-table8>
        </div>
      </b-col>
      <b-col sm="" md="4" lg="2" xl="2">
        <div class="chart-container">
          <div class="d-block">
            <b-button block class="custom-button">
              <b-icon icon="star-fill" font-scale="2" aria-hidden="true" class="mr-2"></b-icon>TOP 100 LIKED QUESTIONS
            </b-button>
            <b-button block class="custom-button" @click="questionOfDay()">
              <b-icon icon="question" font-scale="2" aria-hidden="true" class="mr-2"></b-icon>QUESTION OF THE DAY
            </b-button>
          </div>
          <div class="d-block progress-container mt-4">
            <p>Progress</p>
            <b-progress height="2rem" show-progress class="mb-2">
              <b-progress-bar :value="progressBarPercentage" :label="`${((progressBarPercentage))}%`" :style="{backgroundColor}"></b-progress-bar>
            </b-progress>
            <span class="solved">{{`${completedCount}/${questions.length}`}} Solved</span>
          </div>
          <div class="row">
            <div class="barchart mt-4 col-md-12 col-sm-6">
              <bar-chart
                v-if="Object.keys(barChatData).length"
                  :calculatedChartData="barChatData"
              />
            </div>
            <div class="piechart col-md-12 col-sm-6">
              <pie-chart
                v-if="Object.keys(pieChartData).length"
                  :calculatedChartData="pieChartData"
              />
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VueBootstrap4Table from 'sortable-table8'
import ProblemService from '../services/problemService.js'
import UserService from '../services/userService.js'
import { mapGetters } from "vuex"
import BarChart from '@/components/BarChart'
import PieChart from '@/components/PieChart'
import userService from '../services/userService.js'


export default {
  name: 'App',
  data () {
    return {

      // Progress Value
      value: 40,
      backgroundColor: '#668fac',

      // Filter Dropdown
      selected: [], // Must be an array reference!
      options: [
        { text: 'Easy', value: 'easy' },
        { text: 'Medium', value: 'medium' },
        { text: 'Hard', value: 'hard' }
      ],
      statusOptions: ['Incomplete', 'Complete'],
      searchString: null,
      columns: [
      {
        label: 'Problem Number',
        name: 'problem_number',
        sort: true,
        row_text_alignment:  "text-left",
        column_text_alignment:  "text-left",
      },
      {
        label: 'Name',
        name: 'problem_name',

        sort: true,
        row_text_alignment:  "text-left",
        column_text_alignment:  "text-left",
        
      },
      {
        label: 'Difficulty',
        name: 'difficulty',
        sort: true,
        row_text_alignment:  "text-left",
        column_text_alignment:  "text-left",
      },
      {
        label: 'Category',
        name: 'parsedCategory',
        sort: true,
        row_text_alignment:  "text-left",
        column_text_alignment:  "text-left",
      },
      {
        label: 'Status',
        name: 'problem_status',
        sort: true,
        row_text_alignment:  "text-center",
        column_text_alignment:  "text-center",
        
      },
      {
        label: 'Frequency',
        name: 'frequency',
        sort: true,
        row_text_alignment:  "text-center",
        column_text_alignment:  "text-center",
        
        
      }],
      config: {
        card_mode:false,
        rows_selectable: true,
        card_title: 'Problems',
        show_refresh_button: false,
        show_reset_button: false,
        global_search: {
          visibility: false,
          placeholder: "Search Problem"
        },
        multi_column_sort: false,
        pagination_info: false,
        highlight_row_hover_color:"lightgrey",
        per_page_options:  [5, 10, 15],
        sort: true, 
        initial_sort: true,    
        
      },
      classes: {
        cell: {
          // Removed class text-danger text-success text-warning
          'font-weight-bold': function (row, column, cellValue) {
            return column.name == 'difficulty' && row.difficulty == 'Hard'
          },
          'font-weight-bold': function (row, column, cellValue) {
            return column.name == 'difficulty' && row.difficulty == 'Medium'
          },
          'font-weight-bold': function (row, column, cellValue) {
            return (column.name == 'difficulty' && row.difficulty == 'Easy') || (column.name == 'problem_status' && row.problem_status == 'Complete')
          },
          'blur-text-lock':  (row, column, cellValue) => {
            return (!this.ifActive() && row.free === false)
          },

        },
        row: {
          'cursor-pointer': true,
        }
      },
      difficulties: ['Easy', 'Medium', 'Hard'],
      // categories: ['General ML', 'Linear Algebra', 'Linear Algebra, General ML', 'Deep Learning', 'Design', 'Coding'],
      categories: [],
      questions: [],
      filterdQuestions: [],
      pieChartData: {},
      barChatData: {},
      userSolutionCount: 0,
      completedCount: 0,
      progressBarPercentage: 0,
      colors: ['#A6CEE3','#1F78B4','#B2DF8A','#33A02C','#FFA724','#A8E6CE','#83AF9B','#76D7C4','#F8B195','#F67280','#C06C84','#6C5B7B','#355C7D','#9bc400','#39a0ca','#51d0de','#0f2862','#F7882F','#3d7c47','#76c1d4','#9df9ef','#a0d2eb','#fff685','#a28089','#d0bdf4']
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: "loggedIn",
      curUser: "getCurrentUser",
    })
  },
  mounted () {
    this.getProblems();
    this.getUserSolutions();
    this.$root.$on('changedUser', () => {
      this.getProblems();
      this.getUserSolutions();
    })
  },
  methods: {
    onSearch (value) {
      if (value !== null || value !== "") {
        this.filterdQuestions = this.questions.filter((x) => x.problem_name.toLowerCase().includes(value.toLowerCase()));
      }
    },
    chooseQuestion (payload) {
      payload = payload.selected_item
      if (this.loggedIn) {
        const id = payload.id
        if (payload.free || (this.curUser && this.curUser.subscription && this.curUser.subscription.status === "active")) {
          this.$router.push({ name: 'IndividualProblemView', params: { id }})
        }else {
          this.$modal.show('upgrade');
        }
      }else if(payload && payload.free){
        const id = payload.id
        this.$router.push({ name: 'IndividualProblemView', params: { id }})
      }else {
        this.$modal.show("login", {
          auto_prompt: true,
          show_reason: 'subscription'
        });
      }
    },
    parseCategories (arr) {
      let result = ''
      arr.sort()
      for (let i = 0; i < arr.length; i++) {
        result += arr[i]
        if (i != arr.length - 1) {
          result += ', '
        }
      }
      return result
    },
    getProblems () {
      let counter = 1
      const self = this
      ProblemService.getQuestions().then(function (querySnapshot) {
        self.filterdQuestions = querySnapshot.docs.map(doc => {
          let question = doc.data();
          question.id = doc.id
          question.problem_number = counter
          question.problem_name = question.title
          counter++
          question.difficulty = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)
          question.parsedCategory = self.parseCategories(question.category)
          // question.difficulty = self.difficulties[Math.floor(Math.random() * 3)];
          // question.frequency = Math.floor(Math.random() * 11);
          // question.category = self.categories[Math.floor(Math.random() * 4)];
          if (UserService.getCurrentUser() != null && UserService.getCurrentUser().completedQuestions[question.id] == true) {
            question.status = true
            question.problem_status = 'Complete'
          } else {
            question.status = false
            question.problem_status = 'Incomplete'
          }
          if (question.problem_status === "Complete") {
            self.completedCount = self.completedCount + 1;
          }
          return question
        })
        self.questions = self.filterdQuestions;
        self.calculatePieChartData();
        self.calculateBarChartData();
        self.calcProgressBarPercentage();
      })
    },
    calcProgressBarPercentage() {
      this.progressBarPercentage = (this.completedCount / this.questions.length * 100).toFixed();
    },
    ifActive() {
      return (this.curUser.subscription && this.curUser.subscription.status === "active");
    },
    questionOfDay() {
      if (this.questions.length) {
        const min = Math.ceil(1);
        const max = Math.floor(this.questions.length);
        const random = Math.pow(Math.floor(Date.now() / (3600*1000*24)), 3) % max;
        const question = this.questions[random];
        this.$router.push({ name: 'IndividualProblemView', params: { id: question.id }})
      }
    },
    calculatePieChartData() {
      const pieChart = {
        "Easy": 0,
        "Medium": 0,
        "Hard": 0,
        "Incomplete": 0
      }
      this.questions.forEach((data, index) => {
        const { difficulty, problem_status } = data;
        switch(difficulty) {
          case "Easy":
            if (problem_status === "Complete")
              pieChart.Easy++;
            else pieChart.Incomplete++ ;
          break;
          case "Medium":
            if (problem_status === "Complete")
              pieChart.Medium++ ;
            else pieChart.Incomplete++ ;
          break;
          case "Hard":
            if (problem_status === "Complete")
              pieChart.Hard++ ;
            else pieChart.Incomplete++ ;
          break;
        }
        if(index === this.questions.length - 1) {
          this.pieChartData = {...pieChart};
        }
      })
    },
    calculateBarChartData() {
      const barChart = [];
      const allCategories = [];
      const barChartInPercentage = {};
      let colors = [];
      this.questions.forEach((data, index) => {
        const { category, problem_status } = data;
        category.forEach((oneCategory, id) => {
          const categoryExist = allCategories.findIndex((cat) => cat === oneCategory);
          const problem_counter = [];
          if(categoryExist === -1) {
            allCategories.push(oneCategory);
            problem_counter[0] = 0; // total number
            problem_counter[1] = 0; //completed number
            barChart[oneCategory] = problem_counter;
          }
          barChart[oneCategory][0] = barChart[oneCategory][0] + 1;
          if ( problem_status === "Complete")
            barChart[oneCategory][1] = barChart[oneCategory][1] + 1;
        })        
        
        if(index === this.questions.length - 1) {
          Object.keys(barChart).forEach((categoryData, categoryIndex) => {
            barChartInPercentage[categoryData] = (barChart[categoryData][1] / barChart[categoryData][0]) * 100;
            // colors.push(this.randomHexColorCode());
            if(categoryIndex === Object.keys(barChart).length - 1) {
              this.categories = [...allCategories];
              colors = this.getColors(allCategories.length);
              this.barChatData = { chartData: barChartInPercentage, colors };
            }
          })
        }
      })
    },
    async getUserSolutions() {
      if(this.curUser && this.curUser.userId) {
        const { userId } = this.curUser;
        const querySnapshot = await ProblemService.getAllUsersSolution(userId);
        querySnapshot.forEach((doc, index) => {
          this.userSolutionCount = this.userSolutionCount + 1;
        })
      }
    },
    randomHexColorCode() {
      const n = (Math.random() * 0xfffff * 1000000).toString();
      return `#${n.slice(0, 6)}`;
    },
    getColors(length) {
      const dynamicColors = this.colors.slice(0, length);
      return dynamicColors;
    },
    filterByCategory(categoryList, questions) {
      return new Promise((resolve, reject) => {
        let categoryResult = [];
        categoryList.forEach((cat, index) => {
          let filteredCategory = [];
          // filteredCategory = questions.filter((question) => question.parsedCategory.toLowerCase() === cat.toLowerCase());

          questions.forEach((question, questionId) => {
            question.category.forEach((oneCategory, id) => {
              if (oneCategory.toLowerCase() === cat.toLowerCase()){
                filteredCategory.push(question);
              }
            });
          });
          categoryResult = [...categoryResult, ...filteredCategory];
          if(index === categoryList.length - 1) {
            resolve(categoryResult);
          }
        });
      })
    },
    filteredByDifficulty(difficultyList, questions) {
      return new Promise((resolve, reject) => {
        let difficultyResult = [];
        difficultyList.forEach((level, index) => {
          const filteredByDifficulty = questions.filter((question) => question.difficulty.toLowerCase() === level.toLowerCase());
          difficultyResult = [...difficultyResult, ...filteredByDifficulty];
          if(index === difficultyList.length - 1) {
            resolve(difficultyResult);
          }
        })
      })
    },
    filteredByStatus(statusList, questions) {
      return new Promise((resolve, reject) => {
        let statusResult = [];
        statusList.forEach((status, index) => {
          const filteredByStatus = questions.filter((question) => question.problem_status.toLowerCase() === status.toLowerCase());
          statusResult = [...statusResult, ...filteredByStatus];
          if(index === statusList.length - 1) {
            resolve(statusResult);
          }
        })
      })
    },
    resetQuestionNumber(questions) {
      return new Promise((resolve, reject) => {
        if(questions.length > 0) {
            questions.forEach((question, index) => {
            question.problem_number = index + 1;
            if(index === questions.length - 1) {
              resolve(questions);
            }
        });
        } else {
          resolve([]);
        }
      })
    },
    async filterTableData(filters) {
      try {
        let result = [];
        const { category, difficulty, status } = filters;
        if(category.length > 0 && difficulty.length > 0 && status.length > 0) {
          const questions = await this.filterByCategory(category, this.questions);
          const filteredByDifficulty = await this.filteredByDifficulty(difficulty, questions);
          result = await this.filteredByStatus(status, filteredByDifficulty);
        } else if(category.length > 0 && difficulty.length > 0) {
          const questions = await this.filteredByDifficulty(difficulty, this.questions);
          result = await this.filterByCategory(category, questions);
        } else if(category.length > 0 && status.length) {
          const questions = await this.filterByCategory(category, this.questions);
          result = await this.filteredByStatus(status, questions);
        } else if(difficulty.length > 0 && status.length > 0) {
          const question = await this.filteredByDifficulty(difficulty, this.questions);
          result = await this.filteredByStatus(status, question);
        } else if(category.length > 0) {
          result = await this.filterByCategory(category, this.questions);
        } else if(difficulty.length > 0) {
          result = await this.filteredByDifficulty(difficulty, this.questions);
        } else if(status.length > 0) {
          result = await this.filteredByStatus(status, this.questions);
        }
        this.filterdQuestions = [...result];
      } catch(error) {
        console.log("something went wrong")
      }
    },
    applyFilter(filters) {
      const filterTypes = {
        difficulty: [],
        category: [],
        status: []
      }
      if(filters.length > 0) {
        filters.forEach((filter, index) => {
          const isDifficulty = this.options.findIndex((x) => x.value === filter);
          const isStatus = this.statusOptions.findIndex((status) => status === filter);
          if(isDifficulty > -1) {
            filterTypes.difficulty.push(filter)
          } else if(isStatus > -1) {
            filterTypes.status.push(filter)
          } else {
            filterTypes.category.push(filter)
          }
          if(index === filters.length - 1) {
            this.filterTableData(filterTypes);
          }
        })
      } else {
        this.filterdQuestions = [...this.questions]
      }
    }
  },
  components: {
    'sortable-table8': VueBootstrap4Table,
    'bar-chart' : BarChart,
    'pie-chart' : PieChart,

  },
  watch: {
    selected: function(filters) {
      this.applyFilter(filters);
    }
  }
}
</script>

<style scoped>
@import '../assets/css/AllProblems.css';
</style>
