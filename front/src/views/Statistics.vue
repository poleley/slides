<template>
  <div class="statistics-outer">
    <div class="statistics-inner">
      <h2 class="fw-bold mb-4">Статистика</h2>

      <div class="container">
        <div class="row align-items-center">
          <div class="col col-2">
            <div class="presentation-preview">
              <img :src="imgSrc" alt="Первый слайд">
            </div>
          </div>
          <div class="col col-10">
            <div class="row fw-bold presentation-title">
              {{ presentations.presentation.value.title }}
            </div>
            <div class="row presentation-date">
              {{ dateCreated }}
            </div>
          </div>
        </div>
        <div class="row row-graphic">
          <div class="row-title">
            График просмотров и добавлений в избранное по дням
          </div>
          <div class="graphic">
            <canvas id="graphic"></canvas>
          </div>
        </div>
        <div class="row row-graphic-questions">
          <div class="row-title">
            Статистика по ответам пользователей на вопросы
          </div>
          <div v-for="(question, index) in presentations.presentation.value.questions">
            <canvas class="graphic-question" :id="'graphic-question-' + index"></canvas>
          </div>
        </div>

        <div v-if="isLeads" class="row row-leads">
          <div class="row-title">Лиды</div>
          <table class="table">
            <thead>
            <tr>
              <th>Номер слайда</th>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Email</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="lead in presentations.presentation.value.leads">
              <td>{{ lead.slide.ordering + 1 }}</td>
              <td>{{ lead.last_name }}</td>
              <td>{{ lead.first_name }}</td>
              <td>{{ lead.email }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {usePresentations} from "@/use/presentations";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores";
import {computed, ref} from "vue";
import {Chart} from "chart.js/auto";

const router = useRouter()
const userStore = useUserStore()
const presentations = usePresentations()

const labels = ref([])
const viewsValues = ref([])
const favoriteValues = ref([])
const imgSrc = ref('')
const isLeads = ref(false)

presentations.getStatistics(router.currentRoute.value.params.id).then(
    () => {
      if (userStore.user.id !== presentations.presentation.value.user_id)
        router.replace({name: 'all-presentations'})
      isLeads.value = presentations.presentation.value.leads.length !== 0
      imgSrc.value = `/media/${presentations.presentation.value.first_slide.name}`
      labels.value = Object.keys(presentations.presentation.value.views)
      viewsValues.value = Object.values(presentations.presentation.value.views)
      favoriteValues.value = Object.values(presentations.presentation.value.favorite)
      const data = {
        labels: labels.value,
        datasets: [
          {
            label: 'Просмотры',
            data: viewsValues.value,
            fill: false,
            borderColor: 'rgb(168,168,168)',
            tension: 0.1
          },
          {
            label: 'Добавления в избранное',
            data: favoriteValues.value,
            fill: false,
            borderColor: 'rgb(201,163,105)',
            tension: 0.1
          }
        ]
      }
      new Chart(
          document.getElementById('graphic'),
          {
            type: 'line',
            data: data,
            options: {
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          })
      const questionGraphics = document.querySelectorAll('canvas.graphic-question')
      for (let [index, questionGraphic] of questionGraphics.entries()) {
        let answersChosen = []
        let labels = []
        for (let answer of presentations.presentation.value.questions[index].answer_set) {
          labels.push(answer.answer_text)
          answersChosen.push(answer.chosen_count)
        }
        const questionGraphicData = {
          labels: labels,
          datasets: [{
            label: presentations.presentation.value.questions[index].question_text,
            data: answersChosen,
            backgroundColor: ['rgba(171,124,54,0.4)'],
            borderWidth: 1
          }]
        };
        new Chart(
            questionGraphic,
            {
              type: 'bar',
              data: questionGraphicData,
              options: {
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            }
        )
      }
    }
)

const dateCreated = computed(() => {
  return (new Date(presentations.presentation.value.date_created))
      .toLocaleDateString('ru', {dateStyle: "long"})
})

</script>

<style scoped>
.statistics-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.statistics-inner {
  background-color: rgba(129, 103, 62, 0.2);
  width: 80%;
  height: 100%;
  padding: 1rem;
}

h2 {
  color: #564425;
}

img {
  width: 100%;
}

.presentation-title {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.presentation-date {
  margin-top: 0.25rem;
  font-size: 1.2rem;
}

.row-graphic {
  height: 20rem;
}

.row-graphic, .row-leads, .row-graphic-questions {
  padding: 1rem;
  margin-top: 1rem;
  background-color: white;
}

.row-title {
  font-size: 1.2rem;
  font-weight: bold;
}

</style>