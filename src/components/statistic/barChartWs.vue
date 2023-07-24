<template>
  <div class="bar-chart">
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';
import { externalTooltipHandler, labelsDefault } from 'components/statistic/config';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'barChartWs',
  props: {
    dataChart: {
      type: [Array],
      default() {
        return [];
      },
    },
  },
  setup(props) {
    const barChart = ref();
    const { t } = useI18n();

    const maxY = ref(0);
    // const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };
    // const labels = computed(() => {
    //   return props?.dataChart.map((item: any) => item?.milestone) || null
    // });

    const datasetsChart = computed(() => {
      return props.dataChart.map((item: any) => {
        if (item?.total > maxY.value) {
          maxY.value = item?.total;
        }
        return item?.total || null;
      });
    });

    const backgroundColor = computed(() => {
      return props.dataChart?.map((_: any, index: number) => {
        if (index < 8) return '#FFBC54';
        return '#66BB69';
      });
    });
    // const labels = MONTHS;
    const data = computed(() => {
      return {
        labels: labelsDefault,
        datasets: [
          {
            label: 'Task done after due date',
            data: datasetsChart.value || [],
            backgroundColor: [...backgroundColor.value] || '#FFBC54',
            borderWidth: 1,
            borderRadius: 4,
            // hidden: true
            minBarLength: 24,
          },
          {
            label: 'Task done before due date',
            data: [],
            backgroundColor: '#66BB69',
            borderWidth: 1,
            // hidden: true
            minBarLength: 24,
          },
        ],
      };
    });

    const chartConfig = () => {
      return {
        type: 'bar',
        data: data.value,
        plugins: [ChartDataLabels],
        options: {
          // responsive: true,

          plugins: {
            title: {
              align: 'start',
              color: '#3C3C3C',
              display: true,
              font: {
                weight: 'bold',
                size: 16,
              },
              // position: 'left',
              text: t('workspace.chart.task.doneGap'),
            },
            legend: {
              position: 'top',
            },
            tooltip: {
              backgroundColor: '#fff',
              enabled: false,
              position: 'nearest',
              external: externalTooltipHandler,
            },
            datalabels: {
              align: 'end',
              anchor: 'end',
              borderRadius: 4,
              color: '#3C3C3C',
            },
          },
          scales: {
            y: {
              stacked: true,
              ticks: {
                suggestedMin: 0,
                display: false,
              },
              min: 0,
              max: maxY.value > 10 ? maxY.value + 10 : maxY.value + 2,
              title: {
                display: true,
                text: 'Number of tasks',
              },
            },
            x: {
              grid: {
                drawOnChartArea: false,
              },
              stacked: true,
              title: {
                display: true,
                text: 'Number of days',
              },
            },
          },
        },
      };
    };
    // const chartElement = ref();
    // watch(data, (value) => {
    //   console.log('data')
    //   if (props.dataChart) renderChart()
    // })
    // const renderChart = () => {
    //   nextTick(() => {
    //     const config = chartConfig() as any;
    //     barChart.value.options = { ...config };
    //     barChart.value.update();
    //   });
    // };
    onMounted(() => {
      Chart.register(ChartDataLabels);
      const ctx = barChart.value.getContext('2d');
      const config = chartConfig() as any;
      console.log(config);
      const chart = new Chart(ctx, { ...config });
      barChart.value = chart;
    });
    return {
      barChart,
    };
  },
});
</script>

<style scoped lang="scss">
.bar-chart {
  position: relative;
}
</style>
