<!-- eslint-disable comma-dangle -->
<script setup lang="ts">
import {
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
} from 'radix-vue'
import { ChevronRightIcon } from '@radix-icons/vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSubTriggerProps & { class?: string }>()
</script>

<template>
  <DropdownMenuSubTrigger
    v-bind="props"
    :class="[
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
        props.class,
      ),
    ]"
  >
    <slot />
    <ChevronRightIcon class="w-4 h-4 ml-auto" />
  </DropdownMenuSubTrigger>
</template>
