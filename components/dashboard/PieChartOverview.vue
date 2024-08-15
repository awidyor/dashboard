<template>
  <div class="bg-white border shadow rounded-xl text-card-foreground">
    <div class="p-6">
      <Pie
        :id="chartId"
        :options="options"
        :data="data??[]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pie } from 'vue-chartjs'
import { type ChartData } from 'chart.js'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  chartId: String,
  options: Object,
  data: ChartData<'pie'>
}>()

const options = ref(props.options)
const data = ref(props.data)
</script>
