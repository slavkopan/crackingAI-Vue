<script>
  import { Pie } from 'vue-chartjs'

  export default {
    extends: Pie,
    props: {
      calculatedChartData: Object
    },
    data () {
      return {
        options: {
          legend: {
            display: true,
            align: 'center',
            position: 'right',
            labels:{
                boxWidth: 10,
                font: {
                    color: 'black',
                    family: "'Nokora', sans-serif",
                    size: 10,
                }
            }
          },
          responsive: true,
          maintainAspectRatio: true,
        }
      }
    },
    mounted () {
      const { Easy, Medium, Hard, Incomplete } = this.calculatedChartData;
      this.renderPieChart(Easy, Medium, Hard, Incomplete);
    },
    methods: {
      renderPieChart: function(easy, medium, hard, incomplete) {
        this.renderChart({
          labels: ["Easy", "Medium", "Hard", "Incomplete"],
          datasets: [{
              borderWidth: 1,
              borderColor: [
              '#2ABE27',
              '#FFC700',
              '#EF2222',
              '#1F78B4'
              ],
              backgroundColor: [
              '#2ABE27',
              '#FFC700',
              '#EF2222',
              '#1F78B4'                
              ],
              // data: [1000,	500,	1500]
              data: [easy, medium, hard, incomplete]
            }]
        }, this.options)
      }
    },
    watch: {
      calculatedChartData: function(props, prevProps) {
        const { Easy, Medium, Hard, Incomplete } = props;
        this._data._chart.destroy();
        this.renderPieChart(Easy, Medium, Hard, Incomplete);
      }
    }
  }
</script>

<style scoped>

</style>