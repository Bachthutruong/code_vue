<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
        @click="increment"
      >
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
    <div>===========================</div>
    <p>Count: {{ counter.counter }} / {{ counter.doubleCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <div
      style="width: 100px; height: 100px"
      @click="counter.increment()"
    >
      Clicks on todos
    </div>
    <div>===========================</div>
    <p>Count: {{ main.lang }} / {{ main.getLang }}</p>
    <div
      style="width: 100px; height: 100px"
      @click="main.changeLanguages('vi', this)"
    >
      Clicks on change Languages
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, toRef, Ref } from 'vue';
import { Todo, Meta } from './models';
import { useCounterStore } from 'stores/example-store';
import { useMainStore } from 'stores/main';

function useClickCount() {
  const clickCount = ref(0);

  function increment() {
    clickCount.value += 1;
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

export default defineComponent({
  name: 'ExampleComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => [],
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true,
    },
    active: {
      type: Boolean,
    },
  },
  setup(props) {
    const counter = useCounterStore();
    const main = useMainStore();

    return {
      ...useClickCount(),
      ...useDisplayTodo(toRef(props, 'todos')),
      counter,
      main,
    };
  },
});
</script>
