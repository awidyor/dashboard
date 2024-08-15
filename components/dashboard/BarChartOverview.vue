<template>
  <div class="bg-white border shadow rounded-xl text-card-foreground">
    <div class="p-6">
      <Bar
        :id="chartId"
        :options="options"
        :data="data"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { type ChartData } from 'chart.js'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  chartId: String,
  options: Object,
  data: ChartData<'bar'>
}>()

const options = ref(props.options)
const data = ref(props.data)
</script>
