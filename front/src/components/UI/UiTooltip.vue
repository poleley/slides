<template>
  <span :class="$style.tooltiptext"><slot></slot></span>
</template>

<style module>
.tooltiptext {
  visibility: hidden;
  width: 130px;
  background-color: #564425;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  bottom: 100%;
  left: 50%;
  margin-left: -65px;
  position: absolute;
  z-index: 1;
  font-style: normal;
}

.tooltiptext::after {
  content: " ";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #564425 transparent transparent transparent;
}
</style>