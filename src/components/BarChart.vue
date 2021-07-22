<script>
  import { Bar } from 'vue-chartjs'

  export default {
    extends: Bar,
    props: {
      calculatedChartData: Object
    },
    data() {
      return {
        chartLabels: Object.keys(this.calculatedChartData.chartData),
        chartValues: Object.values(this.calculatedChartData.chartData),
        chartColors: [...this.calculatedChartData.colors],
        options: {
          title: {
            display: true,
            text: 'CATEGORIES',
            position: 'bottom',
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 50,
                max: 100,
                padding: 5,
                callback: function(tick) {
                  return tick.toString() + '%';
                }
              },
              gridLines: {
                display: true,
                tickMarkLength: 0
              }
            }],
            xAxes: [{
              categoryPercentage: 1.0,
              barPercentage: 1.0,

              gridLines: {
                display: false
              },
              ticks:{
                display: true
              }
            }]
          },
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toFixed(1) + '%';
              }
            }
          },
          responsive: true,
          maintainAspectRatio: true,
        }
      }
    },
    mounted() {
      this.renderBarChart(this.chartLabels, this.chartValues, this.chartColors);
    },
    methods: {
      renderBarChart(labels, values, colors) {
        this.renderChart({
          labels: [...labels],
          datasets: [{
            // label: 'Bar Chart',
            borderWidth: 1,
            backgroundColor: [...colors],
            borderColor: [...colors],
            pointBorderColor: '#2554FF',
            data: [...values]
          }]
        }, this.options);
      }
    },
    watch: {
      calculatedChartData: function(props, prevProps) {
        this._data._chart.destroy();
        const { chartData, colors } = props;
        const labels = Object.keys(chartData);
        const values = Object.values(chartData);
        this.renderBarChart(labels, values, colors);
      }
    }
  }
</script>

<style  scoped>

</style>