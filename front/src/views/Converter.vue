<script setup xmlns="http://www.w3.org/1999/html">

</script>

<template>
  <div class="file-upload-outer">
    <div class="file-upload-inner">
      <h2 class="fw-bold mb-4">Загрузить презентацию</h2>
      <form>
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="file-upload mb-2">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col col-12">
                      Нажмите здесь, чтобы загрузить файл
                    </div>
                    <div class="col col-12">
                      или
                    </div>
                    <div class="col col-12">
                      Перетащите его
                    </div>
                  </div>
                </div>
                <input type="file" class="input-file" accept=".pdf"/>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <label>
                Название
                <input
                    type="text"
                    class="form-control title"
                />
              </label>
            </div>
            <div class="col-12">
              <label>
                Описание
                <textarea
                    class="form-control description"
                    rows="3"
                ></textarea>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

h2 {
  color: #564425;
}

.input-file {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0;
}

.file-upload {
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  position: relative;
  max-width: 100%;
  border: 1px dashed #c9c9c9;
  transition: 0.2s;
  background-color: #e6e6e6;
  text-align: center;
}

.file-upload-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

textarea {
  resize: none;
}

</style>